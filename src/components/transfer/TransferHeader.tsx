import React from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { ListSubheader, Checkbox } from '@material-ui/core'; // prettier-ignore

/** interface for TransferHeader */
export interface ITransferHeaderProps {
  title: React.ReactNode;
  itemSize: number;
  selectedSize: number;
  readOnlySize: number;
  isSelectedAll: boolean;
  onToggleAll?: () => void;
}

/**
 * TransferHeader 컴포넌트.
 *
 * material ui에서 기본적으로 TransferHeader에 position에 sticky를 사용하고 있다.
 * position:sticky는 2021.07월 기준 W3C Working Draft로 지속적인 확인이 필요
 */
export const TransferHeader: React.FC<ITransferHeaderProps & any> = ({
  title,
  itemSize,
  selectedSize,
  readOnlySize,
  onToggleAll,
}) => {
  const styles = useStyles();
  const isIndeterminate = itemSize > selectedSize && selectedSize !== 0;
  const isSelectedAll = itemSize !== 0 && itemSize === selectedSize;
  const isDisabled = itemSize === 0 || itemSize === readOnlySize;

  return (
    <ListSubheader className={styles.root}>
      <Checkbox
        checked={isSelectedAll}
        indeterminate={isIndeterminate}
        color={isIndeterminate ? 'default' : 'primary'}
        disabled={isDisabled}
        onClick={onToggleAll}
      />
      {title}
    </ListSubheader>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    fontWeight: 'bold',
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
}));
