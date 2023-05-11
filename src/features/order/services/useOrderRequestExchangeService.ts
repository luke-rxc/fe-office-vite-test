import { TOption } from '@components/Select';
import { useDialog } from '@hooks/useDialog';
import { useMutation } from '@hooks/useMutation';
import { DialogType } from '@models/DialogModel';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { useQueryClient } from 'react-query';
import { postOrderExchange } from '../apis';
import { OrderExchangeQueryKeys, ReturnMethodType } from '../constants';
import { useOrderExchangeOptionQuery, useOrderReturnReasonQuery } from '../hooks';
import { toOrderRequestExchangeFormField } from '../models';
import {
  ExchangeOption,
  OrderExchangeGoodsOption,
  OrderExchangeRequestParams,
  OrderRequestExchangeFormField,
} from '../types';

interface Props {
  orderId: string;
  onCloseModal: (refresh?: boolean) => void;
}

export type ReturnTypeUseOrderRequestExchangeService = ReturnType<typeof useOrderRequestExchangeService>;

const initialFormValues: OrderRequestExchangeFormField = {
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
  selectedOption: null,
  options: [] as Array<ExchangeOption>,
};

/**
 * 주문 교환요청 service
 */
export const useOrderRequestExchangeService = ({ orderId, onCloseModal }: Props) => {
  const dialog = useDialog();
  const queryClient = useQueryClient();

  const [selectedRowKeys, setSelectedRowKeys] = useState<Array<string>>([]);
  /**
   * 선택한 option의 count 정보
   */
  const [selectedOptionCountInfo, setSelectedOptionCountInfo] = useState<Record<number, number>>({});

  const formMethod = useForm<OrderRequestExchangeFormField>({
    defaultValues: initialFormValues,
  });

  const { handleSubmit, getValues, setValue, reset, setError, clearErrors, watch, control } = formMethod;
  const { insert, remove, update } = useFieldArray({ name: 'options', control });
  const optionItems = watch('options');

  /**
   * option 수량 체크
   */
  useEffect(() => {
    const OptionCountList = optionItems.reduce((target, optionChild, index) => {
      const { optionItemIds, optionItemEaList } = optionChild;
      optionItemIds.map((option, childIndex) => {
        if (!option) {
          return null;
        }

        const targetOption = target[option];
        if (!!targetOption) {
          target[option] = targetOption + optionItemEaList[childIndex];
          target['total'] = (target['total'] || 0) + optionItemEaList[childIndex];
          target['totalIds'] = (target['totalIds'] || 0) + Number(option);
          return null;
        }

        target[option] = optionItemEaList[childIndex];
        target['total'] = (target['total'] || 0) + optionItemEaList[childIndex];
        target['totalIds'] = (target['totalIds'] || 0) + Number(option);

        return null;
      });
      return target;
    }, {} as Record<string, number>);

    if (
      OptionCountList['total'] !== selectedOptionCountInfo['total'] ||
      OptionCountList['totalIds'] !== selectedOptionCountInfo['totalIds']
    ) {
      setSelectedOptionCountInfo(OptionCountList);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [optionItems]);

  const { data: exchangeItemOption, isLoading: isLoadingExchangeItemOption } = useOrderExchangeOptionQuery(orderId, {
    cacheTime: 0,
  });

  // 반품 사유 항목
  const { data: returnReasonItems, isLoading: isLoadingReturnReasonItems } = useOrderReturnReasonQuery();

  const { mutateAsync: requestOrderExchange } = useMutation(
    (params: OrderExchangeRequestParams) => postOrderExchange(params),
    {
      onError: (error) => {
        dialog.open({
          type: DialogType.ALERT,
          content: `교환요청 처리중 문제가 발생하였습니다 (${error.data.message})`,
        });
      },
    },
  );

  /**
   * 선택한 상품옵션의 자동회수접수 가능여부
   */
  const isAutoReturnable = useMemo(() => {
    if (!exchangeItemOption || selectedRowKeys.length === 0) {
      return true;
    }

    return exchangeItemOption.exchangeableItemOptionList.find((item) => item.rowKey === selectedRowKeys[0])
      .isAutoReturnable;
  }, [selectedRowKeys, exchangeItemOption]);

  useEffect(() => {
    if (!exchangeItemOption) {
      return;
    }

    reset(toOrderRequestExchangeFormField(exchangeItemOption.returnSender, initialFormValues));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exchangeItemOption]);

  const onConfirmExchange = async ({
    reason,
    reasonCode,
    returnMethod,
    returnSender,
    options,
  }: OrderRequestExchangeFormField) => {
    const { itemOptionList, exportId } = options.reduce<{
      itemOptionList: Array<OrderExchangeGoodsOption>;
      exportId: number;
    }>(
      (target, option, index) => {
        const { id, itemId, rowKey, exportId } = exchangeItemOption.exchangeableItemOptionList[index];

        if (!selectedRowKeys.includes(rowKey)) {
          return target;
        }

        const exchangeGoodsOptionList = option.optionItemIds.map((id, optionIndex) => {
          return {
            goodsOptionId: Number(id),
            exchangeEa: option.optionItemEaList[optionIndex],
          };
        });

        target.itemOptionList.push({
          id,
          itemId,
          exchangeGoodsOptionList,
        });

        if (target.exportId !== exportId) {
          target.exportId = exportId;
        }

        return target;
      },
      { itemOptionList: [], exportId: null },
    );

    await requestOrderExchange({
      reason,
      reasonCode,
      returnMethod,
      returnSender,
      itemOptionList,
      orderId,
      exportId: exportId.toString(),
    });

    dialog.open({
      type: DialogType.ALERT,
      content: '교환 요청이 완료되었습니다.',
      onClose: () => {
        queryClient.invalidateQueries(OrderExchangeQueryKeys.exchangeOption(orderId));
        dialog.close();
        onCloseModal(true);
      },
    });
  };

  /**
   * 교환 요청 submit
   */
  const onSubmit = handleSubmit((values) => {
    if (selectedRowKeys.length === 0) {
      setError('selectedOption', { message: '옵션을 선택하세요' });

      return;
    }

    const isFormError = values.options.reduce<boolean>((target, { optionEa, optionItemEaList }, index) => {
      const rowKey = exchangeItemOption.exchangeableItemOptionList[index].rowKey;
      if (!selectedRowKeys.includes(rowKey)) {
        return target;
      }

      const optionItemEa = optionItemEaList.reduce((target, value) => {
        target += value;
        return target;
      }, 0);

      if (optionEa !== optionItemEa) {
        setError(`options.${index}`, { message: '교환가능수량과 옵션의 수량의 합계가 같지 않습니다.' });
        target = true;
      }

      return target;
    }, false);

    if (isFormError) {
      return;
    }

    dialog.open({
      type: DialogType.CONFIRM,
      title: '확인',
      content: '교환요청 처리 하시겠습니까?',
      onConfirm: () => onConfirmExchange(values),
    });
  });

  /**
   * key에 해당되는 export id 리턴
   */
  const getExportIdByKey = (key: string) => {
    return exchangeItemOption.exchangeableItemOptionList.find((item) => item.rowKey === key).exportId;
  };

  /**
   * key에 해당되는 export id 리턴
   */
  const getIndexByKey = (key: string) => {
    return exchangeItemOption.exchangeableItemOptionList.findIndex((item) => item.rowKey === key);
  };

  /**
   * table row selection event
   */
  const handleChangeRowSelect = (selectedRowKeys: Array<string>, _, __, selectId) => {
    const selectExportId = getExportIdByKey(selectId);
    const optionItems = getValues('options');
    const filteredSelectedRowKeys = selectedRowKeys.reduce((target, key) => {
      const providerId = getExportIdByKey(key);

      if (providerId === selectExportId) {
        const itemIndex = getIndexByKey(key);
        if (!optionItems[itemIndex]) {
          update(itemIndex, {
            optionItemIds: [''],
            optionItemEaList: [0],
          });
        }
        target.push(key);
      } else {
        const itemIndex = getIndexByKey(key);
        if (!!optionItems[itemIndex]) {
          remove(itemIndex);
        }
      }

      return target;
    }, []);
    setSelectedRowKeys(filteredSelectedRowKeys);
    clearErrors(['selectedOption', 'options']);
  };

  /**
   * 출고그룹 상품 option 전체 선택
   */
  const handleClickSelectShippingGroupGoodsOption = (exportId: number) => {
    return () => {
      const filteredSelectedRowKeys = exchangeItemOption.exchangeableItemOptionList.reduce<Array<string>>(
        (target, item, itemIndex) => {
          if (item.exportId === exportId) {
            if (!selectedRowKeys.includes(item.rowKey)) {
              update(itemIndex, {
                optionItemIds: [''],
                optionItemEaList: [0],
              });
            }

            target.push(item.rowKey);
          } else {
            if (selectedRowKeys.includes(item.rowKey)) {
              remove(itemIndex);
            }
          }
          return target;
        },
        [],
      );
      setSelectedRowKeys(filteredSelectedRowKeys);
      clearErrors(['selectedOption', 'options']);
    };
  };

  /**
   * 주소 업데이트
   */
  const handleUpdateAddress = (postCode: string, address: string) => {
    setValue('returnSender.postCode', postCode);
    setValue('returnSender.address', address);
  };

  /**
   * 교환가능수량 수정 change event
   */
  const handleChangeOptionEa = (index: number) => {
    return () => {
      const optionChild = getValues(`options.${index}`);
      const { optionItemEaList } = optionChild;
      update(index, {
        ...optionChild,
        optionItemEaList: new Array(optionItemEaList.length).fill(0),
      });

      handleClearErrorsOption();
    };
  };

  /**
   * 옵션 item ea option 조회
   */
  const getOptionItemEaOptions = useCallback(
    (optionIndex: number, optionItemIndex: number): Array<TOption> => {
      const { optionItemIds, optionEa, optionItemEaList } = getValues(`options.${optionIndex}`);
      if (!optionItemIds || optionItemIds.length === 0) {
        return [];
      }

      const { exchangeableItemOptionList } = exchangeItemOption;
      const { goodsStockList } = exchangeableItemOptionList[optionIndex];

      const currentOptionId = Number(optionItemIds[optionItemIndex]);
      const purchaseStockByOptionId = !!currentOptionId
        ? goodsStockList.find((item) => item.id === currentOptionId).purchasableStock
        : 1;
      const currentEa = !!currentOptionId
        ? selectedOptionCountInfo[currentOptionId] - Number(optionItemEaList[optionItemIndex]) || 0
        : 0;
      const enableEa =
        optionItemEaList.length > 0
          ? optionItemEaList
              .filter((item, index) => index !== optionItemIndex)
              .reduce((target, item) => {
                target += Number(item);
                return target;
              }, 0)
          : 0;
      const targetEa = Math.min(purchaseStockByOptionId - currentEa, optionEa - enableEa);
      return new Array((targetEa || 0) + 1).fill(true).map<TOption>((value, index) => {
        return {
          value: index,
          label: index.toString(),
        };
      });
    },
    [exchangeItemOption, getValues, selectedOptionCountInfo],
  );

  /**
   * 옵션 item 제거
   */
  const handleRemoveOptionItem = (optionIndex: number, optionItemIndex: number) => {
    return () => {
      const { optionItemIds, optionEa, optionItemEaList } = getValues(`options.${optionIndex}`);

      const updateOptionItemIds = optionItemIds.filter((_, index) => index !== optionItemIndex);
      const updateOptionItemEaList = optionItemEaList.filter((_, index) => index !== optionItemIndex);
      remove(optionIndex);
      insert(optionIndex, {
        optionEa,
        optionItemIds: updateOptionItemIds,
        optionItemEaList: updateOptionItemEaList,
      });
    };
  };

  /**
   * 옵션 item 추가
   */
  const handleInsertOptionItem = (optionIndex: number) => {
    const { optionItemIds, optionItemEaList } = getValues(`options.${optionIndex}`);
    optionItemIds.push('');
    optionItemEaList.push(0);
    update(optionIndex, {
      optionItemIds: optionItemIds,
      optionItemEaList: optionItemEaList,
    });
  };

  /**
   * 옵션 form error clear
   */
  const handleClearErrorsOption = () => {
    clearErrors('options');
  };

  return {
    form: {
      formMethod,
      handleSubmit: onSubmit,
    },
    exchangeItemOption,
    returnReasonItems,
    isAutoReturnable,
    isLoading: isLoadingReturnReasonItems || isLoadingExchangeItemOption,
    selectedOptionCountInfo,
    rowSelection: {
      selectedRowKeys,
      onChange: handleChangeRowSelect,
      rowSelectionColumnIndex: 2,
    },
    handleClickSelectShippingGroupGoodsOption,
    handleUpdateAddress,
    handleChangeOptionEa,
    handleRemoveOptionItem,
    handleInsertOptionItem,
    handleClearErrorsOption,
    getOptionItemEaOptions,
  };
};
