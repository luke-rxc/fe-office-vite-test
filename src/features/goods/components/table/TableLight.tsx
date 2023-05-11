import React, { useState, ReactNode, useEffect, useRef } from 'react';
import get from 'lodash/get';
import {
  Box,
  Table as TableMaterial,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  makeStyles,
  TableSortLabel,
  Paper,
  TableContainer,
} from '@material-ui/core';
import AutorenewIcon from '@material-ui/icons/Autorenew';
import styled from '@emotion/styled';
import Archive from '@assets/icons/Archive';
import SortDefault from '@assets/icons/SortDefault';
import SortActive from '@assets/icons/SortActive';
import { SortOrderType } from '@constants/table';
import { TableIndicator } from './TableIndicator';
import { TableRowItem } from './TableRowItem';

/**
 * Table Column interface
 */
type TableListRenderType<T> = (value: string, item: T, index: number) => ReactNode;
export interface TableColumnProps<T> {
  align?: 'left' | 'center' | 'right';
  label: ReactNode | ((dataKey: string) => ReactNode);
  dataKey: string;
  width?: string | number;
  useSort?: boolean;
  hide?: boolean;
  /** TD 렌더링 정상 Node */
  render?: TableListRenderType<T>;
  /** TD 렌더링 간소화 Node */
  renderPreview?: TableListRenderType<T>;
  /** TD 렌더링 시 preview 모드일때 강제로 render prop 내의 Node를 바라보게 함 */
  forceRender?: boolean;
}

/**
 * RowSelection interface
 */
export interface RowSelectionProps<T> {
  rowSelectionColumnIndex?: number;
  disabledRowItemIndexes: Array<number>;
  enableSelectByRowClick?: boolean;
  onChange: (selectedIndex: Array<number>) => void;
  getCheckboxProps?: (rowItem: T) => Object;
}

/**
 * Sort interface
 */
export interface SortProps {
  orderType: SortOrderType | undefined;
  orderKey: string;
  handleSort?: (orderKey: string, orderType: SortOrderType) => void;
}

/**
 * Indicator interface
 */
export interface IndicatorProps {
  hasMore: boolean;
  onLoadMore: () => void;
}

/**
 * List Delete interface
 */
export interface DeleteProps {
  /** 삭제가 가능한지 여부 */
  deletable: boolean;
  /** 삭제시 Callback */
  onDelete: (index: number) => void;
}

/**
 * Table interface
 */
export interface TableProps<T> {
  columns: Array<TableColumnProps<T>>;
  rowSelection: RowSelectionProps<T>;
  items: Array<T>;
  rowKey: string;
  sort?: SortProps;
  /** 마우스 오버시 스타일 처리 여부 */
  hover?: boolean;
  /** loading 여부 */
  isLoading?: boolean;
  /** 전체 선택/선택해제 숨김처리시 대신 표기할 label */
  allSelectionLabel?: string;
  /** sticky header 사용여부 */
  stickyHeader?: boolean;
  /** table height 설정 */
  minHeight?: string | number;
  maxHeight?: string | number;
  /** Indicator Option (리스트 순차 로드, infinite scroll) */
  indicatorOptions: IndicatorProps;
  /** Delete Option (리스트 삭제) */
  deleteOptions: DeleteProps;
  /** 에러 표시 */
  rowErrors: number[];
}

const useStyles = makeStyles((theme) => ({
  tableHeaderCell: {
    boxSizing: 'border-box',
    backgroundColor: theme.palette.mode === 'light' ? '#dcdcdc' : '#000000',
  },
  tableDisabled: {
    backgroundColor: theme.palette.mode === 'light' ? '#dcdcdc' : '#000000',
    opacity: 0.5,
  },
  tableErrored: {
    backgroundColor: '#f35958',
    opacity: 0.5,
  },
  checkboxDisabled: {
    cursor: 'default',
    '&:hover': {
      backgroundColor: 'transparent',
    },
  },
}));

/**
 * Table 컴포넌트
 */
