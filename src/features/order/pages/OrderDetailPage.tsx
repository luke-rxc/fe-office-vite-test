import { useParams } from 'react-router-dom';
import { OrderDetailContainer } from '../containers';

const OrderDetailPage = () => {
  const { orderId } = useParams();

  return <OrderDetailContainer orderId={orderId} />;
};

export default OrderDetailPage;
