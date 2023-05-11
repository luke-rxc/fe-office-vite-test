import React from 'react';
import { FieldErrors } from 'react-hook-form';
import { Button } from '@material-ui/core';
import { Table } from '@components/table/Table';
import { FormControlTextField } from '@components/form';
import { StateModel } from '../../models';

interface Props {
  errors?: FieldErrors;
  items: Record<'id', string>[];
  onContentsFill: () => void;
}

export const DetailNoticeTable: React.FC<Props> = ({ items, errors, onContentsFill: handleContentsFill }) => {
  if (!items || !items.length) {
    return null;
  }
  return (
    <Table
      columns={[
        {
          label: '항목',
          dataKey: 'title',
          width: '30%',
          render: (value, _, index) => {
            return (
              <span>
                {index + 1}. {value}
              </span>
            );
          },
        },
        {
          label: () => (
            <>
              정보
              <Button variant="outlined" onClick={handleContentsFill} sx={{ mx: 2 }}>
                ‘상품상세페이지 참조’로 전체 입력
              </Button>
            </>
          ),
          dataKey: 'contents',
          width: '70%',
          render: (value, item, index) => {
            return (
              <FormControlTextField<StateModel>
                fullWidth
                multiline
                triggerPressEnterSubmit
                name={`noticeTemplates.${index}.contents`}
                error={!!errors.noticeTemplates?.[index]?.contents}
                helperText={errors.noticeTemplates?.[index]?.contents?.message}
              />
            );
          },
        },
      ]}
      items={items}
      rowKey="title"
      pagination={false}
    />
  );
};
