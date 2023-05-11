/**
 * camel case 로 변환
 */
export const toCamelCase = (value: string) => {
  if (typeof value !== 'string') {
    window.console.error(`Type Error::${value}`);
    return '';
  }

  return value.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase());
};

/**
 * time format 여부 확인
 */
export const isTimeFormat = (value: string) => {
  var regex = RegExp(/^\d{2}:\d{2}:\d{2}$/);
  return regex.test(value);
};

/**
 * json string 여부 확인
 */
export const isJsonString = (data: string) => {
  try {
    var json = JSON.parse(data);
    return typeof json === 'object';
  } catch (e) {
    return false;
  }
};
