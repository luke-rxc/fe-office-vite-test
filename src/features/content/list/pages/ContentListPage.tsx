import { Helmet } from 'react-helmet-async';
import { ContentListContainer } from '../containers';

const ContentListPage = () => {
  return (
    <>
      <Helmet>
        <title>콘텐츠 관리 및 생성</title>
      </Helmet>
      <ContentListContainer />
    </>
  );
};

export default ContentListPage;
