/**
 * 콤마 처리
 * @param n {number} 숫자
 * @param options { prefix?: string; suffix?: string }
 * @returns prefix + 콤마 처리 된 n + suffix
 */
export function toCommify(n: number, options: { prefix?: string; suffix?: string }): string {
  const { prefix, suffix } = options;

  return [prefix, n.toLocaleString(), suffix].join('');
}
