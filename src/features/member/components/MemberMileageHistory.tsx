import { Table, TableColumnProps, PaginationProps } from '@components/table/Table';
import styled from '@emotion/styled';
import { Button, Card, CardContent, CardHeader, Typography } from '@material-ui/core';
import { MemberMileageModel } from '../models';

interface MemberMileageHistoryProps {
  items: MemberMileageModel[];
  usablePoint: string;
  pagination?: PaginationProps;
  onOpenDialog: () => void;
}

export const MemberMileageHistory = ({
  items,
  usablePoint,
  pagination,
  onOpenDialog: handleDialog,
}: MemberMileageHistoryProps) => {
  const columns: Array<TableColumnProps<MemberMileageModel>> = [
    {
      label: '적립일',
      dataKey: 'createdDateText',
      align: 'center',
      rowSpan: (item) => item.mileageGroupRowSpan,
    },
    {
      label: '적립사유',
      dataKey: 'memo',
      align: 'center',
      rowSpan: (item) => item.mileageGroupRowSpan,
    },
    { label: '상태', dataKey: 'statusText', align: 'center', rowSpan: (item) => item.mileageGroupRowSpan },
    { label: '적립금', dataKey: 'totalAmountText', align: 'center', rowSpan: (item) => item.mileageGroupRowSpan },
    { label: '적립금 상세', dataKey: 'amountText', align: 'center' },
    { label: '소멸기한', dataKey: 'expireDateText', align: 'center' },
    { label: '관리자 메모', dataKey: 'adminMemo', align: 'center', rowSpan: (item) => item.mileageGroupRowSpan },
  ];

  return (
    <Card
      variant="outlined"
      sx={{
        backgroundColor: 'background.paper',
        minHeight: '100%',
        p: 3,
      }}
    >
      <CardHeader
        title={
          <>
            적립금:{' '}
            <TypographyStyled color="primary" variant="h6">
              {usablePoint}
            </TypographyStyled>
          </>
        }
        action={
          <Button type="button" variant="outlined" onClick={handleDialog}>
            적립금 수동 처리
          </Button>
        }
      />
      <CardContent>
        <Table columns={columns} items={items} rowKey="rowId" pagination={pagination} minHeight="20px" />
      </CardContent>
    </Card>
  );
};

const TypographyStyled = styled(Typography)`
  display: inline-flex;
`;
