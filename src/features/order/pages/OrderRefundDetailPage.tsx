import { useParams } from 'react-router-dom';
import { OrderRefundDetailContainer } from '../containers';

const OrderRefundDetailPage = () => {
  const { refundId } = useParams();

  return <OrderRefundDetailContainer refundId={refundId} />;
};

export default OrderRefundDetailPage;
