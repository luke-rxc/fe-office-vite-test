/* eslint-disable react-hooks/exhaustive-deps */
import toast from 'react-hot-toast';
import find from 'lodash/find';
import isEqual from 'lodash/isEqual';
import isEmpty from 'lodash/isEmpty';
import toNumber from 'lodash/toNumber';
import { useState, useEffect } from 'react';
import { useQueryClient } from 'react-query';
import { useParams } from 'react-router-dom';
import { useDialog } from '@hooks/useDialog';
import { DialogType } from '@models/DialogModel';
import { insert, remove, isIncluded, toTop, toBottom, toForward, toBackward } from '../utils';
import { ContentListItem, ShowroomListItem } from '../types';
import { UnAddableContentStatutes } from '../constants';
import { useUpdateContentListMutation } from './mutations';
import { useContentListQuery, ContentListQueryKeys } from './queries';

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
 * 편성/미편성 콘텐츠 조회 및 순서 변경 Service
 */
export const useContentListService = () => {
  const { id } = useParams();
  const dialog = useDialog();
  const queryClient = useQueryClient();

  /**
   * 쇼룸 아이디
   */
  const showroomId = toNumber(id);

  /**
   * 콘텐츠 목록 조회/수정 모드
   */
  const [mode, setMode] = useState<'read' | 'edit'>('read');

  /**
   * 편성된 콘텐츠 데이터
   */
  const [items, setItems] = useState<ContentListItem[]>([]);
  const [selectItemIds, setSelectItemIds] = useState<number[]>([]);

  /**
   * 미편성된 콘텐츠 데이터
   */
  const [exceptItems, setExceptItems] = useState<ContentListItem[]>([]);
  const [selectExceptItemIds, setSelectExceptItemIds] = useState<number[]>([]);

  /**
   * 콘텐츠 편성/미편성 목록 조회
   */
  // prettier-ignore
  const listQuery = useContentListQuery({ showroomId }, {
    onSuccess: ({published, unpublished}) => {
      setItems(published);
      setExceptItems(unpublished);
    }},
  );

  /**
   * 콘텐츠 편성 수정 Mutation
   */
  const updateMutation = useUpdateContentListMutation({});

  /**
   * 콘텐츠 편집하기
   */
  const handleEdit = () => setMode('edit');

  /**
   * 편성 추가
   */
  const handleAdd = () => {
    const moveItems = exceptItems.filter((item) => isIncluded(selectExceptItemIds, item.id));

    setItems(insert(items, moveItems));
    setExceptItems(remove(exceptItems, moveItems));
    setSelectExceptItemIds([]);
  };

  /**
   * 편성 제외
   */
  const handleRemove = () => {
    const moveItems = items.filter((item) => isIncluded(selectItemIds, item.id));

    setItems(remove(items, moveItems));
    setExceptItems(insert(exceptItems, moveItems));
    setSelectItemIds([]);
  };

  /**
   * 콘텐츠 새로고침
   */
  const handleRefresh = async () => {
    try {
      await queryClient.refetchQueries(ContentListQueryKeys.list({ showroomId }));
      toast.success('콘텐츠 편성 관리 새로고침 완료');
    } catch (error) {
      toast.error('콘텐츠 편성 정보를 새로 고칠 수 없습니다');
    }
  };

  /**
   * 콘텐츠 수정 취소
   */
  const handleCancel = () => {
    if (isEqual(items, listQuery.data.published) && isEqual(exceptItems, listQuery.data.unpublished)) {
      setSelectItemIds([]);
      setSelectExceptItemIds([]);
      return setMode('read');
    }

    dialog.open({
      type: DialogType.CONFIRM,
      content: '콘텐츠 편성 관리를 취소할까요?\n그동안의 변경 사항은 저장되지 않습니다.',
      onConfirm: () => {
        dialog.close();

        // 콘텐츠 목록 초기화
        setItems(listQuery.data.published);
        setExceptItems(listQuery.data.unpublished);

        // 선택된 콘텐츠 항목 초기화
        setSelectItemIds([]);
        setSelectExceptItemIds([]);

        setMode('read');
      },
    });
  };

  /**
   * 콘텐츠 변경사항 저장
   */
  const handleSave = async () => {
    if (isEqual(items, listQuery.data.published) && isEqual(exceptItems, listQuery.data.unpublished)) {
      return dialog.open({ type: DialogType.ALERT, content: '변경된 내용이 없습니다.' });
    }

    dialog.open({
      type: DialogType.CONFIRM,
      content: '변경 사항을 저장 및 적용 합니다.\n이대로 저장 할까요?',
      onConfirm: async () => {
        try {
          dialog.close();

          // 콘텐츠 목록 업데이트 요청
          const data = await updateMutation.mutateAsync({ showroomId, items, exceptItems });

          // 콘텐츠 목록 초기화 === 콘텐츠 목록 react-query의 cache 업데이트
          queryClient.setQueryData(ContentListQueryKeys.list({ showroomId }), data);

          // 선택된 콘텐츠 항목 초기화
          setSelectItemIds([]);
          setSelectExceptItemIds([]);

          setMode('read');
          toast.success('콘텐츠 목록 수정 완료');
        } catch (error) {
          dialog.close();
          toast.error(error?.data?.message || '콘텐츠 목록 수정 실패');
        }
      },
    });
  };

  /**
   * 편성 콘텐츠 테이블 Row 선택/선택취소
   */
  const handleChangeSelectItems = (ids: ShowroomListItem['id'][]) => {
    setSelectItemIds(ids);
  };

  /**
   * 미편성 콘텐츠 체크박스
   */
  const handleChangeSelectExceptItems = (ids: ShowroomListItem['id'][]) => {
    // 선택 취소
    if (isEmpty(ids) || ids.length < selectExceptItemIds.length) {
      return setSelectExceptItemIds(ids);
    }

    // 선택 가능 여부 체크
    const addable = ids.every((id) => {
      const status = find(exceptItems, (item) => item.id === id)?.status;
      return !UnAddableContentStatutes[status];
    });

    // 선택
    if (addable) {
      return setSelectExceptItemIds(ids);
    }

    // 선택 불가
    return toast.error('편성 가능 상태의 콘텐츠만 편성할 수 있습니다');
  };

  /**
   * 편성 테이블의 콘텐츠 목록 순서 변경
   */
  const handleOrder = (direction: keyof Pick<typeof order, 'top' | 'bottom' | 'forward' | 'backward'>) => {
    const moveItems = items.filter((item) => isIncluded(selectItemIds, item.id));
    if (isEmpty(moveItems)) {
      return dialog.open({ type: DialogType.ALERT, content: '선택된 콘텐츠가 없습니다' });
    }

    setItems(order[direction](items, moveItems));
  };

  /**
   * Mount시 소속 쇼롬 목록 업데이트
   *
   * 캐싱된 데이터가 있는 경우 API 요청을 하지 않기 때문에 query에
   * onSuccess 콜백이 실행되지 않아 쇼룸 필드값을 초기화 하는 작업이 필요.
   */
  useEffect(() => {
    if (listQuery?.data) {
      setItems(listQuery.data.published);
      setExceptItems(listQuery.data.unpublished);
    }
  }, []);

  return {
    mode,
    items,
    exceptItems,
    selectItemIds,
    selectExceptItemIds,
    isLoading: listQuery.isLoading,
    handler: {
      edit: handleEdit,
      save: handleSave,
      cancel: handleCancel,
      refresh: handleRefresh,
      add: handleAdd,
      remove: handleRemove,
      order: handleOrder,
      changeSelectItems: handleChangeSelectItems,
      changeSelectExceptItems: handleChangeSelectExceptItems,
    },
  };
};
