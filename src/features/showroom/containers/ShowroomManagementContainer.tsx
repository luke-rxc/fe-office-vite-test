import { Layout } from '@components/Layout';
import { useShowroom } from '../hooks';
import { ShowroomInfoContainer } from './ShowroomInfoContainer';
import { SubShowroomListContainer } from './SubShowroomListContainer';
import { ContentListContainer } from './ContentListContainer';
import { GoodsListContainer } from './GoodsListContainer';
import { SectionListContainer } from './SectionListContainer';

/**
 * 쇼룸 상세 관리 로케이션
 */
const ShowroomManagementPageLocation = {
  title: '쇼룸 조회/관리 상세',
  locations: [
    { text: '쇼룸', path: '/showroom' },
    { text: '쇼룸 조회/관리', path: '/showroom' },
    { text: '쇼룸 조회/관리 상세' },
  ],
};

/**
 * 쇼룸 상세 관리 컨테이너
 */
export const ShowroomManagementContainer = () => {
  const { type } = useShowroom();

  return (
    <Layout {...ShowroomManagementPageLocation}>
      <ShowroomInfoContainer />
      <SubShowroomListContainer />
      <ContentListContainer />
      {type && type === 'CONCEPT' ? <SectionListContainer /> : <GoodsListContainer />}
    </Layout>
  );
};
