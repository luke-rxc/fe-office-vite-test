import { useParams } from 'react-router';
import { DiscoverFeedModifyContainer } from '../containers';

const DiscoverFeedModifyPage = () => {
  const { feedId } = useParams();
  return <DiscoverFeedModifyContainer feedId={feedId} />;
};

export default DiscoverFeedModifyPage;
