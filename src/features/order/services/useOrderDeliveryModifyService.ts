import { useDialog } from '@hooks/useDialog';
import { DialogType } from '@models/DialogModel';
import { useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { useQueryClient } from 'react-query';
import { OrderExportQueryKeys } from '../constants';
import { useModal, useOrderCommonDeliveryCompaniesQuery, useOrderExportDeliveryInfoModifyMutation } from '../hooks';
import { toOrderExportDeliveryInfoParams } from '../models';
import { OrderExportDeliveryInfoFormField, OrderExportDeliveryInfoParams } from '../types';

export type ReturnTypeUseOrderDeliveryModifyService = ReturnType<typeof useOrderDeliveryModifyService>;

interface Props {
  exportId: string;
  deliveryCompanyName: string;
  deliveryNumber: string;
}

/**
 * 운송정보 수정 service
 */
export const useOrderDeliveryModifyService = ({ exportId, deliveryCompanyName, deliveryNumber }: Props) => {
  const dialog = useDialog();
  const formRef = useRef<HTMLFormElement>();
  const { openModal: isOpenModal, handleOpenModal, handleCloseModal } = useModal();
  const queryClient = useQueryClient();

  const formMethod = useForm<OrderExportDeliveryInfoFormField>({
    defaultValues: {
      deliveryCompany: null,
      deliveryNumber,
    },
  });

  const { data: deliveryCompanies } = useOrderCommonDeliveryCompaniesQuery();

  const { mutateAsync: requestDeliveryInfoModify } = useOrderExportDeliveryInfoModifyMutation({
    onError: (error) => {
      dialog.open({
        type: DialogType.ALERT,
        content: `운송 정보를 변경중 문제가 발생하였습니다 (${error.data.message})`,
      });
    },
  });

  useEffect(() => {
    if (isOpenModal && deliveryCompanies) {
      const deliveryCompany = deliveryCompanies.find((item) => item.label === deliveryCompanyName);
      formMethod.reset({
        deliveryCompany,
        deliveryNumber,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deliveryCompanies, deliveryCompanyName, deliveryNumber, isOpenModal]);

  /**
   * 운송정보 변경 submit
   */
  const handleSubmit = formMethod.handleSubmit((values) => {
    dialog.open({
      type: DialogType.CONFIRM,
      title: '확인',
      content: `운송 정보를 변경하시겠습니까?`,
      onConfirm: async () => {
        const params: OrderExportDeliveryInfoParams = toOrderExportDeliveryInfoParams(values, exportId);
        await requestDeliveryInfoModify(params);

        dialog.open({
          type: DialogType.ALERT,
          content: `운송 정보가 변경되었습니다.`,
          onClose: () => {
            queryClient.invalidateQueries(OrderExportQueryKeys.detail(exportId));
            handleCloseModal();
            dialog.close();
          },
        });
      },
    });
  });

  /**
   * 운송정보 변경 click
   */
  const handleClickSubmit = () => {
    if (formRef.current) {
      formRef.current.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
    }
  };

  return {
    isOpenModal,
    formMethod,
    formRef,
    deliveryCompanies,
    handleOpenModal,
    handleCloseModal,
    handleSubmit,
    handleClickSubmit,
  };
};
