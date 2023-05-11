import React from 'react';
import { Typography, Button } from '@material-ui/core';
import { Table } from '@components/table/Table';
import { Modal } from '@components/Modal';
import { toDateFormat } from '@utils/date';
import { TempListModel } from '../../models';

interface Props {
  isOpen: boolean;
  lists: TempListModel[];
  onModalClose?: () => void;
  onLoadTemporaryList: (goodsTemporaryId: number) => void;
  onDeleteTemporary: (_: unknown) => void;
}

const getDisplayDateFormat = (value: string) => {
  return isNaN(+value) ? '' : toDateFormat(+value, 'yyyy/MM/dd');
};

export const DetailTempModal: React.FC<Props> = ({
  isOpen,
  lists,
  onModalClose: handleModalClose,
  onLoadTemporaryList: handleLoadTempList,
  onDeleteTemporary: handleRemoveTemp,
}) => {
  return (
    <Modal open={isOpen} title="임시저장 리스트" onConfirm={handleModalClose} maxWidth={1200}>
      <Typography color="primary" variant="body2" paragraph>
        임시저장은 최근 등록기준으로 최대 40개까지 저장되며, 저장(등록완료)된 임시저장건은 자동삭제됩니다.
      </Typography>
      <Table
        columns={[
          {
            label: '저장날짜',
            dataKey: 'date',
            align: 'center',
            width: '25%',
            render: (value) => getDisplayDateFormat(value),
          },
          {
            label: '상품명',
            dataKey: 'goodsTemporaryName',
            align: 'center',
            width: '55%',
          },
          {
            label: '선택',
            dataKey: 'selectButton',
            align: 'center',
            width: '10%',
            render: (_, { goodsTemporaryId }) => (
              <Button size="medium" variant="contained" onClick={() => handleLoadTempList(goodsTemporaryId)}>
                선택
              </Button>
            ),
          },
          {
            label: '삭제',
            dataKey: 'deleteButton',
            align: 'center',
            width: '10%',
            render: (_, { goodsTemporaryId }, listIdx) => (
              <Button
                size="medium"
                variant="contained"
                onClick={() => {
                  handleRemoveTemp({
                    goodsTemporaryId,
                    listIdx,
                  });
                }}
              >
                삭제
              </Button>
            ),
          },
        ]}
        items={lists.map(({ createdDate, updatedDate, name, id, ...props }) => ({
          date: updatedDate || createdDate,
          goodsTemporaryName: name,
          goodsTemporaryId: id,
          ...props,
        }))}
        pagination={false}
        rowKey="goodsTemporaryId"
      />
    </Modal>
  );
};
