/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import LockIcon from '@material-ui/icons/Lock';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import { Tooltip, IconButton } from '@material-ui/core';
import Label from '@components/Label';
import { Table, TableColumnProps } from '@components/table/Table';
import { INVITATION_TABLE_DATA_KEYS, INVITATION_TABLE_HEADER_LABELS, INVITATION_APPROVAL_MODAL_BUTTON_LABEL, INVITATION_CANCEL_BUTTON_LABEL } from '../constants'; // prettier-ignore
import { InvitationListModel, InvitationItemModel } from '../models';

interface IInvitationListProps {
  /** 관리 계정 타입 */
  isManager: boolean;
  /** 초대 리스트 */
  invitationList: InvitationListModel;
  /** 초대 취소 이벤트 콜백 */
  onInvitationCancel: (inviteInfo: InvitationItemModel) => () => void;
  /** 초대 승인 이벤트 콜백 */
  onInvitationApproval: (inviteInfo: InvitationItemModel) => () => void;
}

/**
 * 계정 초대 컨테이너
 */
export const InvitationList = ({
  isManager,
  invitationList: items,
  onInvitationCancel: handleInvitationCancel,
  onInvitationApproval: handleInvitationApproval,
}: IInvitationListProps) => {
  /**
   * 테이블 columns 데이터
   */
  const columns = React.useMemo(() => {
    return createColumns({
      isManager,
      onInvitationCancel: handleInvitationCancel,
      onInvitationApproval: handleInvitationApproval,
    });
  }, [isManager, handleInvitationCancel, handleInvitationApproval]);

  return <Table columns={columns} items={items} pagination={false} rowKey={INVITATION_TABLE_DATA_KEYS.ID} />;
};

/**
 * 초대 리스트 테이블의 Column 정보 생성
 */
const createColumns = ({
  isManager,
  onInvitationApproval: handelInvitationApproval,
  onInvitationCancel: handelInvitationCancel,
}): TableColumnProps<InvitationItemModel>[] => {
  return [
    // 이메일
    {
      align: 'center',
      label: INVITATION_TABLE_HEADER_LABELS.EMAIL,
      dataKey: INVITATION_TABLE_DATA_KEYS.EMAIL,
    },
    // 이름
    {
      align: 'center',
      label: INVITATION_TABLE_HEADER_LABELS.NAME,
      dataKey: INVITATION_TABLE_DATA_KEYS.NAME,
    },

    isManager
      ? // 부서명
        {
          align: 'center',
          label: INVITATION_TABLE_HEADER_LABELS.PART_NAME,
          dataKey: INVITATION_TABLE_DATA_KEYS.PART_NAME,
        }
      : // 회사/단체명
        {
          align: 'center',
          label: INVITATION_TABLE_HEADER_LABELS.COMPANY_NAME,
          dataKey: INVITATION_TABLE_DATA_KEYS.COMPANY_NAME,
        },

    // 초대일시
    {
      align: 'center',
      label: INVITATION_TABLE_HEADER_LABELS.CREATED_DATE,
      dataKey: INVITATION_TABLE_DATA_KEYS.CREATED_DATE,
    },
    // 초대한 계정
    {
      align: 'center',
      label: INVITATION_TABLE_HEADER_LABELS.INVITATION_USER_EMAIL,
      dataKey: INVITATION_TABLE_DATA_KEYS.INVITATION_USER_EMAIL,
    },
    // 초대 상태
    {
      align: 'center',
      label: INVITATION_TABLE_HEADER_LABELS.STATUS,
      dataKey: INVITATION_TABLE_DATA_KEYS.STATUS,
      render: (value, { status, statusName }) => (
        <Label color={status === 'ACTIVE' ? 'primary' : 'warning'} children={statusName} />
      ),
    },
    // Action Buttons
    {
      align: 'center',
      label: INVITATION_TABLE_HEADER_LABELS.ID,
      dataKey: INVITATION_TABLE_DATA_KEYS.ID,
      render: (value, inviteInfo) => (
        <>
          {/* 계정활성화 버튼 */}
          <Tooltip title={INVITATION_APPROVAL_MODAL_BUTTON_LABEL} placement="bottom">
            <span>
              <IconButton
                children={<LockIcon />}
                disabled={inviteInfo.status === 'INVITATION'}
                onClick={handelInvitationApproval(inviteInfo)}
              />
            </span>
          </Tooltip>

          {/* 초대 취소 버튼 */}
          <Tooltip title={INVITATION_CANCEL_BUTTON_LABEL} placement="bottom">
            <span>
              <IconButton children={<DeleteForeverIcon />} onClick={handelInvitationCancel(inviteInfo)} />
            </span>
          </Tooltip>
        </>
      ),
    },
  ];
};
