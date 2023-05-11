import { useDialog } from '@hooks/useDialog';
import { useQueryState } from '@hooks/useQueryState';
import { DialogType } from '@models/DialogModel';
import { toDateFormat } from '@utils/date';
import sortBy from 'lodash/sortBy';
import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router';
import { useDiscoverFeedDisplayGroupCreateMutation, useOrder, useSectionList } from '../hooks';
import { DiscoverSectionItemModel, toDiscoverFeedDisplayGroupInfoParams } from '../models';
import { DiscoverFeedFormField } from '../types';
import { syncSortNumber } from '../utils';

/**
 * 디스커버 피드 생성 관련 service
 */
export const useDiscoverFeedCreateService = () => {
  const { order } = useOrder<DiscoverSectionItemModel>();
  const [selectedRowKeys, setSelectedRowKeys] = useState<Array<string>>([]);
  const formRef = useRef<HTMLFormElement>();
  const dialog = useDialog();
  const navigate = useNavigate();

  const { queryState } = useQueryState<{ displayStartDate: string }>();
  const { sections, handleUpdateSections: onUpdateSections, handleDeleteSections: onDeleteSections } = useSectionList();

  const formMethod = useForm<DiscoverFeedFormField>({
    defaultValues: {
      displayStartDate: toDateFormat(
        queryState?.displayStartDate ? Number(queryState.displayStartDate) : new Date(),
        `yyyy-MM-dd'T'HH:mm`,
      ),
    },
  });
  const { handleSubmit, setError } = formMethod;

  const { mutateAsync: createDiscoverFeedDisplayGroup } = useDiscoverFeedDisplayGroupCreateMutation();

  /**
   * 섹션 리스트 항목선택 키 업데이트
   */
  const handleChangeRowSelect = (selectedRowKeys: Array<string>) => {
    setSelectedRowKeys(sortBy(selectedRowKeys, 'sortNum'));
  };

  /**
   * 섹션 리스트 업데이트
   */
  const handleUpdateSections = (updateSections: DiscoverSectionItemModel[], type?: 'renew' | 'append') => {
    onUpdateSections(updateSections, type);
    // setSelectedRowKeys([]);
  };

  /**
   * 선택된 섹션 리스트 제거
   */
  const handleDeleteSections = () => {
    onDeleteSections(selectedRowKeys);
    setSelectedRowKeys([]);
  };

  /**
   * 섹션 리스트 순서 변경
   */
  const handleOrder = (direction: string) => {
    return () => {
      handleUpdateSections(syncSortNumber(order(direction, sections, selectedRowKeys, 'rowKey')));
    };
  };

  /**
   * 전시그룹 생성 처리
   */
  const handleCreateDisplayGroup = (displayStartDate: string) => {
    createDiscoverFeedDisplayGroup(toDiscoverFeedDisplayGroupInfoParams(displayStartDate, sections), {
      onSuccess: () => {
        dialog.open({
          type: DialogType.ALERT,
          title: '생성완료',
          content: '전시 그룹이 생성되었습니다.',
          onClose: () => {
            navigate('/display/discover/feed/list');
            dialog.close();
          },
        });
      },
      onError: (error) => {
        dialog.open({
          type: DialogType.ALERT,
          title: '에러',
          content: `전시 그룹 생성중 문제가 발생되었습니다.\r\n(${error.data.message})`,
        });
      },
    });
  };

  /**
   * 전시그룹 생성여부 확인
   */
  const handleSubmitCreateDisplayGroup = handleSubmit(({ displayStartDate }) => {
    if (new Date(displayStartDate) <= new Date()) {
      setError('displayStartDate', { message: '전시 시작일은 현재시간 이후여야 합니다' });
      return;
    }

    if (sections.length === 0) {
      toast.error('추가된 섹션이 없습니다. 섹션을 추가해주세요');
      return;
    }

    dialog.open({
      type: DialogType.CONFIRM,
      title: '확인',
      content: '전시 그룹을 생성하시겠습니까?',
      onConfirm: () => {
        handleCreateDisplayGroup(displayStartDate);
      },
    });
  });

  /**
   * submit button click
   */
  const handleClickSubmit = () => {
    if (formRef.current) {
      formRef.current.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
    }
  };

  /**
   * 전시그룹 생성취소
   */
  const handleCancelCreate = () => {
    dialog.open({
      type: DialogType.CONFIRM,
      title: '확인',
      content: '전시 그룹을 생성 취소하시겠습니까?',
      onConfirm: () => {
        navigate('/display/discover/feed/list');
        dialog.close();
      },
    });
  };

  return {
    formMethod,
    sections,
    formRef,
    rowSelection: {
      selectedRowKeys,
      onChange: handleChangeRowSelect,
    },
    handleUpdateSections,
    handleDeleteSections,
    handleOrder,
    handleClickSubmit,
    handleCancelCreate,
    handleSubmitCreateDisplayGroup,
  };
};
