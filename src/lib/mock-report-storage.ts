import type { MockAssessmentResult, MockTestSession } from "@/lib/types";

export type StoredMockReport = {
  session: MockTestSession;
  result: MockAssessmentResult;
};

export type StoredPendingMockSubmission = {
  session: MockTestSession;
  recordings: Array<{
    promptId: string;
    blob: Blob;
    durationSeconds: number;
  }>;
  totalDurationSeconds: number;
  createdAt: string;
};

const MOCK_DB_NAME = "ieltsxiaoman-mock-storage";
const MOCK_DB_VERSION = 1;
const PENDING_SUBMISSION_STORE = "pending-mock-submissions";

function openMockStorageDatabase() {
  if (typeof window === "undefined" || !("indexedDB" in window)) {
    return Promise.resolve<IDBDatabase | null>(null);
  }

  return new Promise<IDBDatabase | null>((resolve, reject) => {
    const request = window.indexedDB.open(MOCK_DB_NAME, MOCK_DB_VERSION);

    request.onupgradeneeded = () => {
      const database = request.result;

      if (!database.objectStoreNames.contains(PENDING_SUBMISSION_STORE)) {
        database.createObjectStore(PENDING_SUBMISSION_STORE);
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function withPendingSubmissionStore<T>(
  mode: IDBTransactionMode,
  execute: (store: IDBObjectStore) => Promise<T>,
) {
  const database = await openMockStorageDatabase();
  if (!database) {
    return null as T;
  }

  const transaction = database.transaction(PENDING_SUBMISSION_STORE, mode);
  const store = transaction.objectStore(PENDING_SUBMISSION_STORE);

  try {
    const result = await execute(store);

    await new Promise<void>((resolve, reject) => {
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
      transaction.onabort = () => reject(transaction.error);
    });

    return result;
  } finally {
    database.close();
  }
}

export function getMockReportStorageKey(sessionId: string) {
  return `mock-report-${sessionId}`;
}

export function saveMockReport(sessionId: string, payload: StoredMockReport) {
  if (typeof window === "undefined") {
    return;
  }

  window.sessionStorage.setItem(getMockReportStorageKey(sessionId), JSON.stringify(payload));
}

export function loadMockReport(sessionId: string): StoredMockReport | null {
  if (typeof window === "undefined") {
    return null;
  }

  const raw = window.sessionStorage.getItem(getMockReportStorageKey(sessionId));
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as StoredMockReport;
  } catch {
    return null;
  }
}

export async function savePendingMockSubmission(sessionId: string, payload: StoredPendingMockSubmission) {
  await withPendingSubmissionStore("readwrite", async (store) => {
    store.put(payload, sessionId);
  });
}

export async function loadPendingMockSubmission(sessionId: string) {
  return withPendingSubmissionStore<StoredPendingMockSubmission | null>("readonly", async (store) => {
    return new Promise<StoredPendingMockSubmission | null>((resolve, reject) => {
      const request = store.get(sessionId);
      request.onsuccess = () => resolve((request.result as StoredPendingMockSubmission | undefined) ?? null);
      request.onerror = () => reject(request.error);
    });
  });
}

export async function deletePendingMockSubmission(sessionId: string) {
  await withPendingSubmissionStore("readwrite", async (store) => {
    store.delete(sessionId);
  });
}
