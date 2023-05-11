import { useUserType } from '../hooks';
import { SettlementListContainer, ProviderSettlementListContainer } from '../containers';

const SettlementListPage = (): JSX.Element => {
  const { isManager } = useUserType();
  return isManager ? <SettlementListContainer /> : <ProviderSettlementListContainer />;
};

export default SettlementListPage;
