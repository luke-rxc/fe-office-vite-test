import { Layout } from '@components/Layout';
import { MainBannerDetailForm } from '../components';
import { useMainBannerCreateService } from '../services';

export const MainBannerCreateContainer = () => {
  const params = useMainBannerCreateService();

  return (
    <Layout title="메인 배너 편성 콘텐츠 생성">
      <MainBannerDetailForm {...params} mode="EDIT" />
    </Layout>
  );
};
