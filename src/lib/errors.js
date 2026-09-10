export function isAbortError(error) {
  const message = error?.message || '';
  return error?.name === 'AbortError' || message.includes('AbortError') || message.includes('signal is aborted');
}
