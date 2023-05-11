/* eslint-disable react-hooks/exhaustive-deps */
import toast from 'react-hot-toast';
import toNumber from 'lodash/toNumber';
import isEmpty from 'lodash/isEmpty';
import isEqual from 'lodash/isEqual';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import { useDialog } from '@hooks/useDialog';
import { DialogType } from '@models/DialogModel';
import { isIncluded, toTop, toBottom, toForward, toBackward } from '../utils';
import { GoodsListItem } from '../types';
import { useShowroom } from '../hooks';
import { useUpdateGoodsListMutation } from './mutations';
import { useGoodsListQuery } from './queries';

/**
 * 순서 변경을 위한 함수
 */
const order = {
  top: toTop,
  bottom: toBottom,
  forward: toForward,
  backward: toBackward,
} as const;

/**
 * 전시상품 목록 조회 및 수정을 위한 Service
 */
export const useGoodsListService = () => {
  const params = useParams();
  const dialog = useDialog();

  const { id: showroomId = toNumber(params.id || 0), sectionId = toNumber(params.sectionId || 0) } = useShowroom();

  /**
   * 전시상품 목록 조회/수정 모드
   */
  const [mode, setMode] = useState<'edit' | 'read'>('read');

  /**
   * 전시상품 목록 데이터
   */
  const [items, setItems] = useState<GoodsListItem[]>([]);

  /**
   * 선택된 전시상품 IDs (테이블 props를 위한 값)
   */
  const [selectItemIds, setSelectItemIds] = useState<number[]>([]);

  /**
   * 전시상품 조회 Query
   */
  const listQuery = useGoodsListQuery(
    { showroomId, sectionId },
    { enabled: !!showroomId && !!sectionId, onSuccess: setItems },
  );

  /**
   * 전시상품 목록 변경 Mutation
   */
  const updateMutation = useUpdateGoodsListMutation({});

  /**
   * 전시상품 목록 수정 하기
   */
  const handleEdit = () => setMode('edit');

  /**
   * 전시상품 선택/선택취소
   */
  const handelChangeSelectItems = (ids: typeof selectItemIds) => {
    setSelectItemIds(ids);
  };

  /**
   * 전시상품 목록 새로고침
   */
  const handleRefresh = async () => {
    try {
      await listQuery.refetch().then((data) => {
        if (data.status === 'success') {
          toast.success('상품 전시 관리 새로고침 완료');
        }
      });
    } catch (error) {}
  };

  /**
   * 전시상품 추가
   *
   * 실제 DB 추가가 아니며 저장을 눌러야 DB에 반영됩니다.
   */
  const handleAdd = (addItems: GoodsListItem[]) => {
    setItems([...items, ...addItems]);
  };

  /**
   * 선택된 전시상품 삭제
   *
   * 실제 DB 삭제가 아니며 저장을 눌러야 DB에 반영됩니다.
   */
  const handleRemove = () => {
    setItems(items.filter((item) => !isIncluded(selectItemIds, item.id)));
    setSelectItemIds([]);
  };

  /**
   * 편성 테이블의 콘텐츠 목록 순서 변경
   */
  const handleOrder = (direction: keyof Pick<typeof order, 'top' | 'bottom' | 'forward' | 'backward'>) => {
    const moveItems = items.filter((item) => isIncluded(selectItemIds, item.id));
    if (isEmpty(moveItems)) {
      return dialog.open({ type: DialogType.ALERT, content: '선택된 전시상품이 없습니다' });
    }

    setItems(order[direction](items, moveItems));
  };

  /**
   * 변경 사항 취소(초기화)
   */
  const handleCancel = () => {
    // 변경 사항 없을 때
    if (isEqual(listQuery.data, items)) {
      setSelectItemIds([]);
      return setMode('read');
    }

    dialog.open({
      type: DialogType.CONFIRM,
      content: '전시상품 편집을 취소할까요?\n그동안의 변경 사항은 저장되지 않습니다.',
      onConfirm: () => {
        dialog.close();
        setMode('read');
        setItems(listQuery.data);
        setSelectItemIds([]);
      },
    });
  };

  /**
   * 초기화(콘셉트쇼룸을 위한 기능)
   */
  const handleReset = () => {
    setMode('read');
    setItems(listQuery.data);
    setSelectItemIds([]);
  };

  /**
   * 변경 사항 저장
   */
  const handleSave = () => {
    // 변경 사항 없을 때
    if (isEqual(listQuery.data, items)) {
      return dialog.open({ type: DialogType.ALERT, content: '변경된 내용이 없습니다.' });
    }

    dialog.open({
      type: DialogType.CONFIRM,
      content: '변경 사항을 저장 및 적용 합니다.\n이대로 저장 할까요?',
      onConfirm: async () => {
        try {
          dialog.close();

          // 전시상품 목록 수정 요청
          await updateMutation.mutateAsync({ showroomId, sectionId, items });

          // 쇼룸 정보 react-query의 cache 업데이트
          listQuery.refetch();

          // 선택된 전시상품 목록 초기화
          setSelectItemIds([]);

          setMode('read');
          toast.success('전시상품 수정 완료');
        } catch (error) {
          dialog.close();
          toast.error(error?.data?.message || '전시상품 수정 실패');
        }
      },
    });
  };

  /**
   * Mount시 소속 쇼롬 목록 업데이트
   *
   * 캐싱된 데이터가 있는 경우 API 요청을 하지 않기 때문에 query에
   * onSuccess 콜백이 실행되지 않아 쇼룸 필드값을 초기화 하는 작업이 필요.
   */
  useEffect(() => {
    listQuery?.data && setItems(listQuery.data);
  }, []);

  return {
    mode,
    items,
    selectItemIds,
    isLoading: listQuery.isLoading,
    handler: {
      add: handleAdd,
      edit: handleEdit,
      save: handleSave,
      cancel: handleCancel,
      remove: handleRemove,
      order: handleOrder,
      refresh: handleRefresh,
      changeSelectItems: handelChangeSelectItems,
      reset: handleReset,
    },
  };
};
