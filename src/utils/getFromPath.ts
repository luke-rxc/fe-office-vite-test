/**
 * object에서 path에 해당하는 값을 리턴
 * @param object target object
 * @param path
 * @param defaultValue 기본값
 */
export function getFromPath<T>(object: T, path: string | Array<string>, defaultValue?: string | number | object) {
  const _path = Array.isArray(path) ? path : path.split('.').filter((i) => i.length);

  if (!_path.length) {
    return object === undefined ? defaultValue ?? '' : object;
  }

  return getFromPath(object[_path.shift()], _path, defaultValue);
}
