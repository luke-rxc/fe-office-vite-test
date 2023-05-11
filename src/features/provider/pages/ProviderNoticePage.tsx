import type { VFC } from 'react';
import { Helmet } from 'react-helmet-async';

const ProviderNoticePage: VFC = () => {
  return (
    <>
      <Helmet>
        <title>입점사 공지관리</title>
      </Helmet>
      <>입점사 공지관리</>
    </>
  );
};
export default ProviderNoticePage;
