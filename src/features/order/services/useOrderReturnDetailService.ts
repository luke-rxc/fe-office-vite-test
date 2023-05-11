import { SiteType } from '@constants/site';
import { useAddress } from '@hooks/useAddress';
import { useClipboardCopy } from '@hooks/useClipboardCopy';
import { useDialog } from '@hooks/useDialog';
import useLoading from '@hooks/useLoading';
import { useMutation } from '@hooks/useMutation';
import { useSiteType } from '@hooks/useSiteType';
import { DialogType } from '@models/DialogModel';
import { ErrorModel } from '@utils/api/createAxios';
import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useQueryClient } from 'react-query';
import { useNavigate } from 'react-router';
import { postOrderReturnExportTicketCancelRequest, putOrderReturnInfo, putOrderReturnStatus } from '../apis';
import { OrderReturnQueryKeys, ReturnMethodType } from '../constants';
import { LogDomain } from '../constants/log';
import { useOrderDetailCommonQuery, useOrderLogQuery, useOrderReturnDetailQuery } from '../hooks';
import { toOrderReturnDetailFormField, toOrderReturnChangeInfoModel } from '../models';
import {
  OrderReturnDetailFormField,
  OrderReturnExportTicketCancelRequestParams,
  OrderReturnInfoRequestParams,
  OrderReturnStatusFormField,
  OrderReturnStatusRequestParams,
} from '../types';

interface Props {
  returnId: string;
}

export type ReturnTypeUseOrderReturnDetailService = ReturnType<typeof useOrderReturnDetailService>;

const formInitialValues: OrderReturnDetailFormField = {
  name: '',
  phone: '',
  postCode: '',
  address: '',
  addressDetail: '',
  returnMethod: ReturnMethodType.USER,
};

/**
 * 반품 상세 service
 */
