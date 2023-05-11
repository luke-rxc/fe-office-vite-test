import React from 'react';
import { Grid } from '@material-ui/core';
import { Layout } from '@components/Layout';
import { usePrincipal } from '../hooks';
import { AccountInfoContainer } from './AccountInfoContainer';
import { AccountPermissionsContainer } from './AccountPermissionsContainer';

/**
 * 계정 상세 정보 컨테이너
 */
export const UserAccountDetailContainer = (): JSX.Element => {
  /**
   * 관리 계정 타입(매니저/파트너)
   */
  const { isManager } = usePrincipal();

  /**
   * 페이지 타이틀, 로케이션
   */
  const { title, locations } = React.useMemo(() => getLocation(isManager), [isManager]);

  return (
    <Layout title={title} locations={locations}>
      <Grid container spacing={3}>
        {/* 기본 정보 & 소속 정보 */}
        <Grid item md={4} xs={12}>
          <AccountInfoContainer />
        </Grid>
        {/* 권한 정보 */}
        <Grid item md={8} xs={12}>
          <AccountPermissionsContainer />
        </Grid>
      </Grid>
    </Layout>
  );
};

/**
 * 아직 location에 대한 정책이 정해지지 않아 더미로 생성
 * @todd 추후 location 정책이 수립되면 정책에 맞게 코드 수정 필요
 */
const getLocation = (isManager) => {
  const managerLocations = [
    { text: '권리 권한', path: '/roles/managers' },
    { text: '매니저 계정 관리', path: '/roles/managers' },
    { text: '매니저 계정 상세' },
  ];
  const partnerLocations = [
    { text: '권리 권한', path: '/roles/partners' },
    { text: '파트너 계정 관리', path: '/roles/partners' },
    { text: '파트너 계정 상세' },
  ];
  const locations = isManager ? managerLocations : partnerLocations;

  return {
    title: locations[1].text,
    locations,
  };
};
