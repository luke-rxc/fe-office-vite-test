import React from 'react';
import { Typography } from '@material-ui/core';
import { Table } from '@components/table/Table';

export const DetailDeliveryShipPolicyTable: React.FC = () => {
  return (
    <Table
      columns={[
        {
          label: '배송유형',
          dataKey: 'description1',
          align: 'center',
        },
        {
          label: '당일발송',
          dataKey: 'description2',
          align: 'center',
          render: (_, items) => {
            const {
              description2: { title, subscription1, subscription2 },
            } = items;
            return (
              <>
                <Typography variant="body2">{title}</Typography>
                <Typography variant="body2">{subscription1}</Typography>
                <Typography variant="body2">{subscription2}</Typography>
              </>
            );
          },
        },
        {
          label: '익일발송',
          dataKey: 'description3',
          align: 'center',
        },
        {
          label: '예외발송',
          dataKey: 'description4',
          align: 'center',
        },
      ]}
      rowKey="description1"
      items={[
        {
          description1: '출고기준일',
          description2: {
            title: '당일발송 마감시간',
            subscription1: '- 이전주문 : 당일까지발송',
            subscription2: '- 이후주문 : 익일까지발송',
          },
          description3: '결제일 +1일까지',
          description4: '결제일 +N일까지',
        },
      ]}
      pagination={false}
    />
  );
};
