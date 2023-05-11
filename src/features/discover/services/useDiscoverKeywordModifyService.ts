import { useDialog } from '@hooks/useDialog';
import useLoading from '@hooks/useLoading';
import { DialogType } from '@models/DialogModel';
import { ErrorModel } from '@utils/api/createAxios';
import { toDateFormat } from '@utils/date';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useQueryClient } from 'react-query';
import { useNavigate } from 'react-router';
import { DiscoverKeywordMappingType, DiscoverKeywordQueryKeys, DiscoverCommonQueryKeys } from '../constants';
import {
  useDiscoverKeywordDetailQuery,
  useDiscoverKeywordModifyMutation,
  useDiscoverContentsListQuery,
  useDiscoverGoodsListQuery,
  useDiscoverShowroomListQuery,
  useEdit,
  useDiscoverKeywordMappingList,
} from '../hooks';
import {
  ContentsModel,
  GoodsModel,
  ShowroomModel,
  toDiscoverKeywordModifyFormField,
  toDiscoverKeywordModifyParams,
  toDiscoverSectionTypeListParamsByKeyword,
} from '../models';
import { DiscoverKeywordModifyFormField } from '../types';

interface Props {
  keywordId: string;
}

export type ReturnTypeUseDiscoverKeywordModifyService = ReturnType<typeof useDiscoverKeywordModifyService>;

const defaultKeywordModifyFormValues: DiscoverKeywordModifyFormField = {
  keyword: '',
  status: '',
};

/**
 * 디스커버 키워드 수정 관련 service
 */
