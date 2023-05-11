import { LoadingTaskProvider } from '@contexts/LoadingTaskContext';
import { PrincipalProvider } from '../contexts';
import { PRINCIPAL_TYPE } from '../constants';
import { UserAccountDetailContainer } from '../containers';

/**
 * 매니저 계정 상세 페이지
 */
export const ManagerAccountPage = (): JSX.Element => {
  return (
    <LoadingTaskProvider>
      <PrincipalProvider principalType={PRINCIPAL_TYPE.MANAGER}>
        <UserAccountDetailContainer />
      </PrincipalProvider>
    </LoadingTaskProvider>
  );
};

export default ManagerAccountPage;
