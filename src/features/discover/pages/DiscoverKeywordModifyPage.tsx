import { useParams } from 'react-router-dom';
import { DiscoverKeywordModifyContainer } from '../containers';

const DiscoverKeywordModifyPage = () => {
  const { keywordId } = useParams();

  return <DiscoverKeywordModifyContainer keywordId={keywordId} />;
};

export default DiscoverKeywordModifyPage;
