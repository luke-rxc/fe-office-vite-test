/* eslint-disable react-hooks/exhaustive-deps */
import toast from 'react-hot-toast';
import isEqual from 'lodash/isEqual';
import toNumber from 'lodash/toNumber';
import { useState, useEffect } from 'react';
import { useQueryClient } from 'react-query';
import { useParams } from 'react-router-dom';
import { useDialog } from '@hooks/useDialog';
import { DialogType } from '@models/DialogModel';
import { isIncluded } from '../utils';
import { ShowroomListItem } from '../types';
import { useUpdateSubShowroomListMutation } from './mutations';
import { useSubShowroomListQuery, SubShowroomListQueryKeys, ContentListQueryKeys } from './queries';

/**
 * 소속쇼룸 목록 조회 및 수정을 위한 Service
 */
export const useSubShowroomListService = () => {
  const { id } = useParams();
  const dialog = useDialog();
  const queryClient = useQueryClient();

  /**
   * 쇼룸ID
   */
  const showroomId = toNumber(id);

  /**
   * 소속쇼룸 목록 조회/수정 모드
   */
  const [mode, setMode] = useState<'edit' | 'read'>('read');

  /**
   * 소속쇼룸 목록 데이터
   */
  const [items, setItems] = useState<ShowroomListItem[]>([]);

  /**
   * 선택된 소속쇼룸 IDs (테이블 props를 위한 값)
   */
  const [selectedItemIds, setSelectedItemIds] = useState<number[]>([]);

  /**
   * 소속쇼룸 조회 Query
   */
  const listQuery = useSubShowroomListQuery({ showroomId }, { onSuccess: setItems });

  /**
   * 소속쇼룸 목록 변경 Mutation
   */
  const updateMutation = useUpdateSubShowroomListMutation({});

  /**
   * 소속쇼룸 목록 수정 하기
   */
  const handleEdit = () => setMode('edit');

  /**
   * 소속쇼룸 선택/선택취소
   */
  const handelChangeSelectItems = (ids: typeof selectedItemIds) => {
    setSelectedItemIds(ids);
  };

  /**
   * 소속쇼룸 목록 새로고침
   */
  const handleRefresh = async () => {
    try {
      await queryClient.refetchQueries(SubShowroomListQueryKeys.list({ showroomId }));
      toast.success('소속 쇼룸 관리 새로고침 완료');
    } catch (error) {
      toast.error('소속 쇼룸 정보를 새로 고칠 수 없습니다');
    }
  };

  /**
   * 소속쇼룸 추가
   *
   * 실제 DB 추가가 아니며 저장을 눌러야 DB에 반영됩니다.
   */
  const handleAdd = (addItems: ShowroomListItem[]) => {
    setItems([...items, ...addItems]);
  };

  /**
   * 선택된 소속쇼룸 삭제
   *
   * 실제 DB 삭제가 아니며 저장을 눌러야 DB에 반영됩니다.
   */
  const handleRemove = () => {
    setItems(items.filter((item) => !isIncluded(selectedItemIds, item.id)));
    setSelectedItemIds([]);
  };

  /**
   * 변경 사항 취소(초기화)
   */
  const handleCancel = () => {
    // 변경 사항 없을 때
    if (isEqual(listQuery.data, items)) {
      setSelectedItemIds([]);
      return setMode('read');
    }

    dialog.open({
      type: DialogType.CONFIRM,
      content: '소속 쇼룸 편집을 취소할까요?\n그동안의 변경 사항은 저장되지 않습니다.',
      onConfirm: () => {
        dialog.close();
        setMode('read');
        setItems(listQuery.data);
        setSelectedItemIds([]);
      },
    });
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

          // 소속쇼룸 IDs
          const ids = items.map((item) => item.id);

          // 쇼룸 수정 요청
          const data = await updateMutation.mutateAsync({ ids, showroomId });

          // 쇼룸 정보 react-query의 cache 업데이트
          queryClient.setQueryData(SubShowroomListQueryKeys.list({ showroomId }), data);

          // 콘텐츠 리스트 update
          queryClient.refetchQueries(ContentListQueryKeys.list({ showroomId }));

          // 선택된 소속쇼룸 목록 초기화
          setSelectedItemIds([]);

          setMode('read');
          toast.success('소속 쇼룸 수정 완료');
        } catch (error) {
          dialog.close();
          toast.error(error?.data?.message || '소속 쇼룸 수정 실패');
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
    selectedItemIds,
    isLoading: listQuery.isLoading,
    handler: {
      add: handleAdd,
      edit: handleEdit,
      save: handleSave,
      cancel: handleCancel,
      remove: handleRemove,
      refresh: handleRefresh,
      changeSelectItems: handelChangeSelectItems,
    },
  };
};
