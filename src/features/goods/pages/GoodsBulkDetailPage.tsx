import { useParams } from 'react-router-dom';
import { GoodsBulkDetailContainer } from '../containers';

const GoodsBulkDetailPage = () => {
  const { bulkId } = useParams();
  return <GoodsBulkDetailContainer id={bulkId} />;
};

export default GoodsBulkDetailPage;
