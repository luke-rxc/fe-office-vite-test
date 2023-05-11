import React from 'react';
import _isNull from 'lodash/isNull';
import _isEqual from 'lodash/isEqual';
import _isUndefined from 'lodash/isUndefined';
import { Chip, ChipProps } from '@material-ui/core';

export interface TChipOption {
  label: string;
  value?: string | number;
}

export interface IChipsProps extends Omit<ChipProps, 'onDelete' | 'label'> {
  /** chip 리스트 데이터 */
  options: TChipOption[];
  /** 삭제 기능 사용 여부 */
  isDelete?: boolean;
  /** 삭제 이벤트 */
  onDelete?: (value: TChipOption['value'], deletedChip?: TChipOption) => void;
}

/**
 * Chip 리스트 컴포넌트
 */
export const Chips: React.FC<IChipsProps> = ({ sx, isDelete, options, onDelete, ...props }) => {
  const isInitialized = React.useRef(null);
  const prevOptions = React.useRef(null);
  const [chipList, setChipList] = React.useState(options);

  /**
   * 삭제 이벤트
   */
  const handleDelete =
    ({ label, value }: TChipOption) =>
    () => {
      const newChipList = chipList.filter((chip) =>
        _isNull(value) || _isUndefined(undefined) ? chip.label !== label : chip.value !== value,
      );

      setChipList(newChipList);
      onDelete && onDelete(value, { label, value });
    };

  /**
   * chip 데이터 변경서 chip리스트 업데이트
   */
  React.useEffect(() => {
    if (isInitialized.current && !_isEqual(options, prevOptions.current)) {
      prevOptions.current = options;
      setChipList(options);
    } else {
      isInitialized.current = true;
    }
  }, [options]);

  return (
    <>
      {chipList.map(({ label, value }) => (
        <Chip
          key={value ?? label}
          label={label}
          variant="outlined"
          sx={{ m: 1, ...sx }}
          onDelete={isDelete ? handleDelete({ label, value }) : undefined}
          {...props}
        />
      ))}
    </>
  );
};
