import { toCommify } from './toCommify';

export function toKRW(money: number): string {
  return toCommify(money, { suffix: '원' });
}
