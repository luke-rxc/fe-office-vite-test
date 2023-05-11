import XLSX, { AOA2SheetOpts, JSON2SheetOpts } from 'xlsx';
import { saveAs } from 'file-saver';

export const ExcelFileType = ['xlsx', 'xlsb', 'xlsm', 'xls'];
export const ExcelFileAccept = ExcelFileType.map((x) => `.${x}`).join(',');
export const ExcelParsingType = {
  ARRAY: 'array',
  JSON: 'json',
} as const;

export interface ExportProps {
  // 시트 이름
  sheetName?: string;
  // 시트 데이터
  sheetData: any[] | any[][];
  // export할 파일 name
  fileName?: string;
  // header 여부
  headers?: string[][] | { [key: string]: string }[][];
  // 엑셀 Create 시, Col width 사이즈를 글자에 맞게 조정 여부
  autoFit?: boolean;
  // 내부 로직이 글자수로 width를 책정하고 있기 때문에, 똑같은 길이의 한글같은 경우는 영문과 다를 수 있음 (계산 된 값 * autoFitRatio, 기본 값 1)
  autoFitRatio?: number;
  // 데이터가 비어있을 경우 최소 width
  columnMinSize?: number;
  // 기본 xlsx options
  opts?: JSON2SheetOpts | AOA2SheetOpts;
  // Data Parsing Type
  parsingType?: ValueOf<typeof ExcelParsingType>;
}
interface ImportProps {
  file: File;
  parsingType?: ValueOf<typeof ExcelParsingType>;
  readOpt?: XLSX.ParsingOptions;
  sheetJsonOpt?: XLSX.Sheet2JSONOpts;
}

/**
 * 엑셀 Create 시, Col width 사이즈를 글자에 맞게 조정
 *
 * @param {any[]} sheetData SheetData
 * @param {number} [ratio] 해당 로직이 글자의 길이로만 계산하기 때문에, 한글은 실제 길이에 비해 실제 width 는 작을 수 있음
 *                         계산 된 값에 해당 ratio 를 곱한 값으로 전체 Cell의 Col width를 증가시킴
 * @param {number} columnMinSize 최소 width
 * @return {{ width: number }[]} ws['!cols']에 적용되는 값
 */
const autofitColumns = (sheetData: any[], ratio: number = 1, columnMinSize: number = 1): { width: number }[] => {
  const objectMaxLength: number[] = [];

  sheetData.forEach((sheet) => {
    Object.entries(sheet).forEach(([t, v], idx) => {
      const columnValue = (v as string).toString();
      objectMaxLength[idx] = objectMaxLength[idx] >= columnValue.length ? objectMaxLength[idx] : columnValue.length;
    });
  });
  return objectMaxLength.map((w: number) => ({ width: Math.max(w, columnMinSize) * ratio }));
};

/** ArrayBuffer 생성 */
const s2ab = (s: any) => {
  // convert s to arrayBuffer
  const buf = new ArrayBuffer(s.length);
  // create uint8array as viewer
  const view = new Uint8Array(buf);
  // convert to octet
  for (let i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xff;
  return buf;
};

/**
 * export Excel
 *
 * @param {ExportProps} {
 *   parsingType = ExcelParsingType.JSON,
 *   sheetData: originalSheetData,
 *   sheetName = 'untitled',
 *   fileName = 'sheet.xlsx',
 *   headers,
 *   autoFit,
 *   autoFitRatio,
 *   opts,
 * }
 * @link https://github.com/SheetJS/sheetjs/tree/master/demos/react
 * @example
 * ```
 * excelExport({
 *  sheetData: [
 *   {
 *      opt1_옵션이름1: '옵션값1',
 *      opt2_옵션이름2: '옵션값2',
 *      관리코드: 'custom0',
 *      수수료: 0,
 *      재고수량: 0,
 *      정상가: 0,
 *      판매가: 0,
 *      할인율: 0,
 *    },
 *    {
 *      opt1_옵션이름1: 'A',
 *      opt2_옵션이름2: 'S',
 *      관리코드: 'custom1',
 *      수수료: 12,
 *      재고수량: 23,
 *      정상가: 1000,
 *      판매가: 500,
 *      할인율: 50,
 *    },
 *  ],
 * })
 * ```
 * @example header가 필요한 경우
 * ```
 * excelExport({
 *   sheetData: responseData, // 리턴받은 데이터
 *   headers: [['이미지 주소', '입점사', '상품 ID', '상품명', '카테고리', '판매상태', '시작일', '종료일']],
 *   autoFit: true,
 *   autoFitRatio: 1.2,
 * });
 * ```
 */
export const excelExport = ({
  parsingType = ExcelParsingType.JSON,
  sheetData: originalSheetData,
  sheetName = 'untitled',
  fileName = 'sheet.xlsx',
  headers,
  autoFit,
  autoFitRatio,
  columnMinSize,
  opts,
}: ExportProps) => {
  const sheetData = parsingType === ExcelParsingType.ARRAY && headers ? originalSheetData.slice(1) : originalSheetData;

  const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet([]);

  if (headers) {
    XLSX.utils.sheet_add_aoa(ws, headers);
  }

  parsingType === ExcelParsingType.JSON
    ? XLSX.utils.sheet_add_json(ws, sheetData, { origin: `A${(headers?.length ?? 0) + 1}`, skipHeader: !!headers })
    : XLSX.utils.sheet_add_aoa(ws, sheetData, opts);

  if (autoFit) {
    ws['!cols'] = autofitColumns(sheetData, autoFitRatio, columnMinSize);
  }

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, sheetName);

  const wbout = XLSX.write(wb, { bookType: 'xlsx', bookSST: true, type: 'binary' });
  saveAs(new Blob([s2ab(wbout)], { type: 'application/octet-stream' }), fileName);
};

/**
 * import Excel
 *
 * @param {ImportProps} { file, parsingType = ExcelParsingType.JSON }
 * @return {*}  {Promise<unknown>}
 * @link https://github.com/SheetJS/sheetjs/tree/master/demos/react
 * @example
 * ```
 * const handleExcelUpload = async (e) => {
 *   const files = e.target.files;
 *   const uploadedFile = await excelImport({
 *     file: files[0],
 *   });
 *   e.target.value = '';
 * }
 *
 * <input
 *   accept={ExcelFileAccept}
 *   style={{ display: 'none' }}
 *   id="excelUpload"
 *   type="file"
 *   onChange={handleExcelUpload}
 * />
 * ```
 */
export const excelImport = ({
  file,
  parsingType = ExcelParsingType.JSON,
  readOpt = {},
  sheetJsonOpt = {},
}: ImportProps): Promise<unknown> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    const rABS = !!reader.readAsBinaryString;
    rABS ? reader.readAsBinaryString(file) : reader.readAsArrayBuffer(file);
    reader.onload = (e: ProgressEvent<FileReader>) => {
      /* Parse data */
      const bstr = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, { type: rABS ? 'binary' : 'array', ...readOpt });
      const wsname = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];
      const dataHeaderParsingOpt =
        parsingType === ExcelParsingType.JSON ? { defval: '', ...sheetJsonOpt } : { header: 1, ...sheetJsonOpt };
      const data = XLSX.utils.sheet_to_json(ws, dataHeaderParsingOpt);
      resolve(data);
    };

    reader.onerror = (e: ProgressEvent<FileReader>) => {
      reject(e);
    };
  });
};
