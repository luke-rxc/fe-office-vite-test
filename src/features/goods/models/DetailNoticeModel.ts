import { DetailNoticeInfoSchema, DetailNoticeTmplSchema } from '../schemas';
import { SelectOptionPropV2 } from '../types';

interface DetailNoticeListsModel {
  [key: number]: DetailNoticeTmplModel[];
}

// Notice List 로 들어가는 Detail List
export type DetailNoticeTmplModel = DetailNoticeTmplSchema;
export interface DetailNoticeModel {
  options: SelectOptionPropV2[];
  lists: DetailNoticeListsModel;
}

export const toDetailNotice = (items: DetailNoticeInfoSchema[]): DetailNoticeModel => {
  const options = [];
  const lists = items.reduce((obj, item) => {
    const { id, name, details } = item;
    options.push({
      label: name,
      value: id,
    });
    return {
      ...obj,
      [id]: details,
    };
  }, {});

  return {
    options,
    lists,
  };
};
