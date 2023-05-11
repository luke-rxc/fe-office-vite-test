import { useParams } from 'react-router-dom';
import { OrderReturnDetailContainer } from '../containers';

const OrderReturnDetailPage = () => {
  const { returnId } = useParams();

  return <OrderReturnDetailContainer returnId={returnId} />;
};

export default OrderReturnDetailPage;
