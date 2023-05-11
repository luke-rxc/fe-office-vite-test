import type { FC } from 'react';
import { Helmet } from 'react-helmet-async';
import { ProviderListContainer } from '../containers';

const ProviderListPage: FC = () => {
  return (
    <>
      <Helmet>
        <title>입점사 관리 - 입점사 조회</title>
      </Helmet>
      <ProviderListContainer />
    </>
  );
};
export default ProviderListPage;
