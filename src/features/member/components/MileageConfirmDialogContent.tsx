import styled from '@emotion/styled';
import { MILEAGE_ACTION_TYPE } from '../constants';

export interface MileageConfirmDialogContentProps {
  type: string;
  point: string;
  expiredDate: string;
  reason: string;
  memo: string;
  className?: string;
}

export const MileageConfirmDialogContent = styled(
  ({ type, point, expiredDate, reason, memo, className }: MileageConfirmDialogContentProps) => {
    return (
      <span className={className}>
        <span className="row">
          <span className="label">적립금</span>
          <b className="text">{point}</b>
        </span>
        {type === MILEAGE_ACTION_TYPE.SAVE && (
          <span className="row">
            <span className="label">만료일</span>
            <b className="text">{expiredDate}</b>
          </span>
        )}
        <span className="row">
          <span className="label">{type === MILEAGE_ACTION_TYPE.SAVE ? '지급' : '차감'} 사유</span>
          <b className="text">{reason}</b>
        </span>
        <span className="row">
          <span className="label">관리자 메모</span>
          <span className="text admin-memo">{memo || '-'}</span>
        </span>
      </span>
    );
  },
)`
  & .row {
    display: flex;
    text-align: left;
    max-width: 350px;
  }

  & .label {
    display: inline-flex;
    min-width: 30%;
  }

  & .text {
    display: inline-flex;
    min-width: 70%;
    word-break: break-all;
  }

  .admin-memo {
    white-space: pre;
  }
`;
