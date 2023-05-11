import isUndefined from 'lodash/isUndefined';
import { GoodsStatusLabel } from '@constants/goods';
import { BulkUploadGoodsRequestSchema, BulkUploadOptionsRequestSchema, BulkHeaderSchema } from '../schemas';
import { BulkType, BulkReservationType, BulkAutoGenerateKeys } from '../constants';
import { callbackDateConverter } from '../utils';

/****************************************************************
 * Bulk Export Header
 ****************************************************************/
export const toBulkHeader = (data: BulkHeaderSchema): BulkHeaderModel => {
  const { goods, goodsMapping, option } = data;
  const allData = [...goods, ...goodsMapping, ...option];

  return {
    entries: Object.fromEntries(
      allData.map((header) => {
        return [[header.key], header.label];
      }),
    ),
    group: {
      goods: data.goods.map((item) => item.key),
      goodsMapping: data.goodsMapping.map((item) => item.key),
      option: data.option.map((item) => item.key),
    },
  };
};

export interface BulkHeaderModel {
  entries: Record<string, string>;
  group: {
    goods: string[];
    goodsMapping: string[];
    option: string[];
  };
}

/****************************************************************
 * 검색 Field
 ****************************************************************/
export interface BulkUploadField {
  /** 업로드 타입 */
  uploadBulkType: BulkType;
  /** 수정사유 */
  title: string;
  /** 처리예약일자 */
  reservationDate: Date | string;
  /** 처리예약시기 */
  reservationType: BulkReservationType;
}

/****************************************************************
 * 업로드 Model
 ****************************************************************/
/** 일괄수정 업로드 > Goods Schema */
export type BulkUploadGoodsModel = Record<string, any>;
/** 일괄수정 업로드 > Options Schema */
export type BulkUploadOptionModel = Record<string, any>;

/** 일괄수정 업로드 > Goods Schema 가 포함된 Request Schema */
export type BulkUploadGoodsRequestParams = BulkUploadGoodsRequestSchema;
/** 일괄수정 업로드 > Options Schema 가 포함된 Request Schema */
export type BulkUploadOptionsRequestParams = BulkUploadOptionsRequestSchema;

/**
 * 엑셀 내에서의 Key 값 이름과 값 추출
 * @param sheetCode 엑셀 시트 코드
 * @returns
 */
const getItemKeyCode = (sheetCode: Record<string, any>) => {
  return Object.keys(sheetCode).reduce((target, item) => {
    target[sheetCode[item]] = item;

    return target;
  }, {});
};

/**
 * 엑셀데이터를 정해진 SheetCode에 맞게 Data Mapping (Goods)
 * @param uploadedFile 업로드된 파일
 * @returns
 */
export const toConverterGoodsFromExcel = (
  headers: Record<string, string>,
  uploadedFile: Array<Record<string, string>>,
): BulkUploadGoodsRequestParams['goods'] => {
  const itemKeyCode = getItemKeyCode(headers);
  return uploadedFile.map((item) => {
    return Object.keys(item).reduce((target, key) => {
      const param = itemKeyCode[key];
      const value = item[key];
      if (param) {
        if (['keywords', 'searchTags'].includes(param)) {
          const values = value.split(',').map((valueItem) => valueItem.trim());
          target[param] = values;
        } else {
          target[param] = `${value}`.trim() === '' ? null : value;
        }
      }
      return target;
    }, {});
  }) as BulkUploadGoodsRequestParams['goods'];
};

/**
 * 엑셀데이터를 정해진 SheetCode에 맞게 Data Mapping (Options)
 * @param uploadedFile 업로드된 파일
 * @todo 230329 model, schema 점검
 * @returns
 */
export const toConverterOptionsFromExcel = (
  headers: Record<string, string>,
  uploadedFile: Array<Record<string, string>>,
): BulkUploadOptionsRequestParams['option'] => {
  const itemKeyCode = getItemKeyCode(headers);
  return uploadedFile.map((item) => {
    return Object.keys(item).reduce((target, key) => {
      const param = itemKeyCode[key];
      const value = item[key];
      if (param) {
        target[param] = `${value}`.trim() === '' ? null : value;
      }
      return target;
    }, {});
  }) as BulkUploadOptionsRequestParams['option'];
};

const getBulkUploadGoodsStatusKey = (status: string | number | null) => {
  if (status === null) {
    return null;
  }

  const trimStatus = `${status}`.trim();
  const statusKey = Object.keys(GoodsStatusLabel)
    .filter((key) => GoodsStatusLabel[key] === trimStatus)
    .toString();

  return statusKey || trimStatus;
};

const toBulkUploadGoodsParam = (params: BulkUploadGoodsModel) => {
  const { status, ...etcParams } = params;

  return {
    ...(!isUndefined(status) && {
      status: getBulkUploadGoodsStatusKey(status),
    }),
    ...etcParams,
  };
};

const toBulkUploadOptionParam = (params: BulkUploadOptionModel): BulkUploadOptionModel => {
  return params;
};

const toBulkUploadHeader = (params: Record<string, any>) =>
  Object.keys(params).filter((key) => !BulkAutoGenerateKeys.includes(key));

/**
 * 일괄수정 업로드 > 업로드 Request Param Mapping
 * @param fieldValues 필드 값
 * @param convertedUploadItems Converted(toConverterOptionsFromExcel, toConverterGoodsFromExcel) from Excel Data
 * @returns
 */
export const toBulkUploadRequestParams = (
  fieldValues: BulkUploadField,
  convertedUploadItems: BulkUploadGoodsRequestParams['goods'] | BulkUploadOptionsRequestParams['option'],
): BulkUploadGoodsRequestParams | BulkUploadOptionsRequestParams => {
  const { uploadBulkType, title, reservationDate, reservationType } = fieldValues;

  const isBulkGoodsType = uploadBulkType === BulkType.BASE || uploadBulkType === BulkType.MAPPING;
  const items = isBulkGoodsType
    ? (convertedUploadItems as BulkUploadGoodsRequestParams['goods']).map(toBulkUploadGoodsParam)
    : (convertedUploadItems as BulkUploadOptionsRequestParams['option']).map(toBulkUploadOptionParam);

  const headers = toBulkUploadHeader(items[0] as Record<string, any>);

  const baseRequest = {
    headers,
    title,
    reservationDate:
      reservationType === BulkReservationType.RESERVATION ? callbackDateConverter(reservationDate as Date) : null,
  };

  return isBulkGoodsType
    ? ({
        goods: items,
        ...baseRequest,
      } as BulkUploadGoodsRequestParams)
    : ({
        option: items,
        ...baseRequest,
      } as BulkUploadOptionsRequestParams);
};
