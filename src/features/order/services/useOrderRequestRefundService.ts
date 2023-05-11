import { useDialog } from '@hooks/useDialog';
import { useMutation } from '@hooks/useMutation';
import { DialogType } from '@models/DialogModel';
import { ErrorModel, ErrorDataModel } from '@utils/api/createAxios';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useQueryClient } from 'react-query';
import { postOrderRefund, postOrderRefundByCase } from '../apis';
import { OrderCancelType, OrderCancelTypeConfirmLabel, OrderRefundQueryKeys } from '../constants';
import { useOrderRefundOptionQuery, useOrderRefundReasonQuery } from '../hooks';
import {
  OrderRefundAllRequestParams,
  OrderRefundCaseRequestItemOption,
  OrderRefundCaseRequestParams,
  OrderRequestRefundFormField,
} from '../types';

interface Props {
  orderId: string;
  onCloseModal: (refresh?: boolean) => void;
}

export type ReturnTypeOrderRequestRefundService = ReturnType<typeof useOrderRequestRefundService>;

/**
 * 주문 취소요청 service
 */
export const useOrderRequestRefundService = ({ orderId, onCloseModal }: Props) => {
  const dialog = useDialog();
  const [selectedRowKeys, setSelectedRowKeys] = useState<Array<string>>([]);
  const queryClient = useQueryClient();

  const formMethod = useForm<OrderRequestRefundFormField>({
    defaultValues: {
      cancelType: OrderCancelType.ALL,
      reasonCode: '',
      reason: '',
      ea: [],
      providers: [],
      selectedOption: null,
    },
  });

  const { clearErrors, setValue, handleSubmit, watch, setError } = formMethod;
  const cancelType = watch('cancelType');

  // 환불신청 가능한 주문 옵션
  const { data: refundItemOption, isLoading: isLoadingRefundItemOption } = useOrderRefundOptionQuery(orderId, {
    cacheTime: 0,
  });

  // 환불 사유 항목
  const { data: refundReasonItems, isLoading: isLoadingRefundReasonItems } = useOrderRefundReasonQuery();

  const refundError = (error: ErrorModel<ErrorDataModel>) => {
    dialog.open({
      content: `주문 취소처리중 문제가 발생하였습니다\r\n(${error.data.message})`,
      type: DialogType.ALERT,
    });
  };

  /**
   * 전체 주문 취소
   */
  const { mutateAsync: requestOrderRefund } = useMutation(
    (params: OrderRefundAllRequestParams) => postOrderRefund(params),
    {
      onError: refundError,
    },
  );

  /**
   * 부분(선택) 주문 취소
   */
  const { mutateAsync: requestOrderRefundByCase } = useMutation(
    (params: OrderRefundCaseRequestParams) => postOrderRefundByCase(params),
    {
      onError: refundError,
    },
  );

  useEffect(() => {
    if (refundItemOption && !refundItemOption.isFullRefundable) {
      setValue('cancelType', OrderCancelType.CASE);
    }
  }, [refundItemOption, setValue]);

  /**
   * key에 해당하는 item option 리턴
   */
  const getItemOption = (key: string) => {
    return refundItemOption.refundableItemOptionList.find((item) => item.key === key);
  };

  /**
   * key에 해당하는 item option index 리턴
   */
  const getItemOptionIndex = (key: string) => {
    return refundItemOption.refundableItemOptionList.findIndex((item) => item.key === key);
  };

  const getParams = ({
    reasonCode,
    reason,
    ea,
  }: OrderRequestRefundFormField): OrderRefundAllRequestParams | OrderRefundCaseRequestParams => {
    if (cancelType === OrderCancelType.ALL) {
      return {
        orderId,
        reasonCode,
        reason: reason ?? '',
      } as OrderRefundAllRequestParams;
    } else {
      const shippingId = getItemOption(selectedRowKeys[0]).shipping.id;
      return {
        orderId,
        reasonCode,
        shippingId,
        reason: reason ?? '',
        itemOptionList: selectedRowKeys.reduce<Array<OrderRefundCaseRequestItemOption>>((target, key) => {
          const { id, itemId } = getItemOption(key);
          const itemIndex = getItemOptionIndex(key);
          target.push({
            id,
            itemId,
            refundEa: ea[itemIndex] ? Number(ea[itemIndex]) : undefined,
          });
          return target;
        }, []),
      } as OrderRefundCaseRequestParams;
    }
  };

  /**
   * 주문 취소신청 완료 dialog 표시
   */
  const showCompleteMessage = () => {
    dialog.open({
      type: DialogType.ALERT,
      content: '주문 취소요청이 완료되었습니다',
      onClose: () => {
        dialog.close();
        onCloseModal(true);
      },
    });
  };

  /**
   * 취소 요청 submit
   */
  const onSubmit = handleSubmit(async (values) => {
    if (cancelType === OrderCancelType.CASE && selectedRowKeys.length === 0) {
      setError('selectedOption', { message: '옵션을 선택하세요' });
      return;
    }

    dialog.open({
      type: DialogType.CONFIRM,
      title: '확인',
      content: OrderCancelTypeConfirmLabel[cancelType],
      onConfirm: async () => {
        const params = getParams(values);

        if (cancelType === OrderCancelType.ALL) {
          await requestOrderRefund(params);
          showCompleteMessage();
        } else {
          await requestOrderRefundByCase(params as OrderRefundCaseRequestParams);
          showCompleteMessage();
        }

        queryClient.invalidateQueries(OrderRefundQueryKeys.refundOption(orderId));
      },
    });
  });

  /**
   * key에 해당되는 shippingId 리턴
   */
  const getShippingIdByKey = (key: string) => {
    return refundItemOption.refundableItemOptionList.find((item) => item.key === key).shipping.id;
  };

  /**
   * table row selection event
   */
  const handleChangeRowSelect = (selectedRowKeys: Array<string>, _, __, selectId) => {
    const selectProviderId = getShippingIdByKey(selectId);
    const filteredSelectedRowKeys = selectedRowKeys.reduce((target, key) => {
      const providerId = getShippingIdByKey(key);

      if (providerId === selectProviderId) {
        target.push(key);
      }

      return target;
    }, []);
    setSelectedRowKeys(filteredSelectedRowKeys);
    clearErrors('selectedOption');
  };

  /**
   * 입점사 상품 option 전체 선택
   */
  const handleClickSelectShippingGroupGoodsOption = (shippingId: number) => {
    return () => {
      setSelectedRowKeys(
        refundItemOption.refundableItemOptionList
          .filter((item) => item.shipping.id === shippingId)
          .map((item) => item.key),
      );
      clearErrors('selectedOption');
    };
  };

  return {
    form: {
      formMethod,
      handleSubmit: onSubmit,
    },
    refundItemOption,
    refundReasonItems,
    isLoading: isLoadingRefundItemOption || isLoadingRefundReasonItems,
    rowSelection:
      cancelType === OrderCancelType.CASE
        ? {
            selectedRowKeys,
            onChange: handleChangeRowSelect,
            rowSelectionColumnIndex: 2,
          }
        : undefined,
    handleClickSelectShippingGroupGoodsOption,
  };
};
