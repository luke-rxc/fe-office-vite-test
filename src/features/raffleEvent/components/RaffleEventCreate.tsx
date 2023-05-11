import { FormProvider } from 'react-hook-form';
import { ReturnTypeUseRaffleEventCreateService } from '../services';
import { RaffleEventCreateForm } from './RaffleEventCreateForm';
import { RaffleEventCreateModal } from './RaffleEventCreateModal';

type Props = Omit<ReturnTypeUseRaffleEventCreateService, 'handleOpenModal'>;

/**
 * 래플 이벤트 생성 component
 */
export const RaffleEventCreate = ({
  formMethod,
  formRef,
  isOpenModal,
  liveComboList,
  handleClickSubmit,
  handleClickCancel,
  handleSubmitCreateRaffleEvent,
}: Props) => {
  return (
    <RaffleEventCreateModal open={isOpenModal} onConfirm={handleClickSubmit} onCloseModal={handleClickCancel}>
      <FormProvider {...formMethod}>
        <form ref={formRef} onSubmit={handleSubmitCreateRaffleEvent}>
          <RaffleEventCreateForm liveComboList={liveComboList} />
        </form>
      </FormProvider>
    </RaffleEventCreateModal>
  );
};
