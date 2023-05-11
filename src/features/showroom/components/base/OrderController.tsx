import React from 'react';
import styled from '@emotion/styled';
import FirstPage from '@material-ui/icons/FirstPage';
import Forward from '@material-ui/icons/KeyboardArrowUp';
import Backward from '@material-ui/icons/KeyboardArrowDown';
import { IconButton } from '@components/IconButton';

const Top = styled(FirstPage)`
  transform: rotate(90deg);
`;

const Bottom = styled(FirstPage)`
  transform: rotate(270deg);
`;

export interface OrderControllerProps {
  /** 버튼 비활성화 여부 */
  disabled?: boolean;
  /** 맨앞으로 이동 */
  onTop?: () => void;
  /** 맨뒤로 이동 */
  onBottom?: () => void;
  /** 앞으로 이동 */
  onForward?: () => void;
  /** 뒤로 이동 */
  onBackward?: () => void;
}

/**
 * 테이블 순서 변경 컨트롤러 컴포넌트
 */
export const OrderController: React.FC<OrderControllerProps> = ({
  disabled,
  onTop,
  onBottom,
  onForward,
  onBackward,
}) => {
  return (
    <>
      {onTop && <IconButton icon={<Top />} title="맨 위로" disabled={disabled} onClick={onTop} />}
      {onForward && <IconButton icon={<Forward />} title="위로" disabled={disabled} onClick={onForward} />}
      {onBackward && <IconButton icon={<Backward />} title="아래로" disabled={disabled} onClick={onBackward} />}
      {onBottom && <IconButton icon={<Bottom />} title="맨 아래로" disabled={disabled} onClick={onBottom} />}
    </>
  );
};
