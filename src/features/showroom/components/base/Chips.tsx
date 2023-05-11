import React from 'react';
import isEmpty from 'lodash/isEmpty';
import styled from '@emotion/styled';
import { Chip, Stack, Typography, ChipProps } from '@material-ui/core';

export interface ChipsProps<T extends object, K extends keyof T = keyof T> {
  /** Chip을 표현할 데이터 목록 */
  items: T[];
  /** 데이터에서 key값으로 사용할 프로퍼티명 */
  dataKey: K;
  /** 데이터가 없을때 표시할 텍스트 */
  emptyText?: string;
  /** MUI Chip Props */
  chipProps?: Omit<ChipProps, 'label' | 'onDelete'>;
  /** chip에 표시될 텍스트를 가공하는 렌더함수 */
  getLabel: (item: T, index: number) => string;
  /** 삭제 버튼 클릭시 실행할 콜백 */
  onDelete?: (dataKeyValue: T[K], item: T) => void;
}

/**
 * Chip 목록 컴포넌트
 */
export const Chips = <T extends object, K extends keyof T = keyof T>({
  items,
  dataKey,
  emptyText,
  chipProps,
  getLabel,
  onDelete,
}: ChipsProps<T, K>) => {
  return (
    <StackStyled flexWrap="wrap" direction="row" justifyContent="left" alignItems="center">
      {isEmpty(items) ? (
        <Typography color="#6b778c">{emptyText ?? '항목이 없습니다'}</Typography>
      ) : (
        items.map((item, index) => (
          <Chip
            sx={{ m: 0.5 }}
            key={`${item[dataKey]}`}
            label={getLabel(item, index)}
            onDelete={() => onDelete && onDelete(item[dataKey], item)}
            {...chipProps}
          />
        ))
      )}
    </StackStyled>
  );
};

const StackStyled = styled(Stack)`
  min-height: 58px;
  padding: ${({ theme }) => `${theme.spacing(1)} ${theme.spacing(1.5)}`};
  border: 1px solid #c4c4c4;
  border-radius: ${({ theme }) => `${theme.shape.borderRadius}px`};
`;
