/**
 * 일괄수정 업로드 Validation
 * @reference
 */

import difference from 'lodash/difference';
import { BulkType, BulkMessage } from '../constants';
import type { BulkHeaderModel } from '../models';
import type { BulkExportErrorListModel } from '../components/bulk';

export const validationUploadBulkHeader = (
  // 기준 Header Set
  bulkHeaders: BulkHeaderModel,
  // 업로드할 Bulk Type
  uploadBulkType: BulkType,
  // 업로드 데이터
  uploadData: Record<string, string>,
) => {
  const {
    group: { goods, goodsMapping, option },
  } = bulkHeaders;

  const defaultGroup: string[] =
    uploadBulkType === BulkType.BASE ? goods : uploadBulkType === BulkType.MAPPING ? goodsMapping : option;

  const uploadDataKeys = Object.keys(uploadData);

  // 엑셀 파일의 헤더와 기본 헤더가 일치하는지 확인, diff의 갯수가 없으면 정상 업로드
  const diff = difference(uploadDataKeys, defaultGroup);
  return !diff.length;
};

const isNegativeNumber = (value: string) => {
  return isNaN(+value) || +value < 0;
};

const isFloatNumber = (value: string) => {
  return !/^[0-9]*$/.test(value);
};

const checkOptionConsumerPrice = (consumerPrice: string, price: string) => {
  let reason: string = null;

  // 소비자가 체크
  if (consumerPrice) {
    if (isNegativeNumber(consumerPrice) || isFloatNumber(consumerPrice)) {
      reason = `소비자가는 ${BulkMessage.FAIL_UPLOAD_VALIDATE.POSITIVE}`;
    } else if (price && +consumerPrice < +price) {
      reason = '판매가는 정상가보다 클 수 없습니다';
    } else if (+consumerPrice < 100) {
      reason = `소비자가는 ${BulkMessage.FAIL_UPLOAD_VALIDATE.MIN_PRICE}`;
    } else if (+consumerPrice % 10 !== 0) {
      reason = `소비자가는 ${BulkMessage.FAIL_UPLOAD_VALIDATE.UNIT_PRICE}`;
    }
  }
  return reason ? `${reason} (입력된 값 : ${consumerPrice})` : null;
};

const checkOptionPrice = (price: string) => {
  let reason: string = null;

  if (price) {
    if (isNegativeNumber(price) || isFloatNumber(price)) {
      reason = `판매가는 ${BulkMessage.FAIL_UPLOAD_VALIDATE.POSITIVE}`;
    } else if (+price < 100) {
      reason = `판매가는 ${BulkMessage.FAIL_UPLOAD_VALIDATE.MIN_PRICE}`;
    } else if (+price % 10 !== 0) {
      reason = `판매가는 ${BulkMessage.FAIL_UPLOAD_VALIDATE.UNIT_PRICE}`;
    }
  }

  return reason ? `${reason} (입력된 값 : ${price})` : null;
};

const checkOptionStock = (stock: string) => {
  let reason: string = null;

  if (stock) {
    if (isNegativeNumber(stock) || isFloatNumber(stock)) {
      reason = `재고수량은 ${BulkMessage.FAIL_UPLOAD_VALIDATE.POSITIVE}`;
    }
  }

  return reason ? `${reason} (입력된 값 : ${stock})` : null;
};

const checkOptionCommissionRate = (commissionRate: string) => {
  let reason: string = null;

  if (commissionRate) {
    if (isNegativeNumber(commissionRate)) {
      reason = `수수료는 ${BulkMessage.FAIL_UPLOAD_VALIDATE.POSITIVE}`;
    } else if (!/^\d+((.)|(.\d{0,1})?)$/.test(commissionRate)) {
      reason = '수수료는 소수점 1자리 까지만 가능합니다';
    } else if (+commissionRate > 100) {
      reason = '수수료율은 100%를 넘을 수 없습니다';
    }
  }

  return reason ? `${reason} (입력된 값 : ${commissionRate})` : null;
};

export const validationUploadBulkData = (
  uploadBulkType: BulkType,
  uploadData: Record<string, string>[],
): BulkExportErrorListModel[] => {
  if (uploadBulkType !== BulkType.OPTION) {
    return [];
  }

  return uploadData.reduce((acc, cur, index) => {
    const { consumerPrice, price, stock, commissionRate, optionId, goodsId } = cur;

    const trimConsumerPrice = consumerPrice ? `${consumerPrice}`.trim() : '';
    const trimPrice = price ? `${price}`.trim() : '';
    const trimStock = stock ? `${stock}`.trim() : '';
    const trimConsumerRate = commissionRate ? `${commissionRate}`.trim() : '';

    const consumerPriceReason = checkOptionConsumerPrice(trimConsumerPrice, trimPrice);
    const priceReason = checkOptionPrice(trimPrice);
    const stockReason = checkOptionStock(trimStock);
    const commissionRateReason = checkOptionCommissionRate(trimConsumerRate);

    const reasons = [consumerPriceReason, priceReason, stockReason, commissionRateReason].filter((reason) => !!reason);

    const reasonList = reasons.map((reason, reasonIndex) => ({
      id: `${goodsId}_${index}_${reasonIndex}`,
      goodsId,
      optionId,
      reason,
    }));

    return [...acc, ...reasonList];
  }, []);
};
