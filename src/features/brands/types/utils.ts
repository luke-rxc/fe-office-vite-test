/**
 * 지정된 속성만 Optional로 변경
 * @todo 사용되지 않음, 공통으로 추가하거나 제거
 */
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<T>;
