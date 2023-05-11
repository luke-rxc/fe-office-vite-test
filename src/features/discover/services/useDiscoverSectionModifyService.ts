import { useDialog } from '@hooks/useDialog';
import useLoading from '@hooks/useLoading';
import { DialogType } from '@models/DialogModel';
import { ErrorModel } from '@utils/api/createAxios';
import { toDateFormat } from '@utils/date';
import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useQueryClient } from 'react-query';
import { useNavigate } from 'react-router';
import {
  DiscoverCommonQueryKeys,
  DiscoverFeedQueryKeys,
  DiscoverSectionDisplayType,
  DiscoverSectionQueryKeys,
  DiscoverSectionType,
  DiscoverSectionTypeLabel,
} from '../constants';
import {
  useDiscoverContentsListQuery,
  useDiscoverSectionDetailQuery,
  useDiscoverGoodsListQuery,
  useDiscoverSectionModifyMutation,
  useDiscoverShowroomListQuery,
  useDiscoverSectionTypeListPagination,
  useEdit,
  useDiscoverKeywordComboListQuery,
} from '../hooks';
import {
  toDiscoverSectionModifyFormField,
  toDiscoverSectionModifyParams,
  toDiscoverSectionTypeListParams,
} from '../models';
import { DiscoverSectionModifyFormField } from '../types';

interface Props {
  sectionId: string;
}

export type ReturnTypeUseDiscoverSectionModifyService = ReturnType<typeof useDiscoverSectionModifyService>;

const defaultSectionModifyFormValues: DiscoverSectionModifyFormField = {
  isOpen: '',
  keyword: null,
  title: '',
};

/**
 * 디스커버 섹션 수정 관련 service
 */
