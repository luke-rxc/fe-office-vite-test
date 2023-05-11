import { useParams } from 'react-router-dom';
import { OrderExportDetailContainer } from '../containers';

const OrderExportDetailPage = () => {
  const { exportId } = useParams();

  return <OrderExportDetailContainer exportId={exportId} />;
};

export default OrderExportDetailPage;
