/**
 * Safe abort utilities for streaming SSR on Vercel.
 * Prevents "Controller is already closed" errors caused by race conditions
 * between stream completion and request abort signals.
 */

/**
 * Creates a safe abort signal that prevents "Controller is already closed" errors.
 * Forwards abort from the original signal only before stream completion.
 *
 * @param requestSignal - The original request.signal from the incoming request
 * @returns An object with the safe signal and a markComplete callback
 *
 * @example
 * const {signal, markComplete} = createSafeSignal(request.signal);
 * const body = await renderToReadableStream(<App />, { signal });
 * const safeBody = wrapStreamWithCompletion(body, markComplete);
 */
export function createSafeSignal(requestSignal: AbortSignal) {
  const controller = new AbortController();
  let completed = false;

  requestSignal.addEventListener('abort', () => {
    if (!completed) {
      controller.abort();
    }
  });

  return {
    signal: controller.signal,
    markComplete: () => {
      completed = true;
    },
  };
}

/**
 * Wraps a ReadableStream to call onComplete when the stream finishes.
 * Use with createSafeSignal to prevent late abort signals from causing errors.
 *
 * @param stream - The response body stream from renderToReadableStream
 * @param onComplete - Callback to invoke when the stream completes (typically markComplete)
 * @returns A wrapped ReadableStream that calls onComplete before closing
 */
export function wrapStreamWithCompletion(
  stream: ReadableStream<Uint8Array>,
  onComplete: () => void,
): ReadableStream<Uint8Array> {
  const reader = stream.getReader();

  return new ReadableStream({
    async pull(controller) {
      const {done, value} = await reader.read();
      if (done) {
        onComplete();
        controller.close();
        return;
      }
      controller.enqueue(value);
    },
    cancel() {
      reader.cancel();
    },
  });
}
