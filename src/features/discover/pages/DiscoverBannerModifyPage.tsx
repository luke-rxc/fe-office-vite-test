import { useParams } from 'react-router-dom';
import { DiscoverBannerModifyContainer } from '../containers';

const DiscoverBannerModifyPage = () => {
  const { bannerId } = useParams();

  return <DiscoverBannerModifyContainer bannerId={bannerId} />;
};

export default DiscoverBannerModifyPage;
