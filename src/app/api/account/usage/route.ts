import { NextResponse } from "next/server";

import { createSupabaseUserClient, ensureAccountUsage, getAuthenticatedUser } from "@/lib/account";

function getAccessToken(request: Request) {
  const authorization = request.headers.get("authorization") || "";
  const token = authorization.replace(/^Bearer\s+/i, "").trim();
  return token || null;
}

export async function GET(request: Request) {
  const accessToken = getAccessToken(request);

  if (!accessToken) {
    return NextResponse.json({ error: "Login required." }, { status: 401 });
  }

  try {
    const supabase = createSupabaseUserClient(accessToken);
    const user = await getAuthenticatedUser(supabase);
    const usage = await ensureAccountUsage(supabase, user);

    return NextResponse.json(usage);
  } catch {
    return NextResponse.json({ error: "Failed to load account usage." }, { status: 401 });
  }
}
