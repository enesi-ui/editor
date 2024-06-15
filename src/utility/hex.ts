export function isValidHexCode(hex: string) {
  const reg = /^#([0-9a-f]{3}){1,2}$/i;
  return reg.test(hex);
}

export function addAlpha(color: string, opacity: number) {
  const _opacity = Math.round(Math.min(Math.max(opacity ?? 1, 0), 1) * 255);
  return color + _opacity.toString(16).toUpperCase();
}
