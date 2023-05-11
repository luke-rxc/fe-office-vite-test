import { Modal } from '@components/Modal';
import styled from '@emotion/styled';
import { Box } from '@material-ui/core';
import React, { useLayoutEffect } from 'react';

interface Props {
  openAddressModal: boolean;
  loadAddressModule: () => void;
  onCloseModal: () => void;
}

/**
 * 주소 검색 modal component
 */
export const OrderAddressModal = React.forwardRef<HTMLDivElement, Props>(
  ({ openAddressModal, loadAddressModule, onCloseModal: handleCloseModal }, ref) => {
    useLayoutEffect(() => {
      if (openAddressModal && ref) {
        setTimeout(loadAddressModule, 1000);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [openAddressModal]);

    return (
      <Modal
        title="주소검색"
        open={openAddressModal}
        children={
          <>
            <AddressWrapperStyled ref={ref} />
          </>
        }
        width="100%"
        height="100%"
        onClose={handleCloseModal}
      />
    );
  },
);

const AddressWrapperStyled = styled(Box)`
  width: 100%;
  height: 100%;
`;
