import { toDateFormat } from '@utils/date';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { DiscoverFeedStatusColor, DiscoverFeedStatusLabel } from '../constants';
import { DiscoverFeedDisplayGroupSchema } from '../schemas';
import { DiscoverFeedDisplayGroupInfoParams } from '../types';
import { DiscoverSectionItemModel, toDiscoverSectionListModel } from './DiscoverSectionModel';

/**
 * 디스커버 피드 전시그룹 model
 */
export interface DiscoverFeedDisplayGroupModel extends Omit<DiscoverFeedDisplayGroupSchema, 'sections'> {
  displayStartDateText: string;
  displayEndDateText?: string;
  sections: Array<DiscoverSectionItemModel>;
  statusText: string;
  statusColor: string;
  startDateText: string;
  startTimeText: string;
}

/**
 * 디스커버 피드 전시그룹 schema > 디스커버 피드 전시그룹 model convert
 */
export const toDiscoverFeedDisplayGroupModel = (
  item: DiscoverFeedDisplayGroupSchema,
): DiscoverFeedDisplayGroupModel => {
  return {
    ...item,
    displayStartDateText: toDateFormat(item.displayStartDate, 'M/dd a h:mm')
      .replace('AM', '오전')
      .replace('PM', '오후'),
    sections: toDiscoverSectionListModel(item.sections),
    statusText: item.status ? DiscoverFeedStatusLabel[item.status] : null,
    statusColor: item.status ? DiscoverFeedStatusColor[item.status] : null,
    startDateText: format(new Date(item.displayStartDate), 'M월 dd일 (EEE)', { locale: ko }),
    startTimeText: toDateFormat(item.displayStartDate, 'a h:mm').replace('AM', '오전').replace('PM', '오후'),
  };
};

/**
 * 디스커버 전시그룹 종료일자 설정
 */
const setDisplayEndDate = (items: Array<DiscoverFeedDisplayGroupModel>) => {
  const convertItems = items
    .reverse()
    .reduce<{ items: Array<DiscoverFeedDisplayGroupModel>; displayStartDateText: string }>(
      (target, item) => {
        if (target.displayStartDateText !== '') {
          item.displayEndDateText = target.displayStartDateText;
        }
        target.displayStartDateText = item.displayStartDateText;
        target.items.push(item);
        return target;
      },
      { items: [], displayStartDateText: null },
    );

  return convertItems.items.reverse();
};

/**
 * 디스커버 피드 전시그룹 schema list > 디스커버 피드 전시그룹 model list convert
 */
export const toDiscoverFeedDisplayGroupListModel = (
  items: Array<DiscoverFeedDisplayGroupSchema>,
): Array<DiscoverFeedDisplayGroupModel> => {
  const modelItems = items.map(toDiscoverFeedDisplayGroupModel);
  return setDisplayEndDate(modelItems);
};

/**
 * 디스커버 피드 전시그룹 생성/수정 params convert
 */
export const toDiscoverFeedDisplayGroupInfoParams = (
  displayStartDate: string,
  sections: Array<DiscoverSectionItemModel>,
  feedId?: string,
): DiscoverFeedDisplayGroupInfoParams => {
  return {
    displayStartDate: new Date(displayStartDate).getTime(),
    sections: sections.map((item, index) => {
      return {
        id: item.id,
        sortNum: index + 1,
      };
    }),
    ...(feedId ? { feedId } : null),
  };
};
