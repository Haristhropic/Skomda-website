export class RequestBodyError extends Error {
  constructor(public readonly status: 400 | 413, message: string) {
    super(message);
  }
}

/** Count actual stream bytes, including multipart headers, without retaining a
 * chunk list and another full-size copy. The returned view shares one buffer. */
export async function readBoundedRequestBody(request: Request, limit: number): Promise<Uint8Array<ArrayBuffer> | null> {
  const lengthHeader = request.headers.get("content-length");
  let declaredLength: number | null = null;
  if (lengthHeader !== null) {
    if (!/^\d+$/.test(lengthHeader)) throw new RequestBodyError(400, "invalid-content-length");
    declaredLength = Number(lengthHeader);
    if (!Number.isSafeInteger(declaredLength)) throw new RequestBodyError(400, "invalid-content-length");
    if (declaredLength > limit) throw new RequestBodyError(413, "body-too-large");
  }
  if (!request.body || ["GET", "HEAD"].includes(request.method)) return null;

  const reader = request.body.getReader();
  const bytes = new Uint8Array(declaredLength ?? limit);
  let size = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const nextSize = size + value.byteLength;
      if (nextSize > limit || (declaredLength !== null && nextSize > declaredLength)) {
        await reader.cancel();
        throw new RequestBodyError(nextSize > limit ? 413 : 400, nextSize > limit ? "body-too-large" : "content-length-mismatch");
      }
      bytes.set(value, size);
      size = nextSize;
    }
    if (declaredLength !== null && size !== declaredLength) throw new RequestBodyError(400, "content-length-mismatch");
    return bytes.subarray(0, size);
  } finally {
    reader.releaseLock();
  }
}
