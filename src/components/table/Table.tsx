import {
  Box,
  Table as TableMaterial,
  TableHead,
  TableRow,
  TableCell,
  Checkbox,
  TableBody,
  makeStyles,
  TableSortLabel,
  Paper,
  TableContainer,
} from '@material-ui/core';
import React, { useState, ChangeEvent, ReactNode, useEffect } from 'react';
import styled from '@emotion/styled';
import { DEFAULT_PAGE_LIMIT, DEFAULT_PAGE_NUMBER, TablePagination } from './TablePagination';
import Archive from '@assets/icons/Archive';
import AutorenewIcon from '@material-ui/icons/Autorenew';
import SortDefault from '@assets/icons/SortDefault';
import SortActive from '@assets/icons/SortActive';
import { SortOrderType } from '@constants/table';
import { get } from 'lodash';

/**
 * Table Column interface
 */
export interface TableColumnProps<T> {
  align?: 'left' | 'center' | 'right';
  label: ReactNode | ((dataKey: string) => ReactNode);
  dataKey: string;
  width?: string | number;
  useSort?: boolean;
  hide?: boolean;
  colSpan?: (item: T, rowIndex?: number) => number | undefined;
  rowSpan?: (item: T, rowIndex?: number) => number | undefined;
  render?: (value: string, item: T, index: number) => ReactNode;
}

/**
 * Pagination interface
 */
export interface PaginationProps {
  page: number;
  total: number;
  limit: number;
  /**
   * 기본 pagination 처리여부
   */
  isDefault?: boolean;
  onChange?: (page: number, limit: number) => void;
  showFirstButton?: boolean;
  showLastButton?: boolean;
}

/**
 * RowSelection interface
 */
