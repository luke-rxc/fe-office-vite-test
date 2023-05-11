import { useParams } from 'react-router-dom';
import { DiscoverSectionModifyContainer } from '../containers';

const DiscoverSectionModifyPage = () => {
  const { sectionId } = useParams();

  return <DiscoverSectionModifyContainer sectionId={sectionId} />;
};

export default DiscoverSectionModifyPage;