export const useDiscoverSectionModifyService = ({ sectionId }: Props) => {
  const { showLoading, hideLoading } = useLoading();
  const { isEdit, handleToggleEdit } = useEdit();
  const dialog = useDialog();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const formMethod = useForm<DiscoverSectionModifyFormField>({
    defaultValues: defaultSectionModifyFormValues,
  });
  const { reset, handleSubmit } = formMethod;

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

  const { data: discoverSectionItem, isLoading: isLoadingDiscoverSectionItem } = useDiscoverSectionDetailQuery(
    sectionId,
    {
      onError: onError('디스커버 섹션 상세 정보를 조회중 문제가 발생하였습니다'),
    },
  );

  const { data: keywordComboList } = useDiscoverKeywordComboListQuery({
    cacheTime: 0,
    enabled: discoverSectionItem?.displayType === DiscoverSectionDisplayType.CURATION,
  });

  const sectionTypeListPagination = useDiscoverSectionTypeListPagination();

  const {
    data: sectionGoodsList,
    isLoading: isLoadingSectionGoodsList,
    dataUpdatedAt: dataUpdatedAtSectionGoodsList,
  } = useDiscoverGoodsListQuery(toDiscoverSectionTypeListParams(discoverSectionItem, sectionTypeListPagination), {
    enabled: discoverSectionItem?.sectionType === DiscoverSectionType.GOODS,
    onError: onError('디스커버 섹션 상세 정보를 조회중 문제가 발생하였습니다'),
  });

  const {
    data: sectionContentsList,
    isLoading: isLoadingSectionContentsList,
    dataUpdatedAt: dataUpdatedAtSectionContentsList,
  } = useDiscoverContentsListQuery(toDiscoverSectionTypeListParams(discoverSectionItem, sectionTypeListPagination), {
    enabled: discoverSectionItem?.sectionType === DiscoverSectionType.STORY,
    onError: onError('디스커버 섹션 상세 정보를 조회중 문제가 발생하였습니다'),
  });

  const {
    data: sectionShowroomList,
    isLoading: isLoadingSectionShowroomList,
    dataUpdatedAt: dataUpdatedAtSectionShowroomList,
  } = useDiscoverShowroomListQuery(toDiscoverSectionTypeListParams(discoverSectionItem, sectionTypeListPagination), {
    enabled: discoverSectionItem?.sectionType === DiscoverSectionType.SHOWROOM,
    onError: onError('디스커버 섹션 상세 정보를 조회중 문제가 발생하였습니다'),
  });

  const { mutateAsync: modifyDiscoverSection } = useDiscoverSectionModifyMutation();

  useEffect(() => {
    if (
      isLoadingDiscoverSectionItem ||
      isLoadingSectionGoodsList ||
      isLoadingSectionContentsList ||
      isLoadingSectionShowroomList
    ) {
      showLoading();
    } else {
      hideLoading();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    isLoadingDiscoverSectionItem,
    isLoadingSectionContentsList,
    isLoadingSectionGoodsList,
    isLoadingSectionShowroomList,
  ]);

  useEffect(() => {
    if (!discoverSectionItem) {
      return;
    }

    reset(toDiscoverSectionModifyFormField(discoverSectionItem));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [discoverSectionItem]);

  const dataUpdatedAt = useMemo(() => {
    const dataUpdatedAt =
      dataUpdatedAtSectionGoodsList || dataUpdatedAtSectionContentsList || dataUpdatedAtSectionShowroomList;
    return dataUpdatedAt > 0
      ? toDateFormat(dataUpdatedAt, 'yyyy/MM/dd HH:mm:ss')
      : toDateFormat(new Date(), 'yyyy/MM/dd HH:mm:ss');
  }, [dataUpdatedAtSectionContentsList, dataUpdatedAtSectionGoodsList, dataUpdatedAtSectionShowroomList]);

  /**
   * 디스커버 섹션 수정
   */
  const handleModifySection = (values: DiscoverSectionModifyFormField) => {
    modifyDiscoverSection(toDiscoverSectionModifyParams(sectionId, values), {
      onSuccess: async () => {
        await queryClient.invalidateQueries(DiscoverSectionQueryKeys.detail(sectionId));
        await queryClient.invalidateQueries(DiscoverFeedQueryKeys.all);
        dialog.open({
          type: DialogType.ALERT,
          title: '수정완료',
          content: `해당 디스커버 섹션이 수정되었습니다.\r\n(섹션 ID: ${sectionId})`,
          onClose: () => {
            handleCancelEdit();
            dialog.close();
            navigate('/display/discover/section/list');
          },
        });
      },
      onError: (error) => {
        dialog.open({
          type: DialogType.ALERT,
          title: '에러',
          content: `디스커버 섹션 수정중 문제가 발생하였습니다.\r\n(${error.data.message})`,
        });
      },
    });
  };

  /**
   * 디스커버 섹션 수정 submit
   */
  const handleSubmitSection = handleSubmit((values) => {
    dialog.open({
      type: DialogType.CONFIRM,
      title: '확인',
      content: `해당 디스커버 섹션을 수정하시겠습니까?\r\n(섹션 ID: ${sectionId})`,
      onConfirm: () => {
        handleModifySection(values);
      },
    });
  });

  /**
   * 디스커버 섹션 수정모드
   */
  const handleEdit = () => {
    handleToggleEdit(true);
  };

  /**
   * 디스커버 섹션 수정모드 취소
   */
  const handleCancelEdit = () => {
    dialog.open({
      type: DialogType.CONFIRM,
      title: '확인',
      content: `정말 취소하시나요?\r\n작성된 내용은 저장되지 않습니다.`,
      onConfirm: () => {
        reset(toDiscoverSectionModifyFormField(discoverSectionItem));
        handleToggleEdit(false);
        dialog.close();
      },
      confirmText: '확인',
      closeText: '닫기',
    });
  };

  const handleReloadTypeList = () => {
    const params = toDiscoverSectionTypeListParams(discoverSectionItem, sectionTypeListPagination);
    switch (discoverSectionItem?.sectionType) {
      case DiscoverSectionType.GOODS:
        queryClient.refetchQueries(DiscoverCommonQueryKeys.goodsList(params));
        break;
      case DiscoverSectionType.STORY:
        queryClient.refetchQueries(DiscoverCommonQueryKeys.contentsList(params));
        break;
      case DiscoverSectionType.SHOWROOM:
        queryClient.refetchQueries(DiscoverCommonQueryKeys.showroomList(params));
        break;

      default:
        break;
    }
  };

  return {
    discoverSectionItem,
    items: sectionGoodsList?.content || sectionContentsList?.content || sectionShowroomList?.content || [],
    isLoading: isLoadingSectionGoodsList || isLoadingSectionContentsList || isLoadingSectionShowroomList,
    pagination: {
      ...sectionTypeListPagination,
      total:
        sectionGoodsList?.totalElements ||
        sectionContentsList?.totalElements ||
        sectionShowroomList?.totalElements ||
        0,
    },
    dataUpdatedAt,
    layoutLabel: discoverSectionItem?.sectionType ? DiscoverSectionTypeLabel[discoverSectionItem.sectionType] : '',
    formMethod,
    isEdit,
    keywordComboList: keywordComboList || [],
    handleSubmitSection,
    handleEdit,
    handleCancelEdit,
    handleReloadTypeList,
  };
};
