import { createHmac, createHash } from "node:crypto";

const TENCENT_ASR_HOST = "asr.tencentcloudapi.com";
const TENCENT_ASR_ENDPOINT = `https://${TENCENT_ASR_HOST}/`;
const TENCENT_ASR_SERVICE = "asr";
const TENCENT_ASR_VERSION = "2019-06-14";
const DEFAULT_REGION = process.env.TENCENT_ASR_REGION || "ap-shanghai";
const DEFAULT_ENGINE = process.env.TENCENT_ASR_ENGINE_TYPE || "16k_en";
const MAX_LOCAL_AUDIO_BYTES = 5 * 1024 * 1024;

type TencentCreateRecTaskRequest = {
  ChannelNum: 1;
  EngineModelType: string;
  ResTextFormat: 0 | 1;
  SourceType: 1;
  Data: string;
};

type TencentCreateRecTaskResponse = {
  Response?: {
    Error?: {
      Code: string;
      Message: string;
    };
    Data?: {
      TaskId?: number;
    };
    RequestId?: string;
  };
};

type TencentDescribeTaskStatusResponse = {
  Response?: {
    Error?: {
      Code: string;
      Message: string;
    };
    Data?: {
      TaskId: number;
      Status: number;
      StatusStr: string;
      Result?: string;
      ErrorMsg?: string;
      ResultDetail?: Array<{
        FinalSentence?: string;
        SliceSentence?: string;
      }>;
    };
    RequestId?: string;
  };
};

function sha256(value: string) {
  return createHash("sha256").update(value).digest("hex");
}

function hmacSha256(key: Buffer | string, value: string, encoding?: "hex") {
  const digest = createHmac("sha256", key).update(value).digest();
  return encoding === "hex" ? digest.toString("hex") : digest;
}

function buildAuthorization({
  secretId,
  secretKey,
  payload,
  timestamp,
}: {
  secretId: string;
  secretKey: string;
  payload: string;
  timestamp: number;
}) {
  const date = new Date(timestamp * 1000).toISOString().slice(0, 10);
  const contentType = "application/json; charset=utf-8";
  const canonicalHeaders = `content-type:${contentType}\nhost:${TENCENT_ASR_HOST}\n`;
  const signedHeaders = "content-type;host";
  const hashedPayload = sha256(payload);
  const canonicalRequest = `POST\n/\n\n${canonicalHeaders}\n${signedHeaders}\n${hashedPayload}`;
  const credentialScope = `${date}/${TENCENT_ASR_SERVICE}/tc3_request`;
  const stringToSign = [
    "TC3-HMAC-SHA256",
    String(timestamp),
    credentialScope,
    sha256(canonicalRequest),
  ].join("\n");

  const secretDate = hmacSha256(`TC3${secretKey}`, date);
  const secretService = hmacSha256(secretDate, TENCENT_ASR_SERVICE);
  const secretSigning = hmacSha256(secretService, "tc3_request");
  const signature = hmacSha256(secretSigning, stringToSign, "hex");

  return {
    authorization: `TC3-HMAC-SHA256 Credential=${secretId}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`,
    contentType,
  };
}

async function callTencentAsr<TResponse>(
  action: "CreateRecTask" | "DescribeTaskStatus",
  body: Record<string, unknown>,
) {
  const secretId = process.env.TENCENT_SECRET_ID;
  const secretKey = process.env.TENCENT_SECRET_KEY;

  if (!secretId || !secretKey) {
    throw new Error("Tencent ASR credentials are missing.");
  }

  const payload = JSON.stringify(body);
  const timestamp = Math.floor(Date.now() / 1000);
  const { authorization, contentType } = buildAuthorization({
    secretId,
    secretKey,
    payload,
    timestamp,
  });

  const response = await fetch(TENCENT_ASR_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: authorization,
      "Content-Type": contentType,
      Host: TENCENT_ASR_HOST,
      "X-TC-Action": action,
      "X-TC-Version": TENCENT_ASR_VERSION,
      "X-TC-Region": DEFAULT_REGION,
      "X-TC-Timestamp": String(timestamp),
    },
    body: payload,
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Tencent ASR request failed with ${response.status}.`);
  }

  const data = (await response.json()) as TResponse;

  const error = (data as { Response?: { Error?: { Code: string; Message: string } } }).Response?.Error;
  if (error) {
    throw new Error(`${error.Code}: ${error.Message}`);
  }

  return data;
}

function stripTimestampPrefix(result: string) {
  return result
    .split("\n")
    .map((line) => line.replace(/^\[[^\]]+\]\s*/, "").trim())
    .filter(Boolean)
    .join(" ");
}

function extractTranscript(response: TencentDescribeTaskStatusResponse) {
  const detail = response.Response?.Data?.ResultDetail ?? [];
  const transcriptFromDetail = detail
    .map((item) => item.FinalSentence?.trim() || item.SliceSentence?.trim() || "")
    .filter(Boolean)
    .join(" ");

  if (transcriptFromDetail) {
    return transcriptFromDetail;
  }

  return stripTimestampPrefix(response.Response?.Data?.Result ?? "");
}

export async function transcribeWithTencentAsr(audio: File) {
  if (audio.size > MAX_LOCAL_AUDIO_BYTES) {
    throw new Error("Tencent ASR local audio input must be smaller than 5MB.");
  }

  const buffer = Buffer.from(await audio.arrayBuffer());
  const createResponse = await callTencentAsr<TencentCreateRecTaskResponse>("CreateRecTask", {
    ChannelNum: 1,
    EngineModelType: DEFAULT_ENGINE,
    ResTextFormat: 0,
    SourceType: 1,
    Data: buffer.toString("base64"),
  } satisfies TencentCreateRecTaskRequest);

  const taskId = createResponse.Response?.Data?.TaskId;
  if (!taskId) {
    throw new Error("Tencent ASR did not return a task id.");
  }

  for (let attempt = 0; attempt < 20; attempt += 1) {
    await new Promise((resolve) => setTimeout(resolve, attempt < 3 ? 1200 : 1800));

    const statusResponse = await callTencentAsr<TencentDescribeTaskStatusResponse>(
      "DescribeTaskStatus",
      { TaskId: taskId },
    );

    const status = statusResponse.Response?.Data?.Status;
    if (status === 2) {
      const transcript = extractTranscript(statusResponse);
      if (!transcript) {
        throw new Error("Tencent ASR finished without transcript.");
      }

      return transcript;
    }

    if (status === 3) {
      throw new Error(statusResponse.Response?.Data?.ErrorMsg || "Tencent ASR task failed.");
    }
  }

  throw new Error("Tencent ASR timed out while polling transcript.");
}
