import type { VFC } from 'react';
import { Helmet } from 'react-helmet-async';
import { ProviderDetailContainer } from '../containers';

const ProviderDetailPage: VFC = () => {
  return (
    <>
      <Helmet>
        <title>입점사 관리 - 입점사 상세</title>
      </Helmet>
      <ProviderDetailContainer />
    </>
  );
};

export default ProviderDetailPage;
