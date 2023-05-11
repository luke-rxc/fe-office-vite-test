import { ReturnTypeUseOrderDeliveryModifyService } from '@features/order/services';
import { FormProvider } from 'react-hook-form';
import { ExportDeliveryInfoModifyForm } from './ExportDeliveryInfoModifyForm';
import { ExportDeliveryInfoModifyModal } from './ExportDeliveryInfoModifyModal';

type Props = Omit<ReturnTypeUseOrderDeliveryModifyService, 'handleOpenModal'>;

/**
 * 운송정보 수정 component
 */
export const ExportDeliveryInfoModify = ({
  formMethod,
  formRef,
  isOpenModal,
  deliveryCompanies,
  handleClickSubmit,
  handleCloseModal,
  handleSubmit,
}: Props) => {
  return (
    <ExportDeliveryInfoModifyModal
      open={isOpenModal}
      disabled={!formMethod.formState.isDirty}
      onConfirm={handleClickSubmit}
      onCloseModal={handleCloseModal}
    >
      <FormProvider {...formMethod}>
        <form ref={formRef} onSubmit={handleSubmit}>
          <ExportDeliveryInfoModifyForm deliveryCompanies={deliveryCompanies} />
        </form>
      </FormProvider>
    </ExportDeliveryInfoModifyModal>
  );
};
