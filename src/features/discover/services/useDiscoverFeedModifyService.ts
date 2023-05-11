import { useDialog } from '@hooks/useDialog';
import useLoading from '@hooks/useLoading';
import { DialogType } from '@models/DialogModel';
import { ErrorModel } from '@utils/api/createAxios';
import { toDateFormat } from '@utils/date';
import sortBy from 'lodash/sortBy';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useQueryClient } from 'react-query';
import { useNavigate } from 'react-router';
import { DiscoverFeedQueryKeys, DiscoverFeedStatus } from '../constants';
import {
  useDiscoverFeedDisplayGroupDeleteMutation,
  useDiscoverFeedDisplayGroupItemQuery,
  useDiscoverFeedDisplayGroupModifyMutation,
  useOrder,
  useSectionList,
} from '../hooks';
import { DiscoverSectionItemModel, toDiscoverFeedDisplayGroupInfoParams } from '../models';
import { DiscoverFeedFormField } from '../types';
import { syncSortNumber } from '../utils';

interface Props {
  feedId: string;
}

/**
 * 디스커버 피드 수정 관련 service
 */
export const useDiscoverFeedModifyService = ({ feedId }: Props) => {
  const { order } = useOrder<DiscoverSectionItemModel>();
  const [selectedRowKeys, setSelectedRowKeys] = useState<Array<string>>([]);
  const [disabledEdit, setDisabledEdit] = useState<boolean>(true);

  const formRef = useRef<HTMLFormElement>();
  const dialog = useDialog();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { showLoading, hideLoading } = useLoading();

  const onError = (message: string) => {
    return (error: ErrorModel) => {
      dialog.open({
        type: DialogType.ALERT,
        title: '오류',
        content: `${message}\r\n(${error.data.message})`,
        onClose: () => {
          dialog.close();
          navigate('/display/discover/section/list');
        },
      });
    };
  };

  const { sections, handleUpdateSections: onUpdateSections, handleDeleteSections: onDeleteSections } = useSectionList();
  const { data: displayGroupItem, isLoading: isLoadingDisplayGroupItem } = useDiscoverFeedDisplayGroupItemQuery(
    feedId,
    {
      onError: onError('디스커버 피드 상세 정보를 조회중 문제가 발생하였습니다'),
      refetchOnMount: true,
    },
  );

  const formMethod = useForm<DiscoverFeedFormField>({
    defaultValues: {
      displayStartDate: '',
    },
  });
  const { handleSubmit, setError, setValue } = formMethod;

  const { mutateAsync: modifyDiscoverFeedDisplayGroup } = useDiscoverFeedDisplayGroupModifyMutation();
  const { mutateAsync: deleteDiscoverFeedDisplayGroup } = useDiscoverFeedDisplayGroupDeleteMutation();

  useEffect(() => {
    if (isLoadingDisplayGroupItem) {
      showLoading();
    } else {
      hideLoading();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoadingDisplayGroupItem]);

  useEffect(() => {
    if (displayGroupItem) {
      if (displayGroupItem.status === DiscoverFeedStatus.BEFORE_OPEN) {
        setDisabledEdit(false);
      }
      setValue('displayStartDate', toDateFormat(displayGroupItem.displayStartDate, `yyyy-MM-dd'T'HH:mm`));
      onUpdateSections(displayGroupItem.sections);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [displayGroupItem]);

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
   * 섹션 리스트 항목선택 키 업데이트
   */
  const handleChangeRowSelect = (selectedRowKeys: Array<string>) => {
    setSelectedRowKeys(sortBy(selectedRowKeys, 'sortNum'));
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
   * 전시그룹 수정 처리
   */
  const handleModifyDisplayGroup = (displayStartDate: string) => {
    modifyDiscoverFeedDisplayGroup(toDiscoverFeedDisplayGroupInfoParams(displayStartDate, sections, feedId), {
      onSuccess: async () => {
        await queryClient.invalidateQueries(DiscoverFeedQueryKeys.detail(feedId));
        dialog.open({
          type: DialogType.ALERT,
          title: '수정완료',
          content: '전시 그룹이 수정되었습니다.',
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
          content: `전시 그룹 수정중 문제가 발생되었습니다.\r\n(${error.data.message})`,
        });
      },
    });
  };

  /**
   * 전시그룹 수정여부 확인
   */
  const handleSubmitModifyDisplayGroup = handleSubmit(({ displayStartDate }) => {
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
      content: '전시 그룹을 수정하시겠습니까?',
      onConfirm: () => {
        handleModifyDisplayGroup(displayStartDate);
      },
    });
  });

  /**
   * 전시그룹 삭제 처리
   */
  const handleDeleteDisplayGroup = () => {
    deleteDiscoverFeedDisplayGroup(feedId, {
      onSuccess: () => {
        dialog.open({
          type: DialogType.ALERT,
          title: '수정완료',
          content: '전시 그룹이 삭제되었습니다.',
          onClose: () => {
            queryClient.refetchQueries(DiscoverFeedQueryKeys.lists());
            navigate('/display/discover/feed/list');
            dialog.close();
          },
        });
      },
      onError: (error) => {
        dialog.open({
          type: DialogType.ALERT,
          title: '에러',
          content: `전시 그룹 삭제중 문제가 발생되었습니다.\r\n(${error.data.message})`,
        });
      },
    });
  };

  /**
   * 전시그룹 삭제여부 확인
   */
  const handleClickDeleteDisplayGroup = () => {
    dialog.open({
      type: DialogType.CONFIRM,
      title: '확인',
      content: '전시 그룹을 삭제하시겠습니까?',
      onConfirm: () => {
        handleDeleteDisplayGroup();
      },
    });
  };

  /**
   * submit button click
   */
  const handleClickSubmit = () => {
    if (formRef.current) {
      formRef.current.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
    }
  };

  /**
   * 전시그룹 수정취소
   */
  const handleCancelModify = () => {
    dialog.open({
      type: DialogType.CONFIRM,
      title: '확인',
      content: '전시 그룹을 수정 취소하시겠습니까?',
      onConfirm: () => {
        navigate('/display/discover/feed/list');
        dialog.close();
      },
    });
  };

  /**
   * 리스트 checkbox 상태 처리
   */
  const getCheckboxProps = useCallback(
    () => ({
      disabled: displayGroupItem?.status !== DiscoverFeedStatus.BEFORE_OPEN,
    }),
    [displayGroupItem],
  );

  return {
    formMethod,
    sections,
    formRef,
    displayGroupItem,
    disabledEdit,
    rowSelection: {
      selectedRowKeys,
      onChange: handleChangeRowSelect,
      getCheckboxProps,
    },
    handleUpdateSections,
    handleDeleteSections,
    handleOrder,
    handleClickSubmit,
    handleCancelModify,
    handleSubmitModifyDisplayGroup,
    handleClickDeleteDisplayGroup,
  };
};
