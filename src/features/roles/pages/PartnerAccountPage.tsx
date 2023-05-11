import { LoadingTaskProvider } from '@contexts/LoadingTaskContext';
import { PrincipalProvider } from '../contexts';
import { PRINCIPAL_TYPE } from '../constants';
import { UserAccountContainer } from '../containers';

/**
 * 파트너 계정 관리 페이지
 */
export const PartnerAccountPage = (): JSX.Element => {
  return (
    <LoadingTaskProvider>
      <PrincipalProvider principalType={PRINCIPAL_TYPE.PARTNER}>
        <UserAccountContainer />
      </PrincipalProvider>
    </LoadingTaskProvider>
  );
};

export default PartnerAccountPage;
