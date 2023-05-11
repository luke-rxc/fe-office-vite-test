// import styled from '@emotion/styled';
import { styled } from '@material-ui/styles';
import isEmpty from 'lodash/isEmpty';
import { Box, paperClasses, tableHeadClasses, tableBodyClasses, tableCellClasses } from '@material-ui/core';
import { Table as OriginTable, TableProps as OriginTableProps } from '@components/table/Table';

export type TableProps<T extends object> = OriginTableProps<T> & Pick<TableBoxProps, 'emptyHeight' | 'maxHeight'>;

/**
 * 스타일링된 Table 컴포넌트
 */
export const Table = <T extends object>({ items, emptyHeight, maxHeight, ...props }: TableProps<T>) => {
  const isClickableRow = !!props?.rowSelection?.enableSelectByRowClick && !isEmpty(items);

  return (
    <TableBox empty={isEmpty(items)} maxHeight={maxHeight} emptyHeight={emptyHeight} isClickableRow={isClickableRow}>
      <OriginTable items={items} {...props} />
    </TableBox>
  );
};

interface TableBoxProps {
  empty?: boolean;
  maxHeight?: string;
  emptyHeight?: string;
  isClickableRow?: boolean;
  className?: string;
  children: React.ReactNode;
}

const TableBox = styled(({ empty, children, isClickableRow, className }: TableBoxProps) => {
  return (
    <Box
      className={`${className} ${empty ? 'is-empty' : ''} ${isClickableRow ? 'is-clickable' : ''} `}
      children={children}
    />
  );
})(({ emptyHeight, maxHeight }) => ({
  // 팝업에서 테이블 양쪽이 1px씩 짤리는 현상으로 인해 padding 추가
  '&': {
    paddingLeft: '1px',
    paddingRight: '1px',
  },
  // 단어 단위로 텍스트 줄바꿈 처리
  [`& .${tableCellClasses.root}`]: {
    wordBreak: 'keep-all',
    wordWrap: 'break-word',
  },
  // 테이블 데이터가 없을때 테이블 높이 지정
  [`&.is-empty .${tableCellClasses.body}`]: {
    ...(emptyHeight ? { height: `${emptyHeight} !important` } : {}),
  },
  // row 클릭가능시 마우스 포인터 변경
  [`&.is-clickable .${tableBodyClasses.root} .${tableCellClasses.body}`]: {
    // cursor: 'pointer',
  },
  // 테이블 헤더 고정형(스크롤테이블)
  [`& .${paperClasses.root}`]: {
    ...(maxHeight ? { maxHeight, overflow: 'auto' } : {}),
  },
  [`& .${tableHeadClasses.root}`]: {
    ...(maxHeight ? { position: 'sticky', top: 0, left: 0, zIndex: 2 } : {}),
  },
}));