export const TableLight = <T extends Object>(props: TableProps<T>) => {
  const classes = useStyles();
  const {
    columns,
    items,
    rowKey,
    rowSelection,
    sort,
    hover = false,
    isLoading = false,
    allSelectionLabel = null,
    stickyHeader,
    minHeight = '400px',
    maxHeight,
    indicatorOptions,
    deleteOptions,
    rowErrors,
  } = props;

  /** 리스트 제어불가 Index Array */
  const { disabledRowItemIndexes, enableSelectByRowClick = false, onChange: handleChangeRowSelect } = rowSelection;

  /** 리스트 삭제 */
  const { deletable = false, onDelete: handleDelete } = deleteOptions;

  /**
   * Checkbox를 통한 리스트 선택시의, 선택된 리스트의 Index Array 관리
   * @issue 상태 관리는 성능 이슈가 있어 Reference로 관리
   */
  const selectedIndexesRef = useRef<number[]>([]);

  /** 활성화된 리스트 Index */
  const [activeItemIndex, setActiveItemIndex] = useState<number | null>(null);

  const getCheckboxProps = (item: T) => {
    return rowSelection?.getCheckboxProps ? rowSelection.getCheckboxProps(item) : {};
  };

  /** item 개별 선택 */
  const handleSelectOneItem = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent> | React.ChangeEvent<HTMLInputElement>,
    itemIndex: number,
  ): void => {
    const rowIndexes = !selectedIndexesRef.current.includes(itemIndex)
      ? [...selectedIndexesRef.current, itemIndex]
      : selectedIndexesRef.current.filter((id) => id !== itemIndex);

    selectedIndexesRef.current = rowIndexes;
    handleChangeRowSelect(selectedIndexesRef.current);
  };

  const handleRowClick = (itemIndex: number | null) => {
    setActiveItemIndex(itemIndex);
  };

  const createSortHandler = (property: string) => (event: React.MouseEvent<unknown>) => {
    sort && sort.handleSort(property, sort.orderType === SortOrderType.DESC ? SortOrderType.ASC : SortOrderType.DESC);
  };

  useEffect(() => {
    selectedIndexesRef.current = [];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(disabledRowItemIndexes)]);

  return (
    <Box>
      <TableContainer component={Paper} {...(maxHeight && { sx: { maxHeight } })}>
        <TableMaterial stickyHeader={stickyHeader}>
          <TableHead>
            <TableRow>
              {rowSelection && !rowSelection.rowSelectionColumnIndex && (
                <TableCell align="center" padding="checkbox" className={classes.tableHeaderCell}>
                  {allSelectionLabel}
                </TableCell>
              )}
              {columns.map(({ align, dataKey, label, width, useSort = false, hide = false }, columnIndex) => {
                const enabledSort = !!sort && !!useSort;
                const isActive = enabledSort && sort.orderKey === dataKey;
                const iconComponent = enabledSort
                  ? sort.orderKey !== dataKey || !sort.orderType
                    ? SortDefault
                    : SortActive
                  : undefined;

                if (hide) {
                  return null;
                }

                return (
                  <React.Fragment key={dataKey}>
                    <TableCell
                      align="center"
                      width={width ?? 'auto'}
                      className={classes.tableHeaderCell}
                      sortDirection={enabledSort ? (isActive ? sort.orderType : false) : false}
                    >
                      {enabledSort ? (
                        <TableSortLabel
                          active={isActive}
                          direction={isActive ? sort.orderType : 'desc'}
                          onClick={createSortHandler(dataKey)}
                          IconComponent={iconComponent}
                          hideSortIcon={true}
                        >
                          {typeof label === 'function' ? label(dataKey) : label}
                          {(!isActive || !sort.orderType) && <StyledSortDefault />}
                        </TableSortLabel>
                      ) : typeof label === 'function' ? (
                        label(dataKey)
                      ) : (
                        label
                      )}
                    </TableCell>
                  </React.Fragment>
                );
              })}
              {deletable && (
                <TableCell align="center" width="auto" className={classes.tableHeaderCell}>
                  삭제
                </TableCell>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={columns.length + 1} sx={{ height: minHeight }}>
                  <InfoArea>
                    <AutorenewIcon fontSize="large" sx={{ mr: 2 }} />
                    데이터를 불러오는 중입니다.
                  </InfoArea>
                </TableCell>
              </TableRow>
            ) : (
              <>
                {items.map((item, index) => {
                  // console.log('item', item);
                  const uniqueValue = get(item, rowKey);
                  const disabled = disabledRowItemIndexes.includes(index);
                  const editable = activeItemIndex === index;
                  const isDelete = get(item, 'isDelete');
                  const isError = rowErrors.includes(index);
                  return (
                    <TableRowItem
                      {...props}
                      classes={classes}
                      itemIndex={index}
                      item={item}
                      key={uniqueValue}
                      enableSelectByRowClick={enableSelectByRowClick}
                      handleGetCheckboxProps={getCheckboxProps}
                      handleSelectOneItem={handleSelectOneItem}
                      hover={hover}
                      rowSelection={rowSelection}
                      handleRowClick={handleRowClick}
                      editable={editable}
                      deleteOptions={{
                        isDelete: deletable ? isDelete : false,
                        deletable,
                        onDelete: handleDelete,
                      }}
                      disabled={disabled}
                      errored={isError}
                    />
                  );
                })}

                {items.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={columns.length + 1} sx={{ height: minHeight }}>
                      <InfoArea>
                        <Archive fontSize="large" sx={{ mr: 2 }} />
                        데이터가 없습니다.
                      </InfoArea>
                    </TableCell>
                  </TableRow>
                )}
              </>
            )}
            <TableIndicator {...indicatorOptions} />
          </TableBody>
        </TableMaterial>
      </TableContainer>
    </Box>
  );
};

const StyledSortDefault = styled(SortDefault)`
  width: 18px !important;
  margin-left: 5px;
`;

const InfoArea = styled(Box)`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;
