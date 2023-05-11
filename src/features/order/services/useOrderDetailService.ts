import { SiteType } from '@constants/site';
import { useClipboardCopy } from '@hooks/useClipboardCopy';
import { useDialog } from '@hooks/useDialog';
import useLoading from '@hooks/useLoading';
import { useMutation } from '@hooks/useMutation';
import { useSiteType } from '@hooks/useSiteType';
import { DialogType } from '@models/DialogModel';
import { ErrorModel } from '@utils/api/createAxios';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useQueryClient } from 'react-query';
import { useNavigate } from 'react-router';
import { OrderDetailRecipientRequestParams, putOrderDelivery } from '../apis';
import { LogDomain, OrderQueryKeys } from '../constants';
import { useOrderDetailCommonQuery, useOrderDetailQuery, useOrderLogQuery } from '../hooks';
import { toOrderDetailRecipientFormField } from '../models';
import { OrderDetailRecipientFormField } from '../types';

interface Props {
  orderId: string;
}

export type ReturnTypeUseOrderDetailService = ReturnType<typeof useOrderDetailService>;

const formInitialValues: OrderDetailRecipientFormField = {
  name: '',
  phone: '',
  postCode: '',
  address: '',
  addressDetail: '',
  deliveryRequestMessage: '',
  pcccNumber: '',
};

export const useOrderDetailService = ({ orderId }: Props) => {
  const navigate = useNavigate();
  const dialog = useDialog();
  const { showLoading, hideLoading } = useLoading();
  const queryClient = useQueryClient();
  const copy = useClipboardCopy();
  const currentSiteType = useSiteType();

  const formMethodForRecipient = useForm<OrderDetailRecipientFormField>({
    defaultValues: formInitialValues,
  });

  const { reset, handleSubmit, setValue } = formMethodForRecipient;

  const onError = (error: ErrorModel, errorMessage: string) => {
    dialog.open({
      type: DialogType.ALERT,
      title: '에러',
      content: `${errorMessage}\r\n(${error.data.message})`,
      onClose: () => {
        dialog.close();
        navigate('/order/list');
      },
    });
  };

  /**
   * 주문 공통 item
   */
  const {
    data: orderDetailCommon,
    isLoading: isLoadingOrderDetailCommon,
    isError: isErrorOrderDetailCommon,
  } = useOrderDetailCommonQuery(orderId, {
    onError: (error) => onError(error, '주문공통 조회중 문제가 발생하였습니다'),
  });

  /**
   * 주문 상세 item
   */
  const {
    data: orderDetail,
    isLoading: isLoadingOrderDetail,
    isError: isErrorOrderDetail,
  } = useOrderDetailQuery(orderId, {
    onError: (error) => onError(error, '주문상세 조회중 문제가 발생하였습니다'),
  });

  /**
   * 주문 처리로그 item
   */
  const {
    data: orderLog,
    isLoading: isLoadingOrderLog,
    isError: isErrorOrderLog,
  } = useOrderLogQuery({
    orderId,
    logDomain: LogDomain.ORDER,
  });

  /**
   * 배송지 변경요청
   */
  const { mutateAsync: updateOrderDelivery } = useMutation(
    (params: OrderDetailRecipientRequestParams) => putOrderDelivery(orderId, params),
    {
      onError: (error) => {
        hideLoading();

        onError(error, '배송지 변경요청에 문제가 발생하였습니다.');
      },
    },
  );

  useEffect(() => {
    if (orderDetail) {
      reset(toOrderDetailRecipientFormField(orderDetail.recipient, formInitialValues));
    }
  }, [reset, orderDetail]);

  /**
   * 받는 정보 submit
   */
  const handleSubmitRecipient = handleSubmit((values) => {
    dialog.open({
      type: DialogType.CONFIRM,
      title: '확인',
      content: '배송지 정보를 수정하시겠습니까?',
      onConfirm: async () => {
        showLoading();
        await updateOrderDelivery(values);
        hideLoading();
        dialog.open({
          title: '알림',
          content: '배송지 정보가 변경되었습니다.',
          type: DialogType.ALERT,
          onClose: () => {
            queryClient.invalidateQueries(OrderQueryKeys.detailCommon(orderId));
            dialog.close();
          },
        });
      },
    });
  });

  const handleClickCopyClipboard = (value: string) => {
    copy(value, {
      onSuccess: () => {
        toast.success('복사가 완료되었습니다.');
      },
      onError: () => {
        toast.error('복사 도중 문제가 발생하였습니다.');
      },
    });
  };

  const handleUpdateAddress = (postCode: string, address: string) => {
    setValue('postCode', postCode);
    setValue('address', address);
  };

  const handleRefreshOrderDetail = () => {
    queryClient.invalidateQueries(OrderQueryKeys.details(orderId));
  };

  return {
    orderDetailCommon,
    orderDetail,
    orderLog,
    isError: isErrorOrderDetailCommon || isErrorOrderDetail || isErrorOrderLog,
    isLoading: isLoadingOrderDetailCommon || isLoadingOrderDetail || isLoadingOrderLog,
    form: {
      formMethodForRecipient,
      handleSubmitRecipient,
    },
    isManager: currentSiteType === SiteType.MANAGER,
    handleClickCopyClipboard,
    handleUpdateAddress,
    handleRefreshOrderDetail,
  };
};
