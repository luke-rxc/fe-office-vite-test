import { MainBannerDetailForm } from '.';
import { UseMainBannerDetailService } from '../services';

interface Props extends Partial<UseMainBannerDetailService> {
  data: UseMainBannerDetailService['detailData']['value'];
  status: UseMainBannerDetailService['detailData']['status'];
}

export const MainBannerDetail = (props: Props) => {
  if (props.status === 'error') return <Fallback />;

  return (
    <section>
      <MainBannerDetailForm {...props} />
    </section>
  );
};

const Fallback = () => {
  return <section>조회에 실패했거나 없는 배너입니다.</section>;
};
