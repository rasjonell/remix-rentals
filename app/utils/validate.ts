export function validateMinimumLength(len: number, content: unknown) {
  if (!(typeof content === 'string' && content.length >= len)) {
    return `must be at least ${len} characters long`;
  }
}
