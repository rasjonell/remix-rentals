export function invertHex(hex: string) {
  return (Number(`0x1${hex}`) ^ 0xffffff).toString(16).substring(1).toUpperCase();
}
