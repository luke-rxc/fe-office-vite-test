import { useDialog } from '@hooks/useDialog';
import useLoading from '@hooks/useLoading';
import { useMutation } from '@hooks/useMutation';
import { DialogType } from '@models/DialogModel';
import { ErrorModel } from '@utils/api/createAxios';
import { useQueryClient } from 'react-query';
import { putOrderPaid, putOrderPreparingGoods, putChangeDirectShippingMethod, OrderParams } from '../apis';
import { OrderQueryKeys } from '../constants';

interface Props {
  orderId: string;
}

export type ReturnTypeUseOrderDetailActionService = ReturnType<typeof useOrderDetailActionService>;

/**
 * 주문 상세 action service
 */
export const useOrderDetailActionService = ({ orderId }: Props) => {
  const { open: dialogOpen, close: dialogClose } = useDialog();
  const { showLoading, hideLoading } = useLoading();
  const queryClient = useQueryClient();

  const onError = (error: ErrorModel, errorMessage: string) => {
    hideLoading();
    dialogOpen({
      content: `${errorMessage} 변경 처리중 문제가 발생하였습니다.\r\n(${error.data.message})`,
      type: DialogType.ALERT,
    });
  };

  const { mutateAsync: requestOrderPaid } = useMutation((orderId: string) => putOrderPaid(orderId), {
    onError: (error) => onError(error, `해당 주문의 상태를 '결제완료'로`),
  });

  const { mutateAsync: requestOrderPreparingGoods } = useMutation(
    (orderId: string) => putOrderPreparingGoods(orderId),
    {
      onError: (error) => onError(error, `해당 주문의 상태를 '상품준비'로`),
    },
  );

  const { mutateAsync: changeDirectShippingMethod } = useMutation(
    (params: OrderParams) => putChangeDirectShippingMethod(params),
    {
      onError: (error) => onError(error, `배송방법을 직접배송으로`),
    },
  );

  /**
   * 주문 공통 query cache invalidate
   */
  const updateOrderStatusForQueryData = () => {
    queryClient.invalidateQueries(OrderQueryKeys.detailCommon(orderId));
  };

  /**
   * 결제완료 상태 변경처리
   */
  const executeClickOrderPaid = async () => {
    showLoading();

    await requestOrderPaid(orderId);
    hideLoading();
    updateOrderStatusForQueryData();

    dialogOpen({
      type: DialogType.ALERT,
      title: '알림',
      content: `해당 주문의 상태가 '결제완료' 로 변경 되었습니다.`,
      onClose: () => {
        dialogClose();
      },
    });
  };

  /**
   * 상품준비 상태 변경처리
   */
  const executeClickOrderPreparingGoods = async () => {
    showLoading();

    await requestOrderPreparingGoods(orderId);
    hideLoading();
    updateOrderStatusForQueryData();

    dialogOpen({
      type: DialogType.ALERT,
      title: '알림',
      content: `해당 주문의 상태가 '상품준비' 로 변경 되었습니다.`,
      onClose: () => {
        dialogClose();
      },
    });
  };

  /**
   * 배송방법 직접배송으로 변경
   */
  const executeClickChangeDirectShippingMethod = async (itemId: string) => {
    showLoading();

    await changeDirectShippingMethod({
      orderId,
      itemId,
    });
    hideLoading();
    updateOrderStatusForQueryData();

    dialogOpen({
      type: DialogType.ALERT,
      title: '알림',
      content: `배송방법이 '직접배송'으로 변경 되었습니다.`,
      onClose: () => {
        dialogClose();
      },
    });
  };

  /**
   * 결제완료 click event
   */
  const handleClickOrderPaid = () => {
    dialogOpen({
      type: DialogType.CONFIRM,
      title: '확인',
      content: `해당 주문의 상태를 '결제완료'로 변경하시겠습니까?`,
      onConfirm: executeClickOrderPaid,
    });
  };

  /**
   * 상품준비 click event
   */
  const handleClickOrderPreparingGoods = () => {
    dialogOpen({
      type: DialogType.CONFIRM,
      title: '확인',
      content: `해당 주문의 상태를 '상품준비'로 변경하시겠습니까?`,
      onConfirm: executeClickOrderPreparingGoods,
    });
  };

  /**
   * 상품준비 click event
   */
  const handleClickChangeDirectShippingMethod = (itemId: string) => {
    return () => {
      dialogOpen({
        type: DialogType.CONFIRM,
        title: '확인',
        content: `배송방법을 '직접배송'으로 변경하시겠습니까?`,
        onConfirm: () => executeClickChangeDirectShippingMethod(itemId),
      });
    };
  };

  return {
    actions: {
      handleClickOrderPaid,
      handleClickOrderPreparingGoods,
      handleClickChangeDirectShippingMethod,
    },
  };
};
