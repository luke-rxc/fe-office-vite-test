import { Modal } from '@components/Modal';
import { Box, Button } from '@material-ui/core';
import { BaseSyntheticEvent } from 'react';
import { FormProvider, UseFormReturn } from 'react-hook-form';
import { AnchorPointModalTypeLabel, ModalType } from '../constants';
import { ShowtimeAnchorPointFormField } from '../types';
import { AnchorPointForm, AnchorPointFormProps } from './AnchorPointForm';

interface Props extends AnchorPointFormProps {
  modalType: ModalType | undefined;
  formMethod: UseFormReturn<ShowtimeAnchorPointFormField>;
  showModal: boolean;
  onSubmit: (e?: BaseSyntheticEvent<object, any, any>) => Promise<void>;
  onClose: () => void;
}

export const AnchorPointModal = ({
  modalType,
  formMethod,
  showModal,
  goodsOptions,
  imageType,
  uploadImage,
  activeAnchorPoint,
  onSubmit: handleSubmit,
  onClose: handleClose,
}: Props) => {
  return (
    <Modal
      title={AnchorPointModalTypeLabel[modalType] ?? ''}
      minWidth="600px"
      maxHeight="1100px"
      open={showModal}
      onClose={handleClose}
    >
      <FormProvider {...formMethod}>
        <form>
          <AnchorPointForm
            goodsOptions={goodsOptions}
            imageType={imageType}
            uploadImage={uploadImage}
            modalType={modalType}
            activeAnchorPoint={activeAnchorPoint}
          />
          <Box display="flex" justifyContent="flex-end" alignContent="center" p={0} pr={3} pt={3}>
            <Button color="secondary" variant="contained" size="large" onClick={handleClose} sx={{ mr: '10px' }}>
              취소
            </Button>
            <Button color="primary" variant="contained" size="large" onClick={handleSubmit}>
              저장
            </Button>
          </Box>
        </form>
      </FormProvider>
    </Modal>
  );
};