export const useDiscoverKeywordModifyService = ({ keywordId }: Props) => {
  const { showLoading, hideLoading } = useLoading();
  const { isEdit, handleToggleEdit } = useEdit();
  const dialog = useDialog();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const formMethod = useForm<DiscoverKeywordModifyFormField>({
    defaultValues: defaultKeywordModifyFormValues,
  });
  const { reset, handleSubmit } = formMethod;

  const getCheckboxProps = useCallback(
    () => ({
      disabled: !isEdit,
    }),
    [isEdit],
  );

  const [currentTabType, setCurrentTabType] = useState<DiscoverKeywordMappingType>(DiscoverKeywordMappingType.GOODS);
  const goods = useDiscoverKeywordMappingList<GoodsModel>({ getCheckboxProps });
  const contents = useDiscoverKeywordMappingList<ContentsModel>({ getCheckboxProps });
  const showroom = useDiscoverKeywordMappingList<ShowroomModel>({ getCheckboxProps });

  const onError = (message: string) => {
    return (error: ErrorModel) => {
      dialog.open({
        type: DialogType.ALERT,
        title: '오류',
        content: `${message}\r\n(${error.data.message})`,
        onClose: () => {
          dialog.close();
          navigate('/display/discover/keyword/list');
        },
      });
    };
  };

  const { data: discoverKeywordItem, isLoading: isLoadingDiscoverKeywordItem } = useDiscoverKeywordDetailQuery(
    keywordId,
    {
      onError: onError('디스커버 키워드 상세 정보를 조회중 문제가 발생하였습니다'),
    },
  );

  const { isLoading: isLoadingSectionGoodsList, dataUpdatedAt: dataUpdatedAtSectionGoodsList } =
    useDiscoverGoodsListQuery(
      toDiscoverSectionTypeListParamsByKeyword(discoverKeywordItem, 1, discoverKeywordItem?.goodsCount, false),
      {
        refetchOnMount: true,
        enabled: discoverKeywordItem?.goodsCount > 0,
        onSuccess: (data) => goods.handleUpdateList(data.content),
        onError: onError('디스커버 키워드 상세 정보를 조회중 문제가 발생하였습니다'),
      },
    );

  const { isLoading: isLoadingSectionContentsList, dataUpdatedAt: dataUpdatedAtSectionContentsList } =
    useDiscoverContentsListQuery(
      toDiscoverSectionTypeListParamsByKeyword(discoverKeywordItem, 1, discoverKeywordItem?.storyCount),
      {
        refetchOnMount: true,
        enabled: discoverKeywordItem?.storyCount > 0,
        onSuccess: (data) => contents.handleUpdateList(data.content),
        onError: onError('디스커버 키워드 상세 정보를 조회중 문제가 발생하였습니다'),
      },
    );

  const { isLoading: isLoadingSectionShowroomList, dataUpdatedAt: dataUpdatedAtSectionShowroomList } =
    useDiscoverShowroomListQuery(
      toDiscoverSectionTypeListParamsByKeyword(discoverKeywordItem, 1, discoverKeywordItem?.showRoomCount),
      {
        refetchOnMount: true,
        enabled: discoverKeywordItem?.showRoomCount > 0,
        onSuccess: (data) => showroom.handleUpdateList(data.content),
        onError: onError('디스커버 키워드 상세 정보를 조회중 문제가 발생하였습니다'),
      },
    );

  const { mutateAsync: modifyDiscoverKeyword } = useDiscoverKeywordModifyMutation();

  useEffect(() => {
    if (
      isLoadingDiscoverKeywordItem ||
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
    isLoadingDiscoverKeywordItem,
    isLoadingSectionContentsList,
    isLoadingSectionGoodsList,
    isLoadingSectionShowroomList,
  ]);

  useEffect(() => {
    if (!discoverKeywordItem) {
      return;
    }

    reset(toDiscoverKeywordModifyFormField(discoverKeywordItem));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [discoverKeywordItem]);

  /**
   * 맵핑 리스트 갱신 date
   */
  const dataUpdatedAt = useMemo(() => {
    const getDateUpdatedAt = () => {
      switch (currentTabType) {
        case DiscoverKeywordMappingType.GOODS:
          return dataUpdatedAtSectionGoodsList;
        case DiscoverKeywordMappingType.SHOWROOM:
          return dataUpdatedAtSectionShowroomList;
        case DiscoverKeywordMappingType.CONTENTS:
          return dataUpdatedAtSectionContentsList;
      }
    };
    const dataUpdatedAt = getDateUpdatedAt();
    return dataUpdatedAt > 0
      ? toDateFormat(dataUpdatedAt, 'yyyy/MM/dd HH:mm:ss')
      : toDateFormat(new Date(), 'yyyy/MM/dd HH:mm:ss');
  }, [
    currentTabType,
    dataUpdatedAtSectionContentsList,
    dataUpdatedAtSectionGoodsList,
    dataUpdatedAtSectionShowroomList,
  ]);

  /**
   * 디스커버 키워드 수정
   */
  const handleModifyKeyword = (values: DiscoverKeywordModifyFormField) => {
    modifyDiscoverKeyword(
      toDiscoverKeywordModifyParams(
        keywordId,
        values,
        goods.handleGetIdList(),
        showroom.handleGetIdList(),
        contents.handleGetIdList(),
      ),
      {
        onSuccess: async () => {
          await queryClient.invalidateQueries(DiscoverKeywordQueryKeys.detail(keywordId));
          dialog.open({
            type: DialogType.ALERT,
            title: '수정완료',
            content: `해당 디스커버 키워드가 수정되었습니다.\r\n(키워드 ID: ${keywordId})`,
            onClose: () => {
              handleCancelEdit();
              dialog.close();
              navigate('/display/discover/keyword/list');
            },
          });
        },
        onError: (error) => {
          dialog.open({
            type: DialogType.ALERT,
            title: '에러',
            content: `디스커버 키워드 수정중 문제가 발생하였습니다.\r\n(${error.data.message})`,
          });
        },
      },
    );
  };

  /**
   * 디스커버 키워드 수정 submit
   */
  const handleSubmitKeyword = handleSubmit((values) => {
    if (goods.list.length + showroom.list.length + contents.list.length <= 0) {
      toast.error('해당 키워드에 맵핑된 아이템(상품, 쇼룸, 콘텐츠)가 없습니다.\r\n 확인해주세요');
      return;
    }

    dialog.open({
      type: DialogType.CONFIRM,
      title: '확인',
      content: `해당 디스커버 키워드를 수정하시겠습니까?\r\n(키워드 ID: ${keywordId})`,
      onConfirm: () => {
        handleModifyKeyword(values);
      },
    });
  });

  /**
   * 디스커버 섹션 초기화
   */
  const clearSectionTypeList = () => {
    const { goodsCount, storyCount, showRoomCount } = discoverKeywordItem;

    if (goodsCount === 0) {
      goods.handleUpdateList([], 'renew');
    }
    if (storyCount === 0) {
      contents.handleUpdateList([], 'renew');
    }
    if (showRoomCount === 0) {
      showroom.handleUpdateList([], 'renew');
    }
  };

  /**
   * 디스커버 키워드 수정모드
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
        reset(toDiscoverKeywordModifyFormField(discoverKeywordItem));
        queryClient.invalidateQueries(DiscoverCommonQueryKeys.lists());
        clearSectionTypeList();
        handleToggleEdit(false);
        dialog.close();
      },
      confirmText: '확인',
      closeText: '닫기',
    });
  };

  /**
   * 맵핑 리스트 reload
   */
  const handleReloadTypeList = () => {
    queryClient.invalidateQueries(DiscoverCommonQueryKeys.lists());
    queryClient.refetchQueries(DiscoverKeywordQueryKeys.detail(keywordId));
  };

  /**
   * 맵핑 리스트 탭 변경
   */
  const handleUpdateCurrentTab = (tab: DiscoverKeywordMappingType) => {
    if (currentTabType !== tab) {
      setCurrentTabType(tab);
    }
  };

  return {
    discoverKeywordItem,
    isLoading: isLoadingSectionGoodsList || isLoadingSectionContentsList || isLoadingSectionShowroomList,
    listItems: {
      goods,
      contents,
      showroom,
    },
    dataUpdatedAt,
    formMethod,
    isEdit,
    currentTabType,
    handleSubmitKeyword,
    handleEdit,
    handleCancelEdit,
    handleReloadTypeList,
    handleUpdateCurrentTab,
  };
};