export const useOrderReturnDetailService = ({ returnId }: Props) => {
  const [showAddressModal, setShowAddressModal] = useState<boolean>(false);
  const dialog = useDialog();
  const { showLoading, hideLoading } = useLoading();
  const copy = useClipboardCopy();
  const currentSiteType = useSiteType();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const formMethodReturnInfo = useForm<OrderReturnDetailFormField>({
    defaultValues: formInitialValues,
  });
  const formMethodReturnStatus = useForm<OrderReturnStatusFormField>({
    defaultValues: {
      returnStatus: '',
      shippingCost: '0',
    },
  });

  const { reset, handleSubmit, setValue } = formMethodReturnInfo;

  const { ref, show } = useAddress<HTMLDivElement>({
    callbackComplete: ({ code, addr }) => {
      setValue('postCode', code);
      setValue('address', addr);
      setShowAddressModal(false);
    },
  });

  /**
   * 에러 처리
   */
  const onError = (error: ErrorModel, errorMessage: string, isCallbackPrevious: boolean = true) => {
    dialog.open({
      type: DialogType.ALERT,
      content: `${errorMessage} 문제가 발생하였습니다\r\n(${error.data.message})`,
      onClose: () => {
        isCallbackPrevious && navigate('/return/list');
        dialog.close();
      },
    });
  };

  /**
   * 주문 반품상세 item
   */
  const { data: orderReturnDetail, isLoading: isLoadingOrderReturnDetail } = useOrderReturnDetailQuery(returnId, {
    onError: (error) => onError(error, '반품/교환 상세 조회중'),
  });

  /**
   * 주문 공통 item
   */
  const { data: orderDetailCommon, isLoading: isLoadingOrderDetailCommon } = useOrderDetailCommonQuery(
    orderReturnDetail?.orderId.toString(),
    {
      enabled: !!orderReturnDetail?.orderId,
      onError: (error) => onError(error, '주문공통 조회중'),
    },
  );

  /**
   * 주문 반품 처리로그 item
   */
  const { data: orderReturnLog, isLoading: isLoadingOrderReturnLog } = useOrderLogQuery(
    {
      orderId: orderReturnDetail?.orderId.toString(),
      logDomain: LogDomain.ORDER_RETURN,
      subId: returnId,
    },
    {
      enabled: !!orderReturnDetail?.orderId,
    },
  );

  /**
   * 티켓 처리로그 item
   */
  const { data: exportTicketLog, isLoading: isLoadingExportTicketLog } = useOrderLogQuery(
    {
      orderId: orderReturnDetail?.orderId.toString(),
      logDomain: LogDomain.ORDER_EXPORT,
      subId: orderReturnDetail?.exportTicketInfo?.exportId.toString(),
    },
    {
      enabled: !!orderReturnDetail?.orderId && !!orderReturnDetail?.exportTicketInfo?.exportId,
    },
  );

  const { mutateAsync: requestOrderReturnInfo, isLoading: isLoadingRequestOrderReturnInfo } = useMutation(
    (params: OrderReturnInfoRequestParams) => putOrderReturnInfo(params),
    {
      onError: (error) => onError(error, '회수정보 변경중', false),
    },
  );

  const { mutateAsync: requestOrderReturnStatus, isLoading: isLoadingRequestOrderReturnStatus } = useMutation(
    (params: OrderReturnStatusRequestParams) => putOrderReturnStatus(params),
    {
      onError: (error) => onError(error, `${orderReturnDetail?.type?.name || ''} 상태 변경중`, false),
    },
  );

  const {
    mutateAsync: requestOrderReturnExportTicketCancel,
    isLoading: isLoadingRequestOrderReturnExportTicketCancel,
  } = useMutation(
    (params: OrderReturnExportTicketCancelRequestParams) => postOrderReturnExportTicketCancelRequest(params),
    {
      onError: (error) => onError(error, `${orderReturnDetail?.type?.name || ''} 티켓 연동사 취소중`, false),
    },
  );

  useEffect(() => {
    if (orderReturnDetail) {
      reset(toOrderReturnDetailFormField(orderReturnDetail, formInitialValues));
      formMethodReturnStatus.reset({ returnStatus: orderReturnDetail.status.code });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reset, orderReturnDetail]);

  useEffect(() => {
    if (
      isLoadingOrderDetailCommon ||
      isLoadingOrderReturnDetail ||
      isLoadingOrderReturnLog ||
      isLoadingExportTicketLog ||
      isLoadingRequestOrderReturnInfo ||
      isLoadingRequestOrderReturnStatus ||
      isLoadingRequestOrderReturnExportTicketCancel
    ) {
      showLoading();
    } else {
      hideLoading();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    isLoadingOrderDetailCommon,
    isLoadingOrderReturnDetail,
    isLoadingOrderReturnLog,
    isLoadingExportTicketLog,
    isLoadingRequestOrderReturnInfo,
    isLoadingRequestOrderReturnStatus,
    isLoadingRequestOrderReturnExportTicketCancel,
  ]);

  /**
   * 회수정보 변경
   */
  const onConfirmReturnInfo = ({ returnMethod, ...returnSender }: OrderReturnDetailFormField) => {
    return async () => {
      dialog.close();
      const response = await requestOrderReturnInfo({
        returnId,
        returnMethod,
        returnSender,
      });
      const resultInfo = toOrderReturnChangeInfoModel(response);
      dialog.open({
        type: DialogType.ALERT,
        content: '회수정보가 변경되었습니다',
        onClose: () => {
          if (resultInfo.action === 'REFRESH') {
            queryClient.invalidateQueries(OrderReturnQueryKeys.detail(returnId));
          }
          dialog.close();
        },
      });
    };
  };

  /**
   * 상태 변경
   */
  const onConfirmReturnStatus = ({ returnStatus, shippingCost }: OrderReturnStatusFormField) => {
    return async () => {
      dialog.close();
      const response = await requestOrderReturnStatus({
        returnId,
        returnStatus,
        shippingCost: shippingCost ? Number(shippingCost) : 0,
      });
      const resultInfo = toOrderReturnChangeInfoModel(response);
      dialog.open({
        type: DialogType.ALERT,
        content: `${orderReturnDetail.type.name} 상태가 변경되었습니다`,
        onClose: () => {
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
          dialog.close();
        },
      });
    };
  };

  /**
   * 회수정보 submit
   */
  const handleSubmitReturnInfo = handleSubmit((values) => {
    dialog.open({
      type: DialogType.CONFIRM,
      title: '확인',
      content: '회수정보를 변경하시겠습니까?',
      onConfirm: onConfirmReturnInfo(values),
    });
  });

  /**
   * 추가 confirm message
   */
  const getAddedConfirmMessage = (returnStatus: string, currentReturnStatus: string) => {
    if (currentSiteType === SiteType.MANAGER) {
      return '';
    }

    if (returnStatus === 'APPROVE') {
      return `\r\n새로운 주문 번호가 확인되면 새로운 주문번호에 운송장 입력 후  상품을 출고해 주세요.`;
    }

    switch (currentReturnStatus) {
      case 'REQUEST':
        return `\r\n상품이 입고되면 검수 후 ${orderReturnDetail.type.name} 승인 혹은 거절해 주세요.`;
      default:
        return '';
    }
  };

  /**
   * 상태변경 submit
   */
  const handleSubmitReturnStatus = formMethodReturnStatus.handleSubmit((values) => {
    const addedConfirmMessage = getAddedConfirmMessage(values.returnStatus, orderReturnDetail.status.code);
    const addedMessage = orderReturnDetail.isCancelExportTicket
      ? `\r\n티켓 상품은 반품완료전 연동사에서 정상적으로 취소처리가 되었는지 확인하시기 바랍니다`
      : '';

    dialog.open({
      type: DialogType.CONFIRM,
      title: '확인',
      content: `${orderReturnDetail.type.name} 상태를 변경하시겠습니까?${addedConfirmMessage}${addedMessage}`,
      onConfirm: onConfirmReturnStatus(values),
    });
  });

  /**
   * address modal show
   */
  const handleClickShowAddressModal = () => {
    setShowAddressModal(true);
  };

  /**
   * address modal hide
   */
  const handleClickHideAddressModal = () => {
    setShowAddressModal(false);
  };

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

  /**
   * 반품 티켓 연동사 취소 처리
   */
  const handleConfirmExportTicketCancelTicket = useCallback(async () => {
    const {
      exportTicketInfo: { isPossibleCancelRequest, exportId },
    } = orderReturnDetail || { exportTicketInfo: { isPossibleCancelRequest: false, exportId: null } };
    if (!isPossibleCancelRequest || exportId === null) {
      dialog.close();
      return;
    }

    await requestOrderReturnExportTicketCancel({
      returnId,
      exportId: exportId.toString(),
    });

    dialog.open({
      type: DialogType.ALERT,
      content: `반품 티켓 연동사 취소처리 되었습니다`,
    });
  }, [dialog, orderReturnDetail, requestOrderReturnExportTicketCancel, returnId]);

  /**
   * 반품 티켓 연동사 취소 처리 확인
   */
  const handleClickExportTicketCancelTicket = () => {
    dialog.open({
      type: DialogType.CONFIRM,
      title: '확인',
      content: '반품 티켓 연동사 취소하시겠습니까?',
      onConfirm: () => handleConfirmExportTicketCancelTicket(),
    });
  };

  return {
    orderDetailCommon,
    orderReturnDetail,
    orderReturnLog,
    exportTicketLog,
    isLoading:
      isLoadingOrderDetailCommon || isLoadingOrderReturnDetail || isLoadingOrderReturnLog || isLoadingExportTicketLog,
    form: {
      formMethodReturnInfo,
      handleSubmitReturnInfo,
      formMethodReturnStatus,
      handleSubmitReturnStatus,
    },
    address: {
      showAddressModal,
      handleClickShowAddressModal,
      handleClickHideAddressModal,
      addressRef: ref,
      loadAddress: show,
    },
    isManager: currentSiteType === SiteType.MANAGER,
    handleClickCopyClipboard,
    handleClickExportTicketCancelTicket,
  };
};
