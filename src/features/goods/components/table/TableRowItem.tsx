import React, { useEffect, useState, useCallback, useMemo } from 'react';
import get from 'lodash/get';
import clsx from 'clsx';
import styled from '@emotion/styled';
import { TableCell, Checkbox, TableRow as TableRowComponent, Button, Typography } from '@material-ui/core';
import { ClassNameMap } from '@material-ui/core/styles/withStyles';
import XIcon from '@assets/icons/X';
import { RowSelectionProps, TableColumnProps, DeleteProps } from './TableLight';

interface DeleteRowProps extends DeleteProps {
  /** 현재 삭제가 되어 있는 상태인지 체크 */
  isDelete?: boolean;
}
interface Props<T> {
  item: T;
  classes: ClassNameMap;
  columns: Array<TableColumnProps<T>>;
  itemIndex: number;
  enableSelectByRowClick: boolean;
  hover: boolean;
  rowKey: string;
  rowSelection: RowSelectionProps<T>;
  style?: React.CSSProperties;
  /** render로 설정한 정상 Node 형태의 노출 여부 */
  editable?: boolean;
  /** Delete 에 대한 Options */
  deleteOptions: DeleteRowProps;
  /** 해당 Row Disabled 처리 */
  disabled: boolean;
  /** error UI 처리 */
  errored: boolean;
  handleGetCheckboxProps: (item: T) => Object;
  handleSelectOneItem: (
    event: React.MouseEvent<HTMLDivElement, MouseEvent> | React.ChangeEvent<HTMLInputElement>,
    itemIndex: number,
  ) => void;
  handleRowClick?: (itemIndex: number) => void;
}

/** Row의 View Type */
const EditModeType = {
  PREVIEW: 'PREVIEW',
  EDIT: 'EDIT',
  DISABLED: 'DISABLED',
};

