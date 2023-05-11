import { Layout } from '@components/Layout';
import { MainFeedDetailForm } from '../components';
import { useMainFeedCreateService } from '../services';

export const MainFeedCreateContainer = () => {
  const params = useMainFeedCreateService();

  return (
    <Layout title="메인 피드 편성 콘텐츠 생성">
      <MainFeedDetailForm {...params} mode="EDIT" />
    </Layout>
  );
};
