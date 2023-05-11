import { Layout } from '@components/Layout';
import { Button } from '@material-ui/core';
import { SearchForm, CouponList } from '../components';
import { useCouponListService } from '../services';

export const CouponListContainer = () => {
  const {
    couponItems,
    isLoading,
    pagination,
    form,
    action: { handleClickGoCreateCoupon, ...action },
  } = useCouponListService();

  return (
    <Layout
      title="쿠폰조회/목록"
      actions={[
        <Button
          key="btn-auction"
          color="primary"
          variant="contained"
          size="large"
          sx={{ ml: '10px' }}
          onClick={handleClickGoCreateCoupon}
        >
          쿠폰 등록
        </Button>,
      ]}
    >
      <>
        <SearchForm form={form} />
        {!isLoading && <CouponList items={couponItems} pagination={pagination} action={action} />}
      </>
    </Layout>
  );
};
