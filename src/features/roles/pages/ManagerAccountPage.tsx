import { LoadingTaskProvider } from '@contexts/LoadingTaskContext';
import { PrincipalProvider } from '../contexts';
import { PRINCIPAL_TYPE } from '../constants';
import { UserAccountContainer } from '../containers';

/**
 * 매니저 계정 관리 페이지
 */
export const ManagerAccountPage = (): JSX.Element => {
  return (
    <LoadingTaskProvider>
      <PrincipalProvider principalType={PRINCIPAL_TYPE.MANAGER}>
        <UserAccountContainer />
      </PrincipalProvider>
    </LoadingTaskProvider>
  );
};

export default ManagerAccountPage;
