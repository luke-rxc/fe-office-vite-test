import { pathConfig } from '@config';
import { toDateFormat } from '@utils/date';
import { ContentListsSchema, ContentSchema } from '../schemas';
import { ContentListItem } from '../types';
import { UpdateContentListParams } from '../apis';

/**
 * 콘텐츠 테이블 데이터로 변환
 */
export const toContentListModel = (schema?: ContentSchema[]): ContentListItem[] => {
  return (schema || []).map((content, index) => ({
    showroomName: content.showRoomName,
    providerName: content.providerName,
    id: content.storyId,
    order: index + 1,
    name: content.storyName,
    type: content.type,
    imageURL: content.storyImage?.path && `${pathConfig.cdnUrl}/${content.storyImage.path}?im=Resize,width=100`,
    startDate: toDateFormat(content.startDate),
    endDate: content.endDate ? toDateFormat(content.endDate) : '상시',
    status: content.publicStatus,
  }));
};

/**
 * 편성/미편성 콘텐츠 테이블데이터로 변환
 */
export const toContentListsModel = (
  scheme: ContentListsSchema,
): { [key in keyof ContentListsSchema]: ContentListItem[] } => {
  return {
    published: toContentListModel(scheme?.published),
    unpublished: toContentListModel(scheme?.unpublished),
  };
};

/**
 * 콘텐츠 편성 목록 수정을 위한 파라미터 데이터로 변환
 */
export const toContentListUpdateParamsModel = ({
  showroomId,
  items,
  exceptItems,
}: {
  showroomId: number;
  items: ContentListItem[];
  exceptItems: ContentListItem[];
}): UpdateContentListParams => {
  return {
    showroomId,
    ids: items.map((item) => item.id),
    exceptIds: exceptItems.map((item) => item.id),
  };
};
