// Share only an in-flight read. Settled results and failures are never retained.
// Use only for request-independent reads, never identity or authorization checks.
export function singleFlight<T>(read: () => Promise<T>): () => Promise<T> {
  let pending: Promise<T> | undefined;
  return () => {
    if (!pending) pending = Promise.resolve().then(read).finally(() => { pending = undefined; });
    return pending;
  };
}
