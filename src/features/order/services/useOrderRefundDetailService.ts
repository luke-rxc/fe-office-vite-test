import { SiteType } from '@constants/site';
import { useClipboardCopy } from '@hooks/useClipboardCopy';
import { useDialog } from '@hooks/useDialog';
import useLoading from '@hooks/useLoading';
import { useMutation } from '@hooks/useMutation';
import { useSiteType } from '@hooks/useSiteType';
import { DialogType } from '@models/DialogModel';
import { ErrorModel } from '@utils/api/createAxios';
import isEqual from 'lodash/isEqual';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { useQueryClient } from 'react-query';
import { useNavigate } from 'react-router';
import { getRefundPrice, putRefundBankInfo, putRefundStatus } from '../apis';
import { OrderRefundQueryKeys } from '../constants';
import { LogDomain } from '../constants/log';
import {
  useOrderCommonBankComboQuery,
  useOrderDetailCommonQuery,
  useOrderLogQuery,
  useOrderRefundDetailQuery,
  useOrderRefundPriceInfoQuery,
} from '../hooks';
import { toOrderRefundBankInfoModel, toOrderRefundStatusModel } from '../models';
import { OrderRefundPriceInfoSchema } from '../schemas';
import {
  OrderRefundAccountFormField,
  OrderRefundBankInfoRequestParams,
  OrderRefundPriceFormField,
  OrderRefundPriceRequestParams,
  OrderRefundShippingCostItem,
  OrderRefundStatusRequestParams,
} from '../types';

interface Props {
  refundId: string;
  getRefundStatusConfirmMessage: (refundStatusText: string, params: OrderRefundStatusRequestParams) => JSX.Element;
}

export type ReturnTypeUseOrderRefundDetailService = ReturnType<typeof useOrderRefundDetailService>;

/**
 * 환불 상세 service
 */