export const TableRowItem = React.memo(
  <T extends object>({
    item,
    classes,
    columns,
    itemIndex,
    enableSelectByRowClick,
    hover,
    rowKey,
    rowSelection,
    style,
    deleteOptions,
    disabled,
    errored,
    editable = false,
    handleRowClick,
    handleSelectOneItem,
    handleGetCheckboxProps,
  }: Props<T>) => {
    const uniqueValue = get(item, rowKey);
    const checkboxProps = handleGetCheckboxProps(item);
    const { isDelete, deletable, onDelete: handleDelete } = deleteOptions;

    /** 삭제 UI 노출여부 */
    const isDeletable = deletable && !isDelete;

    /** Disabled UI 처리여부 */
    const [isDisabled, setIsDisabled] = useState(disabled);

    /** List Select 여부 */
    const [isSelected, setIsSelected] = useState(false);

    /** Row 활성화 */
    const handleClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      const $el = event.target as HTMLElement;
      const label = $el.getAttribute('aria-label') ?? null;

      // Row 활성화 로직과 중복되는 경우에는 활성화 로직 처리하지 않음
      if (label === 'selectRow' || isDisabled || editable) {
        return;
      }

      handleRowClick?.(itemIndex);
    };

    /** 단일 리스트 삭제 */
    const handleRemoveIndex = useCallback(
      (evt: React.MouseEvent) => {
        if (isDisabled) {
          evt.preventDefault();
          evt.stopPropagation();
          return;
        }
        setIsDisabled(true);
        handleDelete(itemIndex);
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [itemIndex],
    );

    /** Checkbox를 통한 리스트 선택 */
    const handleSelect = (
      event: React.MouseEvent<HTMLDivElement, MouseEvent> | React.ChangeEvent<HTMLInputElement>,
    ) => {
      setIsSelected((prev) => !prev);
      handleSelectOneItem(event, itemIndex);
    };

    /** Row의 View Type 정의 */
    const editMode = useMemo(() => {
      if (isDisabled) {
        return EditModeType.DISABLED;
      }
      if (editable) {
        return EditModeType.EDIT;
      }
      return EditModeType.PREVIEW;
    }, [isDisabled, editable]);

    /**
     * Select Row 선택으로 인해 삭제한 경우의 처리
     */
    useEffect(() => {
      if (!isDisabled && disabled) {
        setIsDisabled(true);
        setIsSelected(false);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [disabled]);

    /**
     * Clear : Row 선택처리
     */
    useEffect(() => {
      return () => {
        handleRowClick?.(null);
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
      <TableRowComponent
        component="div"
        className={classes.row}
        hover={hover && !isDeletable}
        key={uniqueValue}
        selected={isSelected}
        style={style}
        onClick={handleClick}
      >
        {rowSelection && !rowSelection.rowSelectionColumnIndex && (
          <TableCell
            padding="checkbox"
            component="div"
            variant="body"
            className={clsx(
              classes.cell,
              isDisabled && classes.tableDisabled,
              errored && editMode === EditModeType.PREVIEW && classes.tableErrored,
            )}
          >
            {errored && editMode !== EditModeType.EDIT && (
              <Typography textAlign="center" color="#000" fontWeight={700}>
                {itemIndex + 1}
              </Typography>
            )}
            {(!errored || editMode === EditModeType.EDIT) && (
              <Checkbox
                checked={isSelected}
                color="primary"
                value={isSelected}
                onChange={(event) => !enableSelectByRowClick && handleSelect(event)}
                inputProps={{
                  'aria-label': 'selectRow',
                  disabled: isDisabled,
                }}
                className={clsx(isDisabled && classes.checkboxDisabled)}
                {...checkboxProps}
              />
            )}
          </TableCell>
        )}
        {columns.map(({ align, dataKey, width, render, renderPreview, forceRender = false, hide = false }) => {
          if (hide) {
            return null;
          }

          const value = get(item, dataKey, '');

          return (
            <React.Fragment key={dataKey}>
              <TableCell
                component="div"
                variant="body"
                width={width ?? 'auto'}
                align={align}
                className={clsx(
                  classes.cell,
                  !width && classes.expandingCell,
                  isDisabled && classes.tableDisabled,
                  errored && editMode === EditModeType.PREVIEW && classes.tableErrored,
                )}
                style={{
                  flexBasis: width || 'auto',
                }}
              >
                {editMode === EditModeType.DISABLED && <TableRowPreviewStyled>-</TableRowPreviewStyled>}
                {editMode === EditModeType.EDIT && (render ? render(value, item, itemIndex) : value)}
                {editMode === EditModeType.PREVIEW && (
                  <TableRowPreviewStyled>
                    {forceRender && (render ? render(value, item, itemIndex) : value)}
                    {!forceRender && renderPreview ? renderPreview(value, item, itemIndex) : value}
                  </TableRowPreviewStyled>
                )}
              </TableCell>
            </React.Fragment>
          );
        })}
        {isDeletable && (
          <TableCell
            padding="checkbox"
            width="auto"
            component="div"
            variant="body"
            className={clsx(
              classes.cell,
              classes.expandingCell,
              isDisabled && classes.tableDisabled,
              errored && editMode === EditModeType.PREVIEW && classes.tableErrored,
            )}
            style={{
              flexBasis: 'auto',
            }}
          >
            <Button color="primary" variant="text" size="medium" onClick={handleRemoveIndex} disabled={isDisabled}>
              <XIcon fontSize="small" />
            </Button>
          </TableCell>
        )}
      </TableRowComponent>
    );
  },
  (prevProps, nextProps) => {
    const isEqualItemIndex = prevProps.itemIndex === nextProps.itemIndex;
    const isEqualItemId = prevProps.item['id'] === nextProps.item['id'];
    const isEqualEditable = prevProps.editable === nextProps.editable;
    const isEqualDisabled = prevProps.disabled === nextProps.disabled;
    const isEqualErrored = prevProps.errored === nextProps.errored;

    const isRenderPrevent = isEqualItemIndex && isEqualItemId && isEqualEditable && isEqualDisabled && isEqualErrored;
    return isRenderPrevent;
  },
);

const TableRowPreviewStyled = styled.div`
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
`;
