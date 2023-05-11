import { TableColumnProps } from '@components/table/Table';
import { Box, Button } from '@material-ui/core';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { useState } from 'react';
import { AuctionGoodsContents, StatusCircleStyled } from '.';
import { AuctionStatus } from '../constants';
import { ShowtimeManageItemAuctionGoodsModel, toShowtimeManageItemAuctionGoodsModelList } from '../models';
import { toCamelCase } from '../utils';
import { showtimeItemAuctionGoodsSchemaMock } from '../__mocks__/showtimeItemAuctionGoodsSchemaMock';
import { ShowtimeManageAuctionList } from './ShowtimeManageAuctionList';

export default {
  title: 'Features/Showtime/ShowtimeManageAuctionList',
  component: ShowtimeManageAuctionList,
} as ComponentMeta<typeof ShowtimeManageAuctionList>;

const Template: ComponentStory<typeof ShowtimeManageAuctionList> = (args) => {
  const [selectedIds, setSelectedIds] = useState<Array<number>>([]);
  const items = toShowtimeManageItemAuctionGoodsModelList(showtimeItemAuctionGoodsSchemaMock);

  const onUpdateSelectedIds = (items: Array<number>) => {
    setSelectedIds(items.map((item) => item));
  };

  const columns: Array<TableColumnProps<ShowtimeManageItemAuctionGoodsModel>> = [
    {
      label: '경매상품',
      dataKey: 'id',
      align: 'center',
      width: '100px',
    },
    {
      label: '상품정보',
      dataKey: 'name',
      render: (value, item) => {
        return <AuctionGoodsContents item={item} />;
      },
    },
    {
      label: '경매상태',
      dataKey: 'statusText',
      align: 'center',
      width: '90px',
      render: (value, item) => {
        return (
          <>
            <StatusCircleStyled className={toCamelCase(item.status)} />
            <Box>{value}</Box>
          </>
        );
      },
    },
    {
      label: '추가작업',
      dataKey: 'actions',
      align: 'center',
      width: '140px',
      render: (value, item, index) => {
        if (item.status === AuctionStatus.SUCCESSFUL_BID) {
          return (
            <Button variant="contained" size="small" sx={{ width: '100%' }}>
              낙찰정보
            </Button>
          );
        }

        return (
          <>
            <Button variant="contained" size="small" sx={{ width: '100%' }}>
              상품 정보 수정
            </Button>
            <Button variant="contained" size="small" sx={{ width: '100%', mt: '10px' }}>
              상품 상세 보기
            </Button>
          </>
        );
      },
    },
  ];

  return (
    <>
      <ShowtimeManageAuctionList
        {...args}
        columns={columns}
        items={items}
        selectedIds={selectedIds}
        onUpdateSelectedIds={onUpdateSelectedIds}
      />
    </>
  );
};

export const Default = Template.bind({});
Default.args = {};
