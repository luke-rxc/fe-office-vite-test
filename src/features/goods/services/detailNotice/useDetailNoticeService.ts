import { useEffect, useState } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { useQuery } from '@hooks/useQuery';
import { DetailDetailNoticeSchema } from '../../schemas';
import { getNotice } from '../../apis';
import { DetailNoticeModel, DetailNoticeTmplModel, toDetailNotice } from '../../models';
import { QueryKey } from '../../constants';

export const useDetailNoticeService = () => {
  const { data: noticeInfos } = useQuery(
    [QueryKey.Detail.Notice],
    async () => {
      const res: DetailDetailNoticeSchema = await getNotice();
      return res;
    },
    {
      select: (data): DetailNoticeModel => {
        return toDetailNotice(data?.informationNotices);
      },
    },
  );

  const { control, setValue, getValues } = useFormContext();
  const noticeTemplatesFieldArray = useFieldArray({
    control,
    name: 'noticeTemplates',
  });
  const { fields } = noticeTemplatesFieldArray;

  const [templates, setTemplates] = useState<DetailNoticeTmplModel[]>(getValues('noticeTemplates') ?? null);

  /** 상품군 선택 Change */
  const handleChangeTemplateType = (
    evt: React.ChangeEvent<{
      name?: string;
      value: unknown;
      event: Event | React.SyntheticEvent<Element, Event>;
    }>,
  ) => {
    const { value } = evt.target;
    setTemplates(noticeInfos.lists[value as number]);
  };

  /** 상품군 선택후 TextField를 일관되게 채우기 */
  const handleContentsFill = () => {
    const filledFields = fields.map((field) => ({
      ...field,
      contents: '상품상세페이지 참조',
    }));
    setValue('noticeTemplates', filledFields);
  };

  /** 변경된 Template Data 화면 Display */
  useEffect(() => {
    const noticeTemplates =
      templates?.map(({ title, contents }) => ({
        title,
        contents: contents ?? '',
      })) ?? [];

    setValue('noticeTemplates', [...noticeTemplates]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [templates, setValue]);

  return {
    noticeInfos,
    fields,
    handleChangeTemplateType,
    handleContentsFill,
  };
};
