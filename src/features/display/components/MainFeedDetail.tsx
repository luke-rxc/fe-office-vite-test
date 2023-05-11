import { MainFeedDetailForm } from '.';
import { UseMainFeedDetailService } from '../services';

interface Props extends Partial<UseMainFeedDetailService> {
  data: UseMainFeedDetailService['detailData']['value'];
  status: UseMainFeedDetailService['detailData']['status'];
}

export const MainFeedDetail = (props: Props) => {
  if (props.status === 'error') return <Fallback />;

  return (
    <section>
      <MainFeedDetailForm {...props} />
    </section>
  );
};

const Fallback = () => {
  return <section>조회에 실패했거나 없는 피드입니다.</section>;
};
