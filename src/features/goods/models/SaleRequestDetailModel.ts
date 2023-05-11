import { SaleRequestOptionInfoSchema, SaleRequestOptionSchema } from '../schemas';
import { toCommify } from '@utils/toCommify';

export interface SaleRequestOptionModel
  extends Omit<SaleRequestOptionSchema, 'consumerPrice' | 'price' | 'toConsumerPrice' | 'toPrice' | 'commissionRate'> {
  consumerPriceText: string;
  toConsumerPriceText: string;
  isConsumerPriceChange: boolean;
  priceText: string;
  toPriceText: string;
  isPriceChange: boolean;
  commissionRateText: string;
}

const toSaleRequestOptionModel = (item: SaleRequestOptionSchema): SaleRequestOptionModel => {
  const { consumerPrice, toConsumerPrice, price, toPrice, commissionRate, ...etcItems } = item;

  const commifyOptions = { prefix: '', suffix: '' };

  return {
    ...etcItems,
    consumerPriceText: toCommify(consumerPrice, commifyOptions),
    toConsumerPriceText: toCommify(toConsumerPrice, commifyOptions),
    isConsumerPriceChange: consumerPrice !== toConsumerPrice,
    priceText: toCommify(price, commifyOptions),
    toPriceText: toCommify(toPrice, commifyOptions),
    isPriceChange: price !== toPrice,
    commissionRateText: commissionRate ? `${commissionRate}%` : '',
  };
};

export const toSaleRequestOptionModelList = (data: SaleRequestOptionInfoSchema): SaleRequestOptionModel[] => {
  return data?.options.map(toSaleRequestOptionModel);
};
