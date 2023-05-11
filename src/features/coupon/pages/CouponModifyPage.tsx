import { useParams } from 'react-router-dom';
import { CouponModifyContainer } from '../containers';

const CouponModifyPage = () => {
  const { couponId } = useParams();

  return <CouponModifyContainer couponId={Number(couponId)} />;
};
export default CouponModifyPage;
