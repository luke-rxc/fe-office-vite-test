import { Table, TableColumnProps } from '@components/table/Table';
import styled from '@emotion/styled';
import { Card, CardContent, CardHeader, Divider } from '@material-ui/core';
import { ShowtimeManageItemAuctionGoodsModel } from '../models';

interface Props {
  columns: Array<TableColumnProps<ShowtimeManageItemAuctionGoodsModel>>;
  items: Array<ShowtimeManageItemAuctionGoodsModel>;
  isLoading: boolean;
  selectedIds: Array<number>;
  onUpdateSelectedIds: (items: Array<number>) => void;
}

export const ShowtimeManageAuctionList = ({ columns, items, isLoading, selectedIds, onUpdateSelectedIds }: Props) => {
  const onChange = (selectedRowKeys, selectedItems, selectedIndex, itemId) => {
    const updateItems = selectedIds.includes(itemId) ? [] : [itemId];
    onUpdateSelectedIds(updateItems);
  };

  return (
    <Card>
      <CardHeaderStyled title="경매 상품 선택" />
      <Divider />
      <CardContent>
        <Table<ShowtimeManageItemAuctionGoodsModel>
          columns={columns}
          items={items}
          rowKey="id"
          pagination={false}
          isLoading={isLoading}
          hideAllSelect
          rowSelection={{ selectedRowKeys: selectedIds, onChange, enableSelectByRowClick: true }}
        />
      </CardContent>
    </Card>
  );
};

const CardHeaderStyled = styled(CardHeader)`
  .MuiCardHeader-title {
    font-size: 1rem;
  }
`;
