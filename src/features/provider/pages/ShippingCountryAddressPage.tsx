import type { VFC } from 'react';
import { Helmet } from 'react-helmet-async';
import { ShipCountryAddressContainer } from '../containers';

const ShippingCountryAddressPage: VFC = () => {
  return (
    <>
      <Helmet>
        <title>제주/도서산간지역</title>
      </Helmet>
      <ShipCountryAddressContainer />
    </>
  );
};

export default ShippingCountryAddressPage;
