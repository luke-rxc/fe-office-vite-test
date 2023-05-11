import first from 'lodash/head';
import isEqual from 'lodash/isEqual';
import findIndex from 'lodash/findIndex';

/**
 * 특정 아이템 기준으로 앞/뒤 이동을 위한 index를 반환
 */
export const getMovePos = <T>(items: T[], item: T, direction: 'up' | 'down'): number => {
  if (direction === 'up') {
    return Math.max(findIndex(items, (v) => isEqual(item, v)) - 1, 0);
  }

  if (direction === 'down') {
    return Math.min(findIndex(items, (v) => isEqual(item, v)) + 1, items.length);
  }
};

/**
 * 배열에 포함되어 있는지 확인
 */
export const isIncluded = <T>(items: T[], item: T): boolean => {
  return items.findIndex((v) => isEqual(item, v)) > -1;
};

/**
 * A배열에 포함된 B배열의 아이템을 반환 (A와 B의 교집합 반환)
 */
export const included = <T>(items: T[], values: T[]): T[] => {
  return items.filter((item) => isIncluded<T>(values, item));
};

/**
 * A배열에 포함된 B배열의 아이템을 제거 (A와 B의 교집합을 제거한 A배열 반환)
 */
export const remove = <T>(items: T[], values: T[]): T[] => {
  return items.filter((item) => !isIncluded<T>(values, item));
};

/**
 * A배열의 특정 위치에 B배열을 추가(default: lastIndex)
 */
export const insert = <T>(items: T[], values: T[], index?: number): T[] => {
  return items
    .slice(0, index)
    .concat(values)
    .concat(items.slice(index ?? items.length));
};

/**
 * 특정 아이템를 배열 맨 앞으로 이동
 */
export const toTop = <T>(items: T[], values: T[]): T[] => {
  const moves = included<T>(items, values);

  return [...moves, ...remove(items, moves)];
};

/**
 * 특정 아이템를 배열 맨 뒤로 이동
 */
export const toBottom = <T>(items: T[], values: T[]): T[] => {
  const moves = included<T>(items, values);

  return [...remove(items, moves), ...moves];
};

/**
 * 특정 아이템를 index 1만큼 앞으로 이동
 */
export const toForward = <T>(items: T[], values: T[]): T[] => {
  const moves = included<T>(items, values);

  return insert<T>(remove(items, moves), moves, getMovePos(items, first(moves), 'up'));
};

/**
 * 특정 아이템를 index 1만큼 뒤로 이동
 */
export const toBackward = <T>(items: T[], values: T[]): T[] => {
  const moves = included<T>(items, values);

  return insert<T>(remove(items, moves), moves, getMovePos(items, first(moves), 'down'));
};
