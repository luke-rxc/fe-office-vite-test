import { useDialog } from '@hooks/useDialog';
import { useMutation } from '@hooks/useMutation';
import { DialogType } from '@models/DialogModel';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import { putOrderReturnReject, putOrderReturnWithdraw } from '../apis';
import { ReturnRequestType, ReturnRequestTypeLabel } from '../constants';
import { toOrderReturnChangeInfoModel } from '../models';
import { OrderReturnActionFormField, OrderReturnActionRequestParams } from '../types';

export type ReturnTypeUseOrderReturnActionService = ReturnType<typeof useOrderReturnActionService>;

interface Props {
  returnId: string;
  typeName: string;
}

const defaultFormValues: OrderReturnActionFormField = {
  reason: '',
  reasonItem: '',
};

/**
 * 반품 action service
 */
export const useOrderReturnActionService = ({ returnId, typeName }: Props) => {
  const navigate = useNavigate();
  const dialog = useDialog();
  const [returnRequestType, setReturnRequestType] = useState<ReturnRequestType | null>(null);
  const [opened, setOpened] = useState<boolean>(false);
  const formMethod = useForm<OrderReturnActionFormField>({
    defaultValues: defaultFormValues,
  });

  const { mutateAsync: requestOrderReturnReject } = useMutation(
    (params: OrderReturnActionRequestParams) => putOrderReturnReject(params),
    {
      onError: (error) => {
        dialog.open({
          type: DialogType.ALERT,
          content: `${typeName}${ReturnRequestTypeLabel.REJECT} 처리중 문제가 발생하였습니다 (${error.data.message})`,
        });
      },
    },
  );

  const { mutateAsync: requestOrderReturnWithdraw } = useMutation(
    (params: OrderReturnActionRequestParams) => putOrderReturnWithdraw(params),
    {
      onError: (error) => {
        dialog.open({
          type: DialogType.ALERT,
          content: `${typeName}${ReturnRequestTypeLabel.WITHDRAW} 처리중 문제가 발생하였습니다 (${error.data.message})`,
        });
      },
    },
  );

  /**
   * 철회, 거부 submit
   */
  const handleSubmit = formMethod.handleSubmit((values) => {
    dialog.open({
      type: DialogType.CONFIRM,
      title: '확인',
      content: `${typeName}${ReturnRequestTypeLabel[returnRequestType]} 처리하시겠습니까?`,
      onConfirm: async () => {
        const actionFunc =
          returnRequestType === ReturnRequestType.REJECT ? requestOrderReturnReject : requestOrderReturnWithdraw;

        const response = await actionFunc({
          ...values,
          returnId,
        });

        const resultInfo = toOrderReturnChangeInfoModel(response);
        dialog.open({
          type: DialogType.ALERT,
          content: `${typeName}${ReturnRequestTypeLabel[returnRequestType]} 요청이 처리되었습니다.`,
          onClose: () => {
            setOpened(false);
            dialog.close();
            switch (resultInfo.action) {
              case 'ORDER_VIEW':
                navigate(resultInfo.orderId ? `/order/detail/${resultInfo.orderId}` : '/order/list');
                break;
              case 'REFRESH':
                if (resultInfo.exchangeOrderId) {
                  window.open(`/order/detail/${resultInfo.exchangeOrderId}`, '_blank');
                }

                if (resultInfo.refundId) {
                  window.open(`/refund/detail/${resultInfo.refundId}`, '_blank');
                }
                navigate(0);
            }
          },
        });
      },
    });
  });

  const handleOpenModal = (returnRequestType: ReturnRequestType) => {
    setReturnRequestType(returnRequestType);
    setOpened(true);
  };

  const handleCloseModal = () => {
    formMethod.reset(defaultFormValues);
    setReturnRequestType(null);
    setOpened(false);
  };

  return { returnRequest: { formMethod, opened, returnRequestType, handleSubmit, handleOpenModal, handleCloseModal } };
};