export interface RowSelectionProps<T> {
  rowSelectionColumnIndex?: number;
  selectedRowKeys: Array<string | number>;
  enableSelectByRowClick?: boolean;
  onChange: (
    selectedRowKeys: Array<string | number>,
    selectedItems: Array<T>,
    selectedIndex: Array<number>,
    selectId?: string,
  ) => void;
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
 * Table interface
 */
export interface TableProps<T> {
  columns: Array<TableColumnProps<T>>;
  rowSelection?: RowSelectionProps<T>;
  items: Array<T>;
  pagination?: PaginationProps | false;
  rowKey: string;
  sort?: SortProps;
  // 마우스 오버시 스타일 처리 여부
  hover?: boolean;
  // 페이지당 row 갯수 옵션
  rowsPerPageOptions?: Array<number>;
  // loading 여부
  isLoading?: boolean;
  //전체 선택/선택해제 숨김여부
  hideAllSelect?: boolean;
  // 전체 선택/선택해제 숨김처리시 대신 표기할 label
  allSelectionLabel?: string;
  // sticky header 사용여부
  stickyHeader?: boolean;
  minHeight?: string | number;
  maxHeight?: string | number;
}

const useStyles = makeStyles((theme) => ({
  tableHeaderCell: {
    boxSizing: 'border-box',
    backgroundColor: theme.palette.mode === 'light' ? '#dcdcdc' : '#000000',
  },
}));

/**
 * Table 컴포넌트
 */
export const Table = <T extends Object>({
  columns,
  items,
  rowKey,
  rowSelection,
  pagination = {
    page: DEFAULT_PAGE_NUMBER,
    total: items.length,
    limit: DEFAULT_PAGE_LIMIT,
    isDefault: true,
    showFirstButton: false,
    showLastButton: false,
  },
  sort,
  hover = true,
  rowsPerPageOptions,
  isLoading = false,
  hideAllSelect = false,
  allSelectionLabel = null,
  stickyHeader,
  minHeight = '400px',
  maxHeight,
}: TableProps<T>) => {
  const classes = useStyles();

  const {
    selectedRowKeys,
    enableSelectByRowClick,
    onChange: handleChangeRowSelect,
  } = !!rowSelection
    ? rowSelection
    : {
        selectedRowKeys: [],
        enableSelectByRowClick: false,
        onChange: undefined,
      };

  const { page: currentPage, limit: currentLimit } = pagination || {
    page: DEFAULT_PAGE_NUMBER,
    limit: DEFAULT_PAGE_LIMIT,
  };

  const [page, setPage] = useState<number>(currentPage);
  const [limit, setLimit] = useState<number>(currentLimit);

  useEffect(() => {
    setPage(currentPage);
    setLimit(currentLimit);
  }, [currentPage, currentLimit]);

  const applyPagination = (items: T[], page: number, limit: number): T[] =>
    items.slice((page - 1) * limit, (page - 1) * limit + limit);

  const getCheckboxProps = (item: T) => {
    return rowSelection?.getCheckboxProps ? rowSelection.getCheckboxProps(item) : {};
  };

  const getFilteredItems = (items: Array<T>) => {
    if (items === undefined) {
      return [];
    }

    return items.filter((item) => {
      const props = getCheckboxProps(item);
      return (props['disabled'] ?? false) !== true;
    });
  };

  const paginatedItems = pagination && pagination.isDefault ? applyPagination(items, page, limit) : items;

  const selectedAllProducts =
    selectedRowKeys.length > 0 && selectedRowKeys.length === getFilteredItems(paginatedItems).length;
  const selectedSomeProducts =
    selectedRowKeys.length > 0 && selectedRowKeys.length < getFilteredItems(paginatedItems).length;

  /**
   * 전체 선택
   */
  const handleSelectAllItems = (event: ChangeEvent<HTMLInputElement>): void => {
    const isChecked = event.target.checked;

    if (isChecked) {
      const filteredPaginatedItems = paginatedItems.filter((item) => {
        const props = getCheckboxProps(item);
        return (props['disabled'] ?? false) !== true;
      });

      handleChangeRowSelect(
        filteredPaginatedItems.map((item) => get(item, rowKey)),
        filteredPaginatedItems,
        filteredPaginatedItems.map((_, index) => index),
      );
    } else {
      handleChangeRowSelect([], [], []);
    }
  };

  /**
   * item 개별 선택
   */
  const handleSelectOneItem = (
    event: ChangeEvent<HTMLInputElement | HTMLTableElement> | React.MouseEvent<HTMLTableRowElement, MouseEvent>,
    itemId: string,
  ): void => {
    const rowKeys = !selectedRowKeys.includes(itemId)
      ? [...selectedRowKeys, itemId]
      : selectedRowKeys.filter((id) => id !== itemId);
    const { selectedItems, selectedIndexes } = paginatedItems.reduce(
      (target, item, index) => {
        if (rowKeys.includes(get(item, rowKey))) {
          target.selectedItems.push(item);
          target.selectedIndexes.push(index);
        }

        return target;
      },
      { selectedItems: [], selectedIndexes: [] },
    );

    handleChangeRowSelect(rowKeys, selectedItems, selectedIndexes, itemId);
  };

  /**
   * page 변경
   */
  const handleChangePage = (newPage: number, isDispatch: boolean = true): void => {
    setPage(newPage);
    isDispatch && pagination && !pagination.isDefault && pagination.onChange(newPage, limit);
  };

  /**
   * row limit 변경
   */
  const handleChangeLimit = (limit: number): void => {
    setPage(1);
    setLimit(limit);
    pagination && !pagination.isDefault && pagination.onChange(1, limit);
  };

  const createSortHandler = (property: string) => (event: React.MouseEvent<unknown>) => {
    sort && sort.handleSort(property, sort.orderType === SortOrderType.DESC ? SortOrderType.ASC : SortOrderType.DESC);
  };

  return (
    <Box>
      <TableContainer component={Paper} {...(maxHeight && { sx: { maxHeight } })}>
        <TableMaterial stickyHeader={stickyHeader}>
          <TableHead>
            <TableRow>
              {rowSelection && !rowSelection.rowSelectionColumnIndex && (
                <TableCell align="center" padding="checkbox" className={classes.tableHeaderCell}>
                  {!hideAllSelect ? (
                    <Checkbox
                      checked={selectedAllProducts}
                      color="primary"
                      indeterminate={selectedSomeProducts}
                      onChange={handleSelectAllItems}
                    />
                  ) : (
                    allSelectionLabel
                  )}
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
                    {rowSelection && rowSelection.rowSelectionColumnIndex === columnIndex && (
                      <TableCell align="center" padding="checkbox" className={classes.tableHeaderCell}>
                        {!hideAllSelect ? (
                          <Checkbox
                            checked={selectedAllProducts}
                            color="primary"
                            indeterminate={selectedSomeProducts}
                            onChange={handleSelectAllItems}
                          />
                        ) : (
                          allSelectionLabel
                        )}
                      </TableCell>
                    )}
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
                {paginatedItems.map((item, index) => {
                  const uniqueValue = get(item, rowKey);
                  const isSelected = selectedRowKeys.includes(uniqueValue);
                  const checkboxProps = getCheckboxProps(item);

                  return (
                    <TableRow
                      hover={hover}
                      className={`row_${uniqueValue}`}
                      key={uniqueValue}
                      selected={isSelected}
                      onClick={(event) =>
                        rowSelection && enableSelectByRowClick && handleSelectOneItem(event, uniqueValue)
                      }
                    >
                      {rowSelection && !rowSelection.rowSelectionColumnIndex && (
                        <TableCell padding="checkbox">
                          <Checkbox
                            checked={isSelected}
                            color="primary"
                            value={isSelected}
                            onChange={(event) => !enableSelectByRowClick && handleSelectOneItem(event, uniqueValue)}
                            {...checkboxProps}
                          />
                        </TableCell>
                      )}
                      {columns.map(
                        (
                          { align, dataKey, colSpan: getColSpan, rowSpan: getRowSpan, render, hide = false },
                          columnIndex,
                        ) => {
                          const hasSpan = typeof getColSpan === 'function' || typeof getRowSpan === 'function';
                          const colSpan = typeof getColSpan === 'function' ? getColSpan(item, index) : undefined;
                          const rowSpan = typeof getRowSpan === 'function' ? getRowSpan(item, index) : undefined;
                          const isSkipRender = hasSpan && !colSpan && !rowSpan;

                          if (hide) {
                            return null;
                          }

                          if (isSkipRender) {
                            return rowSelection && rowSelection.rowSelectionColumnIndex === columnIndex ? (
                              <TableCell key={`selection-${columnIndex}`} padding="checkbox">
                                <Checkbox
                                  checked={isSelected}
                                  color="primary"
                                  value={isSelected}
                                  onChange={(event) =>
                                    !enableSelectByRowClick && handleSelectOneItem(event, uniqueValue)
                                  }
                                  {...checkboxProps}
                                />
                              </TableCell>
                            ) : null;
                          }

                          return (
                            <React.Fragment key={dataKey}>
                              {rowSelection && rowSelection.rowSelectionColumnIndex === columnIndex && (
                                <TableCell padding="checkbox">
                                  <Checkbox
                                    key={`selection-${columnIndex}`}
                                    checked={isSelected}
                                    color="primary"
                                    value={isSelected}
                                    onChange={(event) =>
                                      !enableSelectByRowClick && handleSelectOneItem(event, uniqueValue)
                                    }
                                    {...checkboxProps}
                                  />
                                </TableCell>
                              )}
                              <TableCell align={align} {...(colSpan && { colSpan })} {...(rowSpan && { rowSpan })}>
                                {render ? render(get(item, dataKey, ''), item, index) : get(item, dataKey, '')}
                              </TableCell>
                            </React.Fragment>
                          );
                        },
                      )}
                    </TableRow>
                  );
                })}

                {paginatedItems.length === 0 && (
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
          </TableBody>
        </TableMaterial>
      </TableContainer>
      {pagination && (
        <TablePagination
          page={page}
          total={pagination.total}
          limit={limit}
          rowsPerPageOptions={rowsPerPageOptions}
          onChangePage={handleChangePage}
          onChangeLimit={handleChangeLimit}
          showFirstButton={pagination.showFirstButton}
          showLastButton={pagination.showLastButton}
        />
      )}
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
