import { Helmet } from 'react-helmet-async';
import { ContentContainer } from '../containers';
import { ContentProvider } from '../contexts';

const ContentBuilderPage = () => {
  return (
    <>
      <Helmet>
        <title>콘텐츠 크리에이터</title>
      </Helmet>
      <ContentProvider>
        <ContentContainer />;
      </ContentProvider>
    </>
  );
};

export default ContentBuilderPage;
