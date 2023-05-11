/* eslint-disable react-hooks/exhaustive-deps */
import toast from 'react-hot-toast';
import isEmpty from 'lodash/isEmpty';
import toNumber from 'lodash/toNumber';
import { useState, useCallback } from 'react';
import { DialogType } from '@models/DialogModel';
import { useDialog } from '@hooks/useDialog';
import { GoodsListItem } from '../types';
import { useShowroom } from '../hooks';
import { useValidAddableGoodsMutation } from './mutations';

interface UseBulkRegistrationGoodsServiceProps {
  addedIds: number[];
  onAdd: (items: GoodsListItem[]) => void;
}

/**
 * 상품 일괄 등록 Service
 */
export const useBulkRegistrationGoodsService = ({ addedIds, onAdd }: UseBulkRegistrationGoodsServiceProps) => {
  const dialog = useDialog();
  const showroom = useShowroom();

  /**
   * 입력된 상품 아이디
   */
  const [enterIds, setEnterIds] = useState<number[]>([]);

  /**
   * 등록 가능한 상품 여부를 판단하기 위한 Mutation
   */
  const goodsValidation = useValidAddableGoodsMutation({
    onSuccess: (data) => {
      if (isEmpty(data.failedItems)) {
        onAdd?.(data.successfulItems.map(({ goods }) => goods));
      }
    },
    onError: (error) => {
      toast.error(error?.data?.message || '일시적인 에러');
    },
  });

  /**
   * 상품 아이디 입력 이벤트 핸들러
   */
  const handleEnter = (input: HTMLInputElement) => {
    const values = input.value.trim().replace(/[,\s\t\n]\s*$/, '') || '';
    const successPattern = /[,\s\t\n]+/g;
    const failurePattern = /[^0-9,\s\t\n]+/g;

    if (!values) {
      return;
    }

    if (values.match(failurePattern)) {
      return dialog.open({ type: DialogType.ALERT, content: '형식에 맞지 않는 텍스트가 포함되어 있습니다' });
    }

    input.value = '';
    setEnterIds([...new Set([...enterIds, ...values.split(successPattern).map(toNumber)])]);
  };

  /**
   * 추가 이벤트 핸들러 (실제 테이블 데이터에 적용)
   */
  const handleAdd = useCallback(() => {
    if (isEmpty(enterIds)) {
      return dialog.open({ type: DialogType.ALERT, content: '상품 ID를 입력해주세요' });
    }

    const { data, isSuccess, mutate } = goodsValidation;

    if (isSuccess && data.successfulItems.length) {
      return onAdd?.(data.successfulItems.map(({ goods }) => goods));
    }

    mutate({ checkIds: enterIds, localIds: addedIds });
  }, [enterIds, showroom]);

  /**
   * 초기화 이벤트 핸들러
   */
  const handleReset = () => {
    return dialog.open({
      type: DialogType.CONFIRM,
      content: '추가한 상품 ID를 초기화할까요?',
      onConfirm: () => {
        dialog.close();

        setEnterIds([]);
        goodsValidation.reset();
      },
    });
  };

  return {
    ...(goodsValidation.data || {}),
    enterIds,
    handlers: {
      add: handleAdd,
      reset: handleReset,
      enter: handleEnter,
    },
  };
};