export const useOrderRefundDetailService = ({ refundId, getRefundStatusConfirmMessage }: Props) => {
  const dialog = useDialog();
  const copy = useClipboardCopy();
  const { showLoading, hideLoading } = useLoading();
  const currentSiteType = useSiteType();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // 사용자 계좌정보 관련 form field
  const refundAccountFormField = useForm<OrderRefundAccountFormField>({
    defaultValues: {
      account: '',
      bankCode: '',
      depositor: '',
    },
  });

  // 환불 처리 관련 form field
  const refundPriceFormField = useForm<OrderRefundPriceFormField>({
    defaultValues: {
      shippingCostList: [],
      refundMethod: '',
      refundStatus: '',
    },
  });

  /**
   * 에러 처리
   */
  const onError = (error: ErrorModel, targetName: string, isCallbackPrevious: boolean = true) => {
    dialog.open({
      type: DialogType.ALERT,
      content: `${targetName} 문제가 발생하였습니다\r\n(${error.data.message})`,
      onClose: () => {
        isCallbackPrevious && navigate('/refund/list');
        dialog.close();
      },
    });
  };

  /**
   * 주문 환불상세 item
   */
  const { data: orderRefundDetail, isLoading: isLoadingOrderRefundDetail } = useOrderRefundDetailQuery(refundId, {
    onError: (error) => onError(error, '환불상세 조회중'),
  });

  /**
   * 주문 공통 item
   */
  const { data: orderDetailCommon, isLoading: isLoadingOrderDetailCommon } = useOrderDetailCommonQuery(
    orderRefundDetail?.orderId.toString(),
    {
      enabled: !!orderRefundDetail?.orderId,
      onError: (error) => onError(error, '주문공통 조회중'),
    },
  );

  /**
   * 주문 환불 처리로그 item
   */
  const { data: orderRefundLog, isLoading: isLoadingOrderRefundLog } = useOrderLogQuery(
    {
      orderId: orderRefundDetail?.orderId.toString(),
      logDomain: LogDomain.ORDER_REFUND,
      subId: refundId,
    },
    {
      enabled: !!orderRefundDetail?.orderId,
    },
  );

  // 은행코드 combo
  const { data: bankCodes, isLoading: isLoadingBankCodes } = useOrderCommonBankComboQuery({
    enabled: !!orderRefundDetail,
  });

  // 환불처리 금액정보
  const { data: orderRefundPriceInfo, isLoading: isLoadingOrderRefundPriceInfo } = useOrderRefundPriceInfoQuery(
    refundId,
    {
      enabled: !!orderRefundDetail,
    },
  );

  const { mutateAsync: requestRefundBankInfo, isLoading: isLoadingRequestRefundBankInfo } = useMutation(
    (params: OrderRefundBankInfoRequestParams) => putRefundBankInfo(params),
    {
      onError: (error) => onError(error, '계좌정보 변경중', false),
    },
  );

  const { mutateAsync: requestRefundPrice } = useMutation(
    (params: OrderRefundPriceRequestParams) => getRefundPrice(params),
    {
      onError: (error) => onError(error, '환불금액 재계산중', false),
    },
  );

  const { mutateAsync: requestRefundStatus, isLoading: isLoadingRequestRefundStatus } = useMutation(
    (params: OrderRefundStatusRequestParams) => putRefundStatus(params),
    {
      onError: (error) => onError(error, '환불상태 변경중', false),
    },
  );

  useEffect(() => {
    if (orderRefundDetail) {
      const { account, bank, depositor } = orderRefundDetail.refundBankInfo || {};
      refundAccountFormField.reset({
        account: account || '',
        bankCode: bank?.value || '',
        depositor: depositor || '',
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderRefundDetail]);

  useEffect(() => {
    if (!orderRefundDetail || !orderRefundPriceInfo) {
      return;
    }
    const {
      type: { code },
    } = orderRefundDetail;

    const shippingCostList =
      code === 'return'
        ? orderRefundPriceInfo.refundItemOptionList
            .filter((item) => !!item.shippingRowspan)
            .map((item) => item.shippingCost.toString())
        : [];

    refundPriceFormField.reset({
      shippingCostList,
      refundMethod: orderRefundPriceInfo.refundMethod,
      refundStatus: orderRefundPriceInfo.refundStatusInfo.refundStatus,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderRefundDetail, orderRefundPriceInfo]);

  useEffect(() => {
    if (
      isLoadingOrderDetailCommon ||
      isLoadingOrderRefundDetail ||
      isLoadingOrderRefundLog ||
      isLoadingBankCodes ||
      isLoadingOrderRefundPriceInfo ||
      isLoadingRequestRefundBankInfo ||
      isLoadingRequestRefundStatus
    ) {
      showLoading();
    } else {
      hideLoading();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    isLoadingOrderDetailCommon,
    isLoadingOrderRefundDetail,
    isLoadingOrderRefundLog,
    isLoadingBankCodes,
    isLoadingOrderRefundPriceInfo,
    isLoadingRequestRefundBankInfo,
    isLoadingRequestRefundStatus,
  ]);

  /**
   * 계좌정보 변경처리
   */
  const onConfirmBankInfo = async (values: OrderRefundAccountFormField) => {
    dialog.close();
    const response = await requestRefundBankInfo({
      ...values,
      refundId,
    });

    const updateBankInfo = toOrderRefundBankInfoModel(response);
    const updateRefundDetail = {
      ...orderRefundDetail,
      ...updateBankInfo,
    };
    queryClient.setQueryData(OrderRefundQueryKeys.detail(refundId), updateRefundDetail);

    dialog.open({
      type: DialogType.ALERT,
      content: '계좌정보가 변경되었습니다.',
      onClose: () => {
        dialog.close();
      },
    });
  };

  /**
   * 계좌정보 변경 submit
   */
  const handleSubmitRefundAccount = refundAccountFormField.handleSubmit((values) => {
    const { account, bank, depositor } = orderRefundDetail.refundBankInfo || {};
    const userBankInfo = { account, bankCode: bank?.value, depositor };

    if (orderRefundDetail.refundBankInfo && isEqual(values, userBankInfo)) {
      dialog.open({
        type: DialogType.ALERT,
        content: '기존 환불 계좌정보와 동일합니다.',
      });
      return;
    }

    dialog.open({
      type: DialogType.CONFIRM,
      title: '확인',
      content: '계좌정보를 변경하시겠습니까?',
      onConfirm: () => onConfirmBankInfo(values),
    });
  });

  /**
   * 환불 item option 조회
   */
  const getRefundItemOption = (itemIndex: number) => {
    return orderRefundPriceInfo.refundItemOptionList.find((item) => item.shippingIndex === itemIndex);
  };

  /**
   * 환불 배송비 리스트 리턴
   */
  const getRefundShippingCostList = (shippingCostList: Array<string>): Array<OrderRefundShippingCostItem> => {
    if (orderRefundDetail.type.code !== 'return') {
      const refundShippingCostList = orderRefundPriceInfo.refundItemOptionList.map(
        ({ provider: { id: providerId }, shippingCost, shippingId }) => {
          return {
            providerId,
            refundShippingCost: Number(shippingCost),
            shippingId,
          };
        },
      );
      // 환불 배송비 리스트 리턴시 shippingId가 중복되지 않도록 필터링 처리
      return refundShippingCostList.reduce<Array<OrderRefundShippingCostItem>>((target, item) => {
        if (!target.some((targetItem: OrderRefundShippingCostItem) => targetItem.shippingId === item.shippingId)) {
          target.push(item);
        }
        return target;
      }, [] as Array<OrderRefundShippingCostItem>);
    }

    return shippingCostList.map((shippingCost, index) => {
      const {
        provider: { id: providerId },
        shippingId,
      } = getRefundItemOption(index);
      return {
        providerId,
        refundShippingCost: Number(shippingCost),
        shippingId,
      };
    });
  };

  const onConfirmRefundStatus = async (params: OrderRefundStatusRequestParams) => {
    dialog.close();
    const response = await requestRefundStatus(params);
    const resultMessage = toOrderRefundStatusModel(response).resultMessage;

    dialog.open({
      type: DialogType.ALERT,
      content: resultMessage,
      onClose: () => {
        dialog.close();
        navigate(0);
      },
    });
  };

  /**
   * 환불 상태 변경 submit
   */
  const handleSubmitRefundPrice = refundPriceFormField.handleSubmit((values) => {
    const { refundStatus, refundMethod, shippingCostList } = values;
    const {
      refundStatusInfo: { refundStatus: prevRefundStatus },
      changeableStatusList,
    } = orderRefundPriceInfo;
    if (refundStatus === prevRefundStatus) {
      refundPriceFormField.setError('refundStatus', { message: '기존 환불상태와 동일합니다' });
      return;
    }

    const refundStatusText = changeableStatusList.find((item) => item.value === refundStatus).label ?? '';
    const params: OrderRefundStatusRequestParams = {
      refundId,
      refundMethod,
      refundStatus,
      refundPrice: orderRefundPriceInfo.refundPrice.toString(),
      refundPoint: orderRefundPriceInfo.refundPoint.toString(),
      refundShippingCostList: getRefundShippingCostList(shippingCostList),
    };

    dialog.open({
      type: DialogType.CONFIRM,
      title: '확인',
      content: getRefundStatusConfirmMessage(refundStatusText, params),
      onConfirm: () => onConfirmRefundStatus(params),
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

  /**
   * 사용자 환불정보 복사
   */
  const handleClickCopyUserRefundAccount = () => {
    const {
      userRefundAccount: {
        account,
        bank: { value: bankCode },
        depositor,
      },
    } = orderRefundDetail;
    refundAccountFormField.reset({
      account,
      bankCode,
      depositor,
    });
  };

  /**
   * 환불배송비 변경시 환불금액 재계산 처리
   */
  const handleChangeShippingCost = async () => {
    const values = refundPriceFormField.getValues();
    const params: OrderRefundPriceRequestParams = {
      refundId,
      refundMethod: values.refundMethod,
      refundShippingCostList: values.shippingCostList.map((shippingCost, index) => {
        const {
          provider: { id: providerId },
          shippingId,
        } = getRefundItemOption(index);
        return {
          providerId,
          refundShippingCost: Number(shippingCost),
          shippingId,
        };
      }),
    };
    const response = await requestRefundPrice(params);
    const {
      refundMethod,
      refundableMethods,
      refundPoint,
      refundPrice,
      totalUsedCouponPrice,
      totalRefundGoodsPrice,
      totalRefundShippingCost,
    } = response;

    queryClient.setQueryData<OrderRefundPriceInfoSchema>(OrderRefundQueryKeys.priceInfo(refundId), (previous) => {
      const refundItemOptionList = previous.refundItemOptionList.map((item) => {
        const targetRefundShippingCost = params.refundShippingCostList.find(
          (refundShippingCost) => refundShippingCost.shippingId === item.shippingId,
        );

        if (targetRefundShippingCost) {
          const shippingCost = targetRefundShippingCost.refundShippingCost;
          return {
            ...item,
            shippingCost: Number(shippingCost),
          };
        }
        return item;
      });

      return {
        ...previous,
        refundItemOptionList,
        refundMethod,
        refundPoint,
        refundPrice,
        refundableMethods,
        totalUsedCouponPrice,
        totalRefundGoodsPrice,
        totalRefundShippingCost,
      };
    });
  };

  return {
    orderDetailCommon,
    orderRefundDetail,
    orderRefundLog,
    bankCodes,
    orderRefundPriceInfo,
    isLoading:
      isLoadingOrderDetailCommon ||
      isLoadingOrderRefundDetail ||
      isLoadingOrderRefundLog ||
      isLoadingOrderRefundPriceInfo,
    form: {
      refundAccountFormField,
      refundPriceFormField,
      handleSubmitRefundAccount,
      handleSubmitRefundPrice,
      handleChangeShippingCost,
    },
    isManager: currentSiteType === SiteType.MANAGER,
    handleClickCopyClipboard,
    handleClickCopyUserRefundAccount,
  };
};
