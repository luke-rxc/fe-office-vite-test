import React from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { Card, CardHeader, CardContent, Button, Divider } from '@material-ui/core';
import PlusIcon from '@assets/icons/Plus';
import { Layout } from '@components/Layout';
import {
  MANAGER_LIST_TITLE,
  PARTNER_LIST_TITLE,
  MANAGER_INVITE_BUTTON_LABEL,
  PARTNER_INVITE_BUTTON_LABEL,
  INVITATION_LIST_TITLE,
} from '../constants';
import { usePrincipal } from '../hooks';
import { AccountSearchContainer } from './AccountSearchContainer';
import { AccountListContainer } from './AccountListContainer';
import { InvitationModalContainer } from './InvitationModalContainer';
import { InvitationListContainer } from './InvitationListContainer';

/**
 * 계정 리스트 영역 스타일
 */
const useAccountStyles = makeStyles((theme: Theme) => ({
  header: { padding: theme.spacing(3) },
  content: { paddingBottom: `${theme.spacing(1)} !important` },
}));

/**
 * 초대 리스트 영역 스타일
 */
const useInvitationStyles = makeStyles((theme: Theme) => ({
  root: { marginTop: theme.spacing(5) },
  header: { padding: theme.spacing(3) },
  content: { paddingBottom: `${theme.spacing(2)} !important` },
}));

/**
 * 초대하기 버튼
 */
const InvitationButton = ({ text, onClick: handleClick }: { text: string; onClick: () => void }) => (
  <Button variant="contained" onClick={handleClick} startIcon={<PlusIcon />}>
    {text}
  </Button>
);

/**
 * 계정 목록 페이지
 */
export const UserAccountContainer = (): JSX.Element => {
  /**
   * 계정 영역 레이아웃 스타일
   */
  const accountStyles = useAccountStyles();

  /**
   * 초대 영역 레이아웃 스타일
   */
  const inviteStyles = useInvitationStyles();

  /**
   * 관리 계정 타입(매니저/파트너)
   */
  const { isManager } = usePrincipal();

  /**
   * 페이지 타이틀, 로케이션
   */
  const { title, locations } = React.useMemo(() => getLocation(isManager), [isManager]);

  /**
   * 계정 리스트 타이틀, 계정 초대 버튼 텍스트
   */
  const [accountTitle, invitationText] = React.useMemo(() => {
    return isManager
      ? [MANAGER_LIST_TITLE, MANAGER_INVITE_BUTTON_LABEL]
      : [PARTNER_LIST_TITLE, PARTNER_INVITE_BUTTON_LABEL];
  }, [isManager]);

  /**
   * 계정 초대 팝업 State
   */
  const [isInvitationModalOpen, setInvitationModalOpen] = React.useState(false);

  /**
   * 계정 초대 팝업 활성화
   */
  const showInvitationModal = () => {
    setInvitationModalOpen(true);
  };

  /**
   * 계정 초대 팝업 활성화
   */
  const hideInvitationModal = () => {
    setInvitationModalOpen(false);
  };

  return (
    <Layout title={title} locations={locations}>
      <>
        {/* 계정 목록 */}
        <Card>
          <CardHeader
            className={accountStyles.header}
            title={accountTitle}
            action={<InvitationButton text={invitationText} onClick={showInvitationModal} />}
          />
          <Divider />
          <CardContent className={accountStyles.content}>
            {/* 계정 검색 */}
            <AccountSearchContainer />

            <Divider sx={{ mt: 5, opacity: 0 }} />

            {/* 계정 리스트 */}
            <AccountListContainer />

            {/* 초대팝업 */}
            {isInvitationModalOpen && <InvitationModalContainer onClose={hideInvitationModal} />}
          </CardContent>
        </Card>

        {/* 초대 목록 */}
        <Card className={inviteStyles.root}>
          <CardHeader className={inviteStyles.header} title={INVITATION_LIST_TITLE} />
          <Divider />
          <CardContent className={inviteStyles.content}>
            {/* 초대 리스트(with 초대승인 모달) */}
            <InvitationListContainer />
          </CardContent>
        </Card>
      </>
    </Layout>
  );
};

/**
 * 아직 location에 대한 정책이 정해지지 않아 더미로 생성
 * @todd 추후 location 정책이 수립되면 정책에 맞게 코드 수정 필요
 */
const getLocation = (isManager) => {
  const managerLocations = [{ path: '/roles/managers', text: '권리 권한' }, { text: '매니저 계정 관리' }];
  const partnerLocations = [{ path: '/roles/partners', text: '권리 권한' }, { text: '파트너 계정 관리' }];
  const locations = isManager ? managerLocations : partnerLocations;

  return {
    title: locations[1].text,
    locations,
  };
};
