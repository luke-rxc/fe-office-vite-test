import { PaginationResponse } from '@schemas/PaginationSchema';
import { clone } from 'lodash';
import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { ContentsSearchType } from '../constants';
import {
  useDiscoverShowroomComboListQuery,
  useDiscoverContentsListMutation,
  useDiscoverProviderComboListQuery,
  useModal,
} from '../hooks';
import { useContentsListPagination } from '../hooks';
import { ContentsModel, toContentsListModel, toContentsSearchParams } from '../models';
import { ContentsSearchFormField } from '../types';

export type ReturnTypeUseDiscoverAddContentsService = ReturnType<typeof useDiscoverAddContentsService>;

interface Props {
  addedContentsList: Array<ContentsModel>;
  handleUpdateContentsList: (updateContentsList: Array<ContentsModel>, type: 'renew' | 'append') => void;
}

const defaultContentsSearchFormValues: ContentsSearchFormField = {
  searchType: ContentsSearchType.ALL,
  searchValue: '',
  showroom: null,
  provider: null,
};

/**
 * 디스커버 콘텐츠 추가 관련 service
 *
 * @param {Array<ContentsModel>} contentsList 추가된 콘텐츠 리스트
 * @param {function} handleUpdateContentsList 콘텐츠 리스트 업데이트
 */
export const useDiscoverAddContentsService = ({ addedContentsList, handleUpdateContentsList }: Props) => {
  const [contentsPagination, setContentsPagination] = useState<PaginationResponse<ContentsModel>>();
  const [selectedRowKeys, setSelectedRowKeys] = useState<Array<string>>([]);
  const [selectedContentsList, setSelectedContentsList] = useState<Array<ContentsModel>>([]);
  const { isOpenModal, handleOpenModal, handleCloseModal } = useModal();
  const formMethod = useForm<ContentsSearchFormField>({
    defaultValues: defaultContentsSearchFormValues,
  });
  const { handleSubmit: onSubmit, reset, getValues } = formMethod;

  const { data: showroomList } = useDiscoverShowroomComboListQuery({
    enabled: isOpenModal,
  });
  const { data: providerList } = useDiscoverProviderComboListQuery({
    enabled: isOpenModal,
  });

  const { mutateAsync: requestContentsList, isLoading } = useDiscoverContentsListMutation();
  const pagination = useContentsListPagination({
    total: contentsPagination?.totalElements ?? 0,
    onChangePagination: (page: number, size: number) => handleUpdateContentsPagination(getValues(), page, size),
  });

  const handleUpdateContentsPagination = async (values: ContentsSearchFormField, page?: number, size?: number) => {
    const paginationItem = await requestContentsList(
      toContentsSearchParams(values, addedContentsList, page ?? pagination.page, size ?? pagination.limit),
    );
    const item: PaginationResponse<ContentsModel> = {
      ...paginationItem,
      content: toContentsListModel(paginationItem.content),
    };
    setContentsPagination(item);
  };

  useEffect(() => {
    if (isOpenModal) {
      handleUpdateContentsPagination(defaultContentsSearchFormValues);
    }
    return () => {
      setSelectedRowKeys([]);
      setSelectedContentsList([]);
      pagination.initPagination();
      reset(defaultContentsSearchFormValues);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpenModal]);

  /**
   * 콘텐츠 리스트 항목선택 키 업데이트
   */
  const handleChangeRowSelect = (_selectedRowKeys: Array<string>) => {
    setSelectedRowKeys(_selectedRowKeys);

    const addRowKeys = _selectedRowKeys.filter((item) => !selectedRowKeys.includes(item));
    const removeRowKeys = selectedRowKeys.filter((item) => !_selectedRowKeys.includes(item));

    if (addRowKeys.length > 0) {
      const tmpContentsList = addRowKeys.reduce<Array<ContentsModel>>((target, key) => {
        const contents = contentsPagination.content.find((item) => item.rowKey === key);
        const appendIndex = _selectedRowKeys.findIndex((item) => item === key);
        target.splice(appendIndex, 0, contents);
        return target;
      }, clone(selectedContentsList));
      setSelectedContentsList(tmpContentsList);
    }

    if (removeRowKeys.length > 0) {
      setSelectedContentsList((prev) => {
        return prev.filter((item) => !removeRowKeys.includes(item.rowKey));
      });
    }
  };

  /**
   * 선택한 콘텐츠 리스트 등록
   */
  const handleClickRegistContentsList = () => {
    handleUpdateContentsList(selectedContentsList, 'append');
    handleCloseModal();
  };

  /**
   * 콘텐츠리스트 선택 disabled 옵션 처리
   */
  const getCheckboxProps = useCallback(
    (item: ContentsModel) => ({
      disabled: addedContentsList.map((item) => item.rowKey).includes(item.rowKey),
    }),
    [addedContentsList],
  );

  /**
   * 콘텐츠 검색 submit
   */
  const handleSubmitSearch = onSubmit(async (values) => {
    pagination.onUpdatePage(1);
    handleUpdateContentsPagination(values, 1);
  });

  /**
   * 콘텐츠 검색필터 초기화
   */
  const handleResetSearch = () => {
    reset(defaultContentsSearchFormValues);
  };

  /**
   * 선택콘텐츠 해제
   */
  const handleDeleteSelectContents = (rowKey: string) => {
    return () => {
      setSelectedRowKeys((prev) => prev.filter((item) => item !== rowKey));
      setSelectedContentsList((prev) => prev.filter((item) => item.rowKey !== rowKey));
    };
  };

  return {
    isOpenModal,
    contentsList: contentsPagination?.content ?? [],
    selectedContentsList,
    showroomList,
    providerList,
    isLoading,
    rowSelection: {
      selectedRowKeys,
      onChange: handleChangeRowSelect,
      getCheckboxProps,
    },
    pagination,
    form: {
      formMethod,
      handleSubmit: handleSubmitSearch,
      handleReset: handleResetSearch,
    },
    handleOpenModal,
    handleCloseModal,
    handleClickRegistContentsList,
    handleDeleteSelectContents,
  };
};
