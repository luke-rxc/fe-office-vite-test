import { useEffect, useState, VFC } from 'react';
import { format } from 'date-fns';
import { Box } from '@material-ui/core';
import ImageIcon from '@assets/icons/Image';
import { TableColumnProps, Table, TableProps } from '@components/table/Table';
import { getImageLink } from '@utils/link';
import { DEAL_GOODS_TYPE_LABEL, DEAL_SALE_STATUS_LABEL } from '../constants';
import { GoodsModel } from '../models';
import { formatToAmount } from '../utils';

/**
 * 상품 리스트
 */
type GoodsListProps = Omit<TableProps<GoodsModel>, 'columns'> & {
  listType?: 'SEARCH_LIST' | ''; // 상품 검색 조회 리스트 | default: 컴포넌트 전시상품 리스트
};
export const GoodsList: VFC<GoodsListProps> = ({
  items,
  listType = '',
  isLoading = false,
  pagination,
  rowKey = 'goodsId',
  ...props
}) => {
  const [column, setColumn] = useState(goodsTableColumns);
  useEffect(() => {
    let newList = [...goodsTableColumns];
    if (listType === 'SEARCH_LIST') {
      newList.splice(1, 1);
      setColumn(newList);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Table
      columns={column}
      items={items}
      rowKey="goodsId"
      isLoading={isLoading}
      pagination={pagination}
      {...props}
    ></Table>
  );
};

export const goodsTableColumns: Array<TableColumnProps<GoodsModel>> = [
  {
    label: '상품 ID',
    dataKey: 'goodsId',
    width: '5%',
    align: 'center',
  },
  {
    label: '전시순서',
    dataKey: '',
    width: '4%',
    align: 'center',
    render: (value: string, item: GoodsModel, index: number) => {
      return <>{index + 1}</>;
    },
  },
  {
    label: '상품 유형',
    dataKey: 'goodsType',
    width: '9%',
    align: 'center',
    render: (value: string, item: GoodsModel) => {
      return <>{item.goodsType && DEAL_GOODS_TYPE_LABEL[item.goodsType]}</>;
    },
  },
  {
    label: '이미지',
    dataKey: 'goodsImage',
    width: '8%',
    align: 'center',
    render: (value: string, item: GoodsModel) => {
      const imageUrl = item.goodsImage.path;
      return <ListThumbImageContainer isImage={!!imageUrl} url={imageUrl} />;
    },
  },
  {
    label: '상품명',
    dataKey: 'goodsName',
    width: '13%',
    align: 'center',
  },
  {
    label: '브랜드',
    dataKey: 'brandName',
    width: '8%',
    align: 'center',
  },
  {
    label: '입점사',
    dataKey: 'providerName',
    width: '8%',
    align: 'center',
  },
  {
    label: '정상가',
    dataKey: 'consumerPrice',
    width: '7%',
    align: 'center',
    render: (value: string, item: GoodsModel) => {
      return <>{formatToAmount(item.consumerPrice)}</>;
    },
  },
  {
    label: '판매가',
    dataKey: 'price',
    width: '7%',
    align: 'center',
    render: (value: string, item: GoodsModel) => {
      return <>{formatToAmount(item.price)}</>;
    },
  },
  {
    label: '상품전시시작일',
    dataKey: 'displayStartDate',
    width: '7%',
    align: 'center',
    render: (value: string, item: GoodsModel) => {
      return <>{item.displayStartDate && format(item.displayStartDate, 'yyyy/MM/dd HH:mm:ss')}</>;
    },
  },
  {
    label: '상품판매시작일',
    dataKey: 'salesStartDate',
    width: '7%',
    align: 'center',
    render: (value: string, item: GoodsModel) => {
      return <>{item.salesStartDate && format(item.salesStartDate, 'yyyy/MM/dd HH:mm:ss')}</>;
    },
  },
  {
    label: '상품판매종료일',
    dataKey: 'salesEndDate',
    width: '7%',
    align: 'center',
    render: (value: string, item: GoodsModel) => {
      return <>{item.salesEndDate && format(item.salesEndDate, 'yyyy/MM/dd HH:mm:ss')}</>;
    },
  },
  {
    label: '상품상태',
    dataKey: 'salesStatus',
    width: '10%',
    align: 'center',
    render: (value: string, item: GoodsModel) => {
      return (
        <>
          {/* {item.salesStatus === SALES_STATUS.NORMAL ? '판매중' : item.salesStatus === SALES_STATUS.RUNOUT ? '품절' : ''} */}
          {item.salesStatus && DEAL_SALE_STATUS_LABEL[item.salesStatus]}
        </>
      );
    },
  },
];

/**
 * 테이블 리스트 내 섬네일 이미지
 * @param param0
 * @returns
 */
const ListThumbImageContainer = ({ isImage, url }: { isImage?: boolean; url?: string }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        width: 80,
        height: 80,
        border: '1px solid #eee',
        '& > img': {
          width: '100%',
          height: 'auto',
        },
      }}
    >
      {isImage ? <img alt="live 대표이미지" src={getImageLink(url, 192)} /> : <ImageIcon fontSize="small" />}
    </Box>
  );
};
