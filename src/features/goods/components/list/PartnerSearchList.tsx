import { Link as RouterLink } from 'react-router-dom';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { Box, Button, Card, CardHeader, Divider, Typography, Grid, TextField } from '@material-ui/core';
import Scrollbar from '@components/Scrollbar';
import { Table, PaginationProps, TableColumnProps, TableProps } from '@components/table/Table';
import PlusIcon from '@assets/icons/Plus';
import XIcon from '@assets/icons/X';
import ImageIcon from '@assets/icons/Image';
import ShoppingBagIcon from '@assets/icons/ShoppingBag';
import DownloadIcon from '@assets/icons/Download';
import DuplicateIcon from '@assets/icons/Duplicate';
import { getImageLink } from '@utils/link';
import { ListModel } from '../../models';
import { GoodsLink } from '../../constants';

const useStyles = makeStyles({
  imageContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    backgroundColor: 'background.default',
    width: 100,
    height: 100,
    margin: '0 auto',
    border: '1px solid #eee',
    '& > img': {
      width: '100%',
      height: 'auto',
    },
  },
});

interface Props {
  lists: ListModel[];
  pagination: PaginationProps;
  rowSelection?: TableProps<unknown>['rowSelection'];
  onDeleteTableList: () => void;
  onDuplicateTableList: () => void;
  onSaleRequest: () => void;
  onAllListExport: () => void;
}

const tableColumns: Array<TableColumnProps<any>> = [
  {
    label: '상품 ID',
    dataKey: 'goodsId',
    align: 'center',
  },
  {
    label: '썸네일이미지',
    dataKey: 'imageUrl',
    align: 'center',
    render: (imageUrl) => <ImageContainer url={imageUrl} />,
  },
  {
    label: '상품 유형',
    dataKey: 'type',
    align: 'center',
  },
  {
    label: '상품명',
    dataKey: 'goodsName',
    align: 'center',
    render: (value, items) => {
      const { goodsId } = items;
      // src/features/goods/hooks/useLink.ts 의 Location 내 state props 정의된 부분 참고
      return (
        <RouterLink to={`${GoodsLink.Base}/${goodsId}`} state={{ listPageQuery: window.location.search }}>
          {value}
        </RouterLink>
      );
    },
  },
  {
    label: '정상가/판매가',
    dataKey: 'goodsPrice',
    align: 'center',
    width: '150px',
    render: (_, { consumerPriceText, priceText }) => {
      return (
        <>
          <Typography variant="body2">{consumerPriceText}</Typography>
          <Typography variant="body2">{priceText}</Typography>
        </>
      );
    },
  },
  {
    label: '시작일/종료일',
    dataKey: 'saleDate',
    align: 'center',
    width: '200px',
    render: (_, { salesStartDate, salesEndDate }) => {
      return (
        <>
          <Typography variant="body2">{salesStartDate}</Typography>
          <Typography variant="body2">{salesEndDate}</Typography>
        </>
      );
    },
  },
  {
    label: '판매상태',
    dataKey: 'status',
    align: 'center',
  },
  {
    label: '승인상태',
    dataKey: 'requestStatus',
    align: 'center',
  },
  {
    label: '사유',
    dataKey: 'requestMemo',
    align: 'center',
    width: '250px',
    render: (value) => {
      return value ? (
        <TextField
          value={value}
          maxRows={10}
          fullWidth
          multiline
          inputProps={{ readOnly: true, style: { fontSize: '14px' } }}
          size="small"
        />
      ) : (
        <span>-</span>
      );
    },
  },
];

export const PartnerSearchList: React.FC<Props> = ({
  lists,
  pagination,
  rowSelection,
  onDeleteTableList: handleDeleteTableList,
  onDuplicateTableList: handleDuplicateTableList,
  onSaleRequest: handleSaleRequest,
  onAllListExport: handleAllListExport,
}) => {
  const theme = useTheme();

  return (
    <Card>
      {/* header */}
      <CardHeader
        action={
          <Typography color="textPrimary" variant="subtitle2" sx={{ mt: 1, mr: 1 }}>
            총 <span style={{ color: theme.palette.error.main }}>{pagination?.total}</span>개의 검색 결과가 있습니다
          </Typography>
        }
        title="Latest Orders"
      />
      {/* // header */}
      <Divider />
      {/* menu */}
      <Grid container justifyContent="space-between" alignItems="center" sx={{ mt: 2, p: 2 }}>
        <Grid item md={6} xs={12} display="flex">
          <Button
            startIcon={<PlusIcon fontSize="small" />}
            size="medium"
            variant="contained"
            component={RouterLink}
            to={GoodsLink.New}
          >
            상품 등록
          </Button>
          {!!lists.length && (
            <Button
              startIcon={<DuplicateIcon fontSize="small" />}
              size="medium"
              variant="contained"
              onClick={handleDuplicateTableList}
              sx={{ ml: 1 }}
            >
              복제
            </Button>
          )}
        </Grid>
        <Grid item md={6} xs={12} display="flex" justifyContent="flex-end">
          {!!lists.length && (
            <>
              <Box>
                <Button
                  startIcon={<XIcon fontSize="small" />}
                  size="medium"
                  variant="contained"
                  onClick={handleDeleteTableList}
                >
                  삭제
                </Button>
                <Button
                  color="secondary"
                  startIcon={<ShoppingBagIcon fontSize="small" />}
                  size="medium"
                  variant="contained"
                  onClick={handleSaleRequest}
                  sx={{ mx: 1 }}
                >
                  승인요청
                </Button>
                <Button
                  color="primary"
                  startIcon={<DownloadIcon fontSize="small" />}
                  sx={{ m: 1 }}
                  variant="text"
                  onClick={handleAllListExport}
                >
                  Export
                </Button>
              </Box>
            </>
          )}
        </Grid>
      </Grid>

      {/* // menu */}

      {/* table */}
      <Scrollbar>
        <Box sx={{ minWidth: 1200 }}>
          <Table
            columns={tableColumns}
            items={lists.map((list) => list)}
            pagination={pagination}
            rowKey="goodsId"
            rowSelection={rowSelection}
          />
        </Box>
      </Scrollbar>
      {/* // table */}
    </Card>
  );
};

const ImageContainer = ({ url }: { url?: string }) => {
  const classes = useStyles();
  const isImage = !!url;
  return (
    <Box className={classes.imageContainer}>
      {isImage ? <img alt="Goods" src={getImageLink(url, 192)} /> : <ImageIcon fontSize="small" />}
    </Box>
  );
};
