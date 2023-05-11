import { useDialog } from '@hooks/useDialog';
import { useMutation } from '@hooks/useMutation';
import { DialogType } from '@models/DialogModel';
import { ErrorDataModel, ErrorModel } from '@utils/api/createAxios';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useQueryClient } from 'react-query';
import { postOrderReturn } from '../apis';
import { OrderReturnQueryKeys, ReturnMethodType } from '../constants';
import { useOrderRefundReasonQuery, useOrderReturnOptionQuery, useOrderReturnReasonQuery } from '../hooks';
import { toOrderRequestReturnFormField } from '../models';
import { OrderRequestReturnFormField, OrderReturnRequestItemOption, OrderReturnRequestParams } from '../types';

interface Props {
  orderId: string;
  onCloseModal: (refresh?: boolean) => void;
}

export type ReturnTypeUseOrderRequestReturnService = ReturnType<typeof useOrderRequestReturnService>;

const initialFormValues: OrderRequestReturnFormField = {
  returnSender: {
    name: '',
    phone: '',
    postCode: '',
    address: '',
    addressDetail: '',
  },
  returnMethod: ReturnMethodType.USER,
  reasonCode: '',
  reason: '',
  ea: [],
  selectedOption: null,
};

/**
 * 주문 반품요청 service
 */
export const useOrderRequestReturnService = ({ orderId, onCloseModal }: Props) => {
  const queryClient = useQueryClient();
  const dialog = useDialog();
  const [selectedRowKeys, setSelectedRowKeys] = useState<Array<string>>([]);
  const formMethod = useForm<OrderRequestReturnFormField>({
    defaultValues: initialFormValues,
  });

  const { handleSubmit, setValue, reset, setError, clearErrors } = formMethod;

  // 반품신청가능 주문 option
  const { data: returnItemOption, isLoading: isLoadingReturnItemOption } = useOrderReturnOptionQuery(orderId, {
    cacheTime: 0,
  });

  // 반품 사유 항목
  const { data: returnReasonItems, isLoading: isLoadingReturnReasonItems } = useOrderReturnReasonQuery({
    enabled: !!returnItemOption && !returnItemOption?.isCancelExportTicket,
  });

  // 환불 사유 항목
  const { data: refundReasonItems, isLoading: isLoadingRefundReasonItems } = useOrderRefundReasonQuery({
    enabled: !!returnItemOption && returnItemOption?.isCancelExportTicket,
  });

  const { mutateAsync: requestOrderReturn } = useMutation(
    (params: OrderReturnRequestParams) => postOrderReturn(params),
    {
      onError: (error: ErrorModel<ErrorDataModel>) => {
        dialog.open({
          content: `주문 반품처리중 문제가 발생하였습니다\r\n(${error.data.message})`,
          type: DialogType.ALERT,
        });
      },
    },
  );

  /**
   * key에 해당하는 item option 리턴
   */
  const getItemOption = useCallback(
    (key: string) => {
      return returnItemOption.returnableItemOptionList.find((item) => item.rowKey === key);
    },
    [returnItemOption],
  );

  /**
   * key에 해당하는 item option index 리턴
   */
  const getItemOptionIndex = (key: string) => {
    return returnItemOption.returnableItemOptionList.findIndex((item) => item.rowKey === key);
  };

  /**
   * 선택한 상품옵션의 자동회수접수 가능여부
   */
  const isAutoReturnable = useMemo(() => {
    if (!returnItemOption || selectedRowKeys.length === 0) {
      return true;
    }

    return getItemOption(selectedRowKeys[0]).isAutoReturnable;
  }, [returnItemOption, selectedRowKeys, getItemOption]);

  useEffect(() => {
    if (!isAutoReturnable) {
      setValue('returnMethod', ReturnMethodType.USER);
    }
  }, [isAutoReturnable, setValue]);

  useEffect(() => {
    if (!returnItemOption) {
      return;
    }

    reset(toOrderRequestReturnFormField(returnItemOption.returnSender, initialFormValues));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [returnItemOption]);

  const getParams = (values: OrderRequestReturnFormField): OrderReturnRequestParams => {
    const { reason, reasonCode, ea, returnMethod, returnSender } = values;

    const exportId = getItemOption(selectedRowKeys[0]).exportId;
    const isCancelExportTicket = returnItemOption.isCancelExportTicket;

    return {
      orderId,
      exportId,
      returnMethod,
      returnSender: isCancelExportTicket ? null : returnSender,
      reason,
      reasonCode,
      itemOptionList: selectedRowKeys.reduce<Array<OrderReturnRequestItemOption>>((target, key) => {
        const { id, itemId } = getItemOption(key);
        const itemIndex = getItemOptionIndex(key);

        target.push({
          id,
          itemId,
          returnEa: ea[itemIndex] ? Number(ea[itemIndex]) : undefined,
        });

        return target;
      }, []),
    };
  };

  /**
   * 반품 요청 submit
   */
  const onSubmit = handleSubmit(async (values) => {
    if (selectedRowKeys.length === 0) {
      setError('selectedOption', { message: '옵션을 선택하세요' });
      return;
    }

    dialog.open({
      type: DialogType.CONFIRM,
      title: '확인',
      content: '선택한 주문의 반품을 요청하시겠습니까?',
      onConfirm: async () => {
        const params: OrderReturnRequestParams = getParams(values);

        await requestOrderReturn(params);
        dialog.open({
          type: DialogType.ALERT,
          content: '주문 반품요청이 완료되었습니다',
          onClose: () => {
            queryClient.invalidateQueries(OrderReturnQueryKeys.returnOption(orderId));
            dialog.close();
            onCloseModal(true);
          },
        });
      },
    });
  });

  /**
   * key에 해당되는 export id 리턴
   */
  const getExportIdByKey = (key: string) => {
    return returnItemOption.returnableItemOptionList.find((item) => item.rowKey === key).exportId;
  };

  /**
   * table row selection event
   */
  const handleChangeRowSelect = (selectedRowKeys: Array<string>, _, __, selectId) => {
    const selectExportId = getExportIdByKey(selectId);
    const filteredSelectedRowKeys = selectedRowKeys.reduce((target, key) => {
      const providerId = getExportIdByKey(key);

      if (providerId === selectExportId) {
        target.push(key);
      }

      return target;
    }, []);
    setSelectedRowKeys(filteredSelectedRowKeys);
    clearErrors('selectedOption');
  };

  /**
   * 출고그룹 상품 option 전체 선택
   */
  const handleClickSelectShippingGroupGoodsOption = (exportId: number) => {
    return () => {
      const filteredSelectedRowKeys = returnItemOption.returnableItemOptionList
        .filter((item) => item.exportId === exportId)
        .map((item) => item.rowKey);
      setSelectedRowKeys(filteredSelectedRowKeys);
      clearErrors('selectedOption');
    };
  };

  /**
   * 주소 업데이트
   */
  const handleUpdateAddress = (postCode: string, address: string) => {
    setValue('returnSender.postCode', postCode);
    setValue('returnSender.address', address);
  };

  return {
    form: {
      formMethod,
      handleSubmit: onSubmit,
    },
    returnItemOption,
    reasonItems: returnReasonItems || refundReasonItems,
    isAutoReturnable,
    isLoading: isLoadingReturnReasonItems || isLoadingRefundReasonItems || isLoadingReturnItemOption,
    rowSelection: {
      selectedRowKeys,
      onChange: handleChangeRowSelect,
      rowSelectionColumnIndex: 2,
    },
    handleClickSelectShippingGroupGoodsOption,
    handleUpdateAddress,
  };
};
