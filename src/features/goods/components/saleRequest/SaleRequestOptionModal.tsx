import React from 'react';
import { Typography } from '@material-ui/core';
import { Modal } from '@components/Modal';
import { Table, TableColumnProps } from '@components/table/Table';
import { SaleRequestOptionModel } from '../../models';

// type ModalProps = typeof Modal;

interface Props {
  isOpen: boolean;
  isOptionLoading: boolean;
  optionLists: SaleRequestOptionModel[];
  onClose: () => void;
}

const changeTypoProps = {
  color: 'secondary',
  fontWeight: 'bold',
};

const tableColumns: Array<TableColumnProps<SaleRequestOptionModel>> = [
  {
    label: '옵션번호',
    dataKey: 'optionId',
    align: 'center',
  },
  {
    label: '옵션명',
    dataKey: 'optionName',
    align: 'center',
  },
  {
    label: '정상가',
    dataKey: 'consumerPrice',
    align: 'center',
    render: (_, { consumerPriceText, toConsumerPriceText, isConsumerPriceChange }) => (
      <>
        <Typography variant="body2">{consumerPriceText}</Typography>
        {isConsumerPriceChange && (
          <>
            ▽
            <br />
            <Typography variant="body2" {...changeTypoProps}>
              {toConsumerPriceText}
            </Typography>
          </>
        )}
      </>
    ),
  },
  {
    label: '판매가',
    dataKey: 'price',
    align: 'center',
    render: (_, { priceText, toPriceText, isPriceChange }) => (
      <>
        <Typography variant="body2">{priceText}</Typography>
        {isPriceChange && (
          <>
            ▽
            <br />
            <Typography variant="body2" {...changeTypoProps}>
              {toPriceText}
            </Typography>
          </>
        )}
      </>
    ),
  },
  {
    label: '재고',
    dataKey: 'stock',
    align: 'center',
  },
  {
    label: '수수료',
    dataKey: 'commissionRateText',
    align: 'center',
  },
];

export const SaleRequestOptionModal: React.FC<Props> = ({
  isOpen,
  isOptionLoading,
  optionLists,
  onClose: handleClose,
}) => {
  return (
    <Modal
      title="옵션정보"
      open={isOpen}
      width="90%"
      maxWidth="initial"
      maxHeight="95%"
      cancelText="닫기"
      onCancel={handleClose}
    >
      <Table
        columns={tableColumns}
        items={optionLists}
        rowKey="optionId"
        isLoading={isOptionLoading}
        pagination={false}
      />
    </Modal>
  );
};
