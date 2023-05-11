import { GoodsStatusLabel } from '@constants/goods';
import { BulkExportSchema } from '../schemas';

/****************************************************************
 * 일괄수정서식 다운로드 Form Field
 ****************************************************************/
export interface ListBulkFormField {
  all: boolean;
  baseList: boolean[];
  mappingList: boolean[];
  optionList: boolean[];
}

/**
 * Checkbox 데이터를 Req 데이터로 치환
 * @todo toQueryStateFromCbModel 중복코드 부분 Refactoring 필요
 */
export const toReqDataFromCbModel = (cbModel: boolean[], cbOptions: any[]) => {
  return cbModel.map((isCheck, index) => (isCheck ? cbOptions[index] : null)).filter((item) => !!item);
};

/****************************************************************
 * 일괄 업로드 Excel Download Model
 ****************************************************************/
export const toBulkExportModel = (data: BulkExportSchema) => {
  const { headers, list } = data;
  // match goods in headers

  const result = list.reduce((acc, cur) => {
    const res = Object.fromEntries(
      headers.map((header) => {
        let value = cur[header];
        if (header === 'status') {
          value = GoodsStatusLabel[value];
        }

        return [[header], `${value ?? ''}`];
      }),
    );

    acc.push(res);
    return acc;
  }, []);

  return result as Record<string, string>[];
};
