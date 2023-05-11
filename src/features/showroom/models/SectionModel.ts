import { toDateFormat } from '@utils/date';
import { SectionListSchema, SectionListItemSchema } from '../schemas';
import { SectionListItem, SectionFormFields } from '../types';
import { UpdateSectionListParams, CreateSectionParams } from '../apis';

export const toSectionListModel = (schema: SectionListSchema): SectionListItem[] =>
  (schema.content || []).map(({ id, sortNumber, title, type, status, contentCount, createdDate, updatedDate }) => {
    return {
      id,
      order: sortNumber,
      title,
      type,
      status,
      contentCount,
      createdDate: createdDate ? toDateFormat(createdDate) : '',
      updatedDate: updatedDate ? toDateFormat(updatedDate) : '',
    };
  });

export const toSectionListParamsModel = ({
  sectionId,
  showroomId,
  name: title,
  order: sortNumber,
  status,
  contentIds,
}: SectionFormFields & Pick<UpdateSectionListParams, 'showroomId' | 'sectionId'>): UpdateSectionListParams => {
  return {
    sectionId,
    showroomId,
    title,
    sortNumber,
    status,
    contentIds,
  };
};

export const toSectionInfoModel = (schema: SectionListItemSchema): SectionFormFields => {
  const { title: name, sortNumber: order, status } = schema;

  return {
    name,
    order,
    status,
    contentIds: [],
  };
};

export const toSectionCreateParamsModel = ({
  showroomId,
  name: title,
  order: sortNumber,
  status,
  contentIds,
}: SectionFormFields & Pick<UpdateSectionListParams, 'showroomId'>): CreateSectionParams => {
  return {
    showroomId,
    title,
    sortNumber,
    status,
    contentIds,
  };
};
