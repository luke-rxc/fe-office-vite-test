import { Table, TableColumnProps } from '@components/table/Table';
import { Card, Box, Button, Link } from '@material-ui/core';
import { CouponModel } from '../models';
import { useMemo } from 'react';
import { ExcelFileAccept } from '@utils/excel';
import { CouponIssueType } from '../constants';
import { UseCouponListService } from '../services';
import DownloadIcon from '@assets/icons/Download';

interface Props {
  items: UseCouponListService['couponItems'];
  pagination: UseCouponListService['pagination'];
  action: Omit<UseCouponListService['action'], 'handleClickGoCreateCoupon'>;
}

export const CouponList = ({ items, pagination, action }: Props) => {
  const columns: Array<TableColumnProps<CouponModel>> = useMemo(() => {
    const {
      handleClickToggleActiveCoupon,
      handleClickDeleteCoupon,
      handleUploadEventCouponExcelData,
      handleClickCopyCoupon,
    } = action;

    return [
      {
        label: '쿠폰번호',
        dataKey: 'id',
      },
      {
        label: '쿠폰명(서비스/관리자)',
        dataKey: 'name',
        render: (name, data) => {
          return <Link href={`/coupon/${data.id}`}>{name}</Link>;
        },
      },
      {
        label: '쿠폰타입',
        dataKey: 'useTypeText',
        align: 'center',
      },
      {
        label: '할인혜택',
        dataKey: 'salePolicy.saleInfoText',
        align: 'center',
      },
      {
        label: '다운로드기간',
        dataKey: 'downloadPolicy.downloadPolicyText',
        align: 'center',
      },
      {
        label: '사용기간',
        dataKey: 'issuePeriod.useEnabledPeriodText',
        align: 'center',
      },
      {
        label: '발급/사용내역',
        dataKey: 'issuedStat.statText',
        align: 'center',
      },
      {
        label: '사용자등록',
        dataKey: 'downloadPolicy.issueType',
        align: 'center',
        width: '120px',
        render: (_, item) => {
          if (item.downloadPolicy.issueType !== CouponIssueType.EVENT) {
            return '-';
          }
          return (
            <>
              <input
                accept={ExcelFileAccept}
                style={{ display: 'none' }}
                id={`excelUpload-${item.id}`}
                type="file"
                onChange={handleUploadEventCouponExcelData(item.id)}
              />
              <label htmlFor={`excelUpload-${item.id}`}>
                <Button color="primary" variant="contained" component="span" size="small">
                  파일업로드
                </Button>
              </label>
            </>
          );
        },
      },
      {
        label: '쿠폰상태',
        dataKey: 'activeText',
        render: (value, item) => {
          return (
            <Box display="flex" flexDirection="row" justifyContent="start" alignItems="center">
              <Button
                color={item.isActive ? 'primary' : 'inherit'}
                variant="contained"
                size="small"
                onClick={handleClickToggleActiveCoupon(item)}
              >
                {value}
              </Button>
              {!item.isActive && (
                <Button
                  color="primary"
                  variant="contained"
                  size="small"
                  onClick={handleClickCopyCoupon(item)}
                  sx={{ marginLeft: '10px' }}
                >
                  쿠폰복사
                </Button>
              )}
              {item.issuedStat.totalIssueCount === 0 && item.issuedStat.totalUseCount === 0 && (
                <Button
                  color="secondary"
                  variant="contained"
                  size="small"
                  onClick={handleClickDeleteCoupon(item)}
                  sx={{ marginLeft: '10px' }}
                >
                  삭제
                </Button>
              )}
            </Box>
          );
        },
      },
    ];
  }, [action]);

  return (
    <Card
      sx={{
        backgroundColor: 'background.paper',
        minHeight: '100%',
        p: 3,
        mt: 4,
      }}
    >
      <Box>
        <Box display="flex" justifyContent="end" sx={{ mb: 1 }}>
          <Button
            startIcon={<DownloadIcon fontSize="small" />}
            variant="contained"
            onClick={action.handleDownloadEventUserCouponTemplate}
          >
            이벤트 쿠폰 파일업로드 서식 다운로드
          </Button>
        </Box>
        <Table columns={columns} items={items} rowKey="id" pagination={pagination} />
      </Box>
    </Card>
  );
};
