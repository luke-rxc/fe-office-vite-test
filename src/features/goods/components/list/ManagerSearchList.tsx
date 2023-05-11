import { Link as RouterLink } from 'react-router-dom';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { Box, Button, Card, CardHeader, Divider, Typography, Grid } from '@material-ui/core';
import Scrollbar from '@components/Scrollbar';
import { Table, PaginationProps, TableColumnProps, TableProps } from '@components/table/Table';
import PlusIcon from '@assets/icons/Plus';
import DownloadIcon from '@assets/icons/Download';
import DuplicateIcon from '@assets/icons/Duplicate';
import XIcon from '@assets/icons/X';
import SimCardDownload from '@assets/icons/SimCardDownload';
import ImageIcon from '@assets/icons/Image';
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
  onAllListExport: () => void;
  onBulkModalOpen: () => void;
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
    label: '입점사',
    dataKey: 'providerName',
    align: 'center',
  },
  {
    label: '브랜드',
    dataKey: 'brandName',
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
    label: '키워드',
    dataKey: 'keyword',
    align: 'center',
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
    width: '100px',
  },
];

export const ManagerSearchList: React.FC<Props> = ({
  lists,
  pagination,
  rowSelection,
  onDeleteTableList: handleDeleteTableList,
  onDuplicateTableList: handleDuplicateTableList,
  onAllListExport: handleAllListExport,
  onBulkModalOpen: handleBulkModalOpen,
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
            <>
              <Box sx={{ ml: 1 }}>
                <Button
                  startIcon={<DuplicateIcon fontSize="small" />}
                  size="medium"
                  variant="contained"
                  onClick={handleDuplicateTableList}
                >
                  복제
                </Button>
              </Box>
              <Box sx={{ ml: 1 }}>
                <Button
                  startIcon={<XIcon fontSize="small" />}
                  size="medium"
                  variant="contained"
                  onClick={handleDeleteTableList}
                >
                  삭제
                </Button>
              </Box>
            </>
          )}
        </Grid>

        {/* 우측 유틸 메뉴 */}
        {!!lists.length && (
          <Grid item md={6} xs={12} display="flex" justifyContent="flex-end">
            <Button
              color="secondary"
              startIcon={<SimCardDownload fontSize="small" />}
              variant="outlined"
              sx={{ m: 1 }}
              onClick={handleBulkModalOpen}
            >
              일괄수정 서식
            </Button>
            {/* <Menu
              id="basic-menu"
              open={isBulkMenuOpen}
              onClose={handleBulkModalClose}
              anchorEl={bulkButtonEl}
              MenuListProps={{
                'aria-labelledby': 'basic-button',
              }}
            >
              <label htmlFor="baseInfoExcelUpload">
                <MenuItem onClick={handleBaseInfoBulkExcelDownload}>기본정보</MenuItem>
              </label>
              <MenuItem onClick={handleOptInfoBulkExcelDownload}>옵션정보</MenuItem>
            </Menu> */}
            <Button
              color="primary"
              startIcon={<DownloadIcon fontSize="small" />}
              sx={{ m: 1 }}
              variant="text"
              onClick={handleAllListExport}
            >
              Export
            </Button>
          </Grid>
        )}
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
