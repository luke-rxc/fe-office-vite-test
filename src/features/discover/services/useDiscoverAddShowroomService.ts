import { PaginationResponse } from '@schemas/PaginationSchema';
import { clone } from 'lodash';
import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { ShowroomSearchType } from '../constants';
import {
  useDiscoverBrandComboListQuery,
  useDiscoverShowroomListMutation,
  useDiscoverProviderComboListQuery,
  useModal,
} from '../hooks';
import { useShowroomListPagination } from '../hooks';
import { ShowroomModel, toShowroomListModel, toShowroomSearchParams } from '../models';
import { ShowroomSearchFormField } from '../types';

export type ReturnTypeUseDiscoverAddShowroomService = ReturnType<typeof useDiscoverAddShowroomService>;

interface Props {
  addedShowroomList: Array<ShowroomModel>;
  handleUpdateShowroomList: (updateShowroomList: Array<ShowroomModel>, type: 'renew' | 'append') => void;
}

const defaultShowroomSearchFormValues: ShowroomSearchFormField = {
  searchType: ShowroomSearchType.ALL,
  searchValue: '',
  brand: null,
  provider: null,
};

/**
 * 디스커버 쇼룸 추가 관련 service
 *
 * @param {Array<ShowroomModel>} showroomList 추가된 쇼룸 리스트
 * @param {function} handleUpdateShowroomList 쇼룸 리스트 업데이트
 */
export const useDiscoverAddShowroomService = ({ addedShowroomList, handleUpdateShowroomList }: Props) => {
  const [showroomPagination, setShowroomPagination] = useState<PaginationResponse<ShowroomModel>>();
  const [selectedRowKeys, setSelectedRowKeys] = useState<Array<string>>([]);
  const [selectedShowroomList, setSelectedShowroomList] = useState<Array<ShowroomModel>>([]);
  const { isOpenModal, handleOpenModal, handleCloseModal } = useModal();
  const formMethod = useForm<ShowroomSearchFormField>({
    defaultValues: defaultShowroomSearchFormValues,
  });
  const { handleSubmit: onSubmit, reset, getValues } = formMethod;

  const { data: brandList } = useDiscoverBrandComboListQuery(null, {
    enabled: isOpenModal,
  });
  const { data: providerList } = useDiscoverProviderComboListQuery({
    enabled: isOpenModal,
  });

  const { mutateAsync: requestShowroomList, isLoading } = useDiscoverShowroomListMutation();
  const pagination = useShowroomListPagination({
    total: showroomPagination?.totalElements ?? 0,
    onChangePagination: (page: number, size: number) => handleUpdateShowroomPagination(getValues(), page, size),
  });

  const handleUpdateShowroomPagination = async (values: ShowroomSearchFormField, page?: number, size?: number) => {
    const paginationItem = await requestShowroomList(
      toShowroomSearchParams(values, addedShowroomList, page ?? pagination.page, size ?? pagination.limit),
    );
    const item: PaginationResponse<ShowroomModel> = {
      ...paginationItem,
      content: toShowroomListModel(paginationItem.content),
    };
    setShowroomPagination(item);
  };

  useEffect(() => {
    if (isOpenModal) {
      handleUpdateShowroomPagination(defaultShowroomSearchFormValues);
    }
    return () => {
      setSelectedRowKeys([]);
      setSelectedShowroomList([]);
      pagination.initPagination();
      reset(defaultShowroomSearchFormValues);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpenModal]);

  /**
   * 쇼룸 리스트 항목선택 키 업데이트
   */
  const handleChangeRowSelect = (_selectedRowKeys: Array<string>) => {
    setSelectedRowKeys(_selectedRowKeys);

    const addRowKeys = _selectedRowKeys.filter((item) => !selectedRowKeys.includes(item));
    const removeRowKeys = selectedRowKeys.filter((item) => !_selectedRowKeys.includes(item));

    if (addRowKeys.length > 0) {
      const tmpShowroomList = addRowKeys.reduce<Array<ShowroomModel>>((target, key) => {
        const showroom = showroomPagination.content.find((item) => item.rowKey === key);
        const appendIndex = _selectedRowKeys.findIndex((item) => item === key);
        target.splice(appendIndex, 0, showroom);
        return target;
      }, clone(selectedShowroomList));

      setSelectedShowroomList(tmpShowroomList);
    }

    if (removeRowKeys.length > 0) {
      setSelectedShowroomList((prev) => {
        return prev.filter((item) => !removeRowKeys.includes(item.rowKey));
      });
    }
  };

  /**
   * 선택한 쇼룸 리스트 등록
   */
  const handleClickRegistShowroomList = () => {
    handleUpdateShowroomList(selectedShowroomList, 'append');
    handleCloseModal();
  };

  /**
   * 쇼룸리스트 선택 disabled 옵션 처리
   */
  const getCheckboxProps = useCallback(
    (item: ShowroomModel) => ({
      disabled: addedShowroomList.map((item) => item.rowKey).includes(item.rowKey),
    }),
    [addedShowroomList],
  );

  /**
   * 쇼룸 검색 submit
   */
  const handleSubmitSearch = onSubmit(async (values) => {
    pagination.onUpdatePage(1);
    handleUpdateShowroomPagination(values, 1);
  });

  /**
   * 쇼룸 검색필터 초기화
   */
  const handleResetSearch = () => {
    reset(defaultShowroomSearchFormValues);
  };

  /**
   * 선택쇼룸 해제
   */
  const handleDeleteSelectShowroom = (rowKey: string) => {
    return () => {
      setSelectedRowKeys((prev) => prev.filter((item) => item !== rowKey));
      setSelectedShowroomList((prev) => prev.filter((item) => item.rowKey !== rowKey));
    };
  };

  return {
    isOpenModal,
    showroomList: showroomPagination?.content ?? [],
    selectedShowroomList,
    brandList,
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
    handleClickRegistShowroomList,
    handleDeleteSelectShowroom,
  };
};
