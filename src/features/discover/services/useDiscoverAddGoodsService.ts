import { PaginationResponse } from '@schemas/PaginationSchema';
import { clone } from 'lodash';
import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { GoodsSearchType, GoodsStatus } from '../constants';
import {
  useDiscoverBrandComboListQuery,
  useDiscoverGoodsListMutation,
  useDiscoverProviderComboListQuery,
  useModal,
} from '../hooks';
import { useGoodsListPagination } from '../hooks';
import { GoodsModel, toGoodsListModel, toGoodsSearchParams } from '../models';
import { GoodsSearchFormField } from '../types';

export type ReturnTypeUseDiscoverAddGoodsService = ReturnType<typeof useDiscoverAddGoodsService>;

interface Props {
  addedGoodsList: Array<GoodsModel>;
  handleUpdateGoodsList: (updateGoodsList: Array<GoodsModel>, type: 'renew' | 'append') => void;
}

const defaultGoodsSearchFormValues: GoodsSearchFormField = {
  searchType: GoodsSearchType.ALL,
  keyword: '',
  status: GoodsStatus.ALL,
  brand: null,
  provider: null,
};

/**
 * 디스커버 상품 추가 관련 service
 *
 * @param {Array<GoodsModel>} goodsList 추가된 상품 리스트
 * @param {function} handleUpdateGoodsList 상품 리스트 업데이트
 */
export const useDiscoverAddGoodsService = ({ addedGoodsList, handleUpdateGoodsList }: Props) => {
  const [goodsPagination, setGoodsPagination] = useState<PaginationResponse<GoodsModel>>();
  const [selectedRowKeys, setSelectedRowKeys] = useState<Array<string>>([]);
  const [providerId, setProviderId] = useState<number>(null);
  const [selectedGoodsList, setSelectedGoodsList] = useState<Array<GoodsModel>>([]);
  const { isOpenModal, handleOpenModal, handleCloseModal } = useModal();
  const formMethod = useForm<GoodsSearchFormField>({
    defaultValues: defaultGoodsSearchFormValues,
  });
  const { handleSubmit: onSubmit, reset, getValues, watch } = formMethod;

  const { data: brandList } = useDiscoverBrandComboListQuery(providerId, {
    enabled: isOpenModal,
  });
  const { data: providerList } = useDiscoverProviderComboListQuery({
    enabled: isOpenModal,
  });

  useEffect(() => {
    const subscription = watch(({ provider }, { name }) => {
      if (name === 'provider') {
        setProviderId(provider?.value ?? null);
      }
    });
    return () => subscription.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watch]);

  const { mutateAsync: requestGoodsList, isLoading } = useDiscoverGoodsListMutation();
  const pagination = useGoodsListPagination({
    total: goodsPagination?.totalElements ?? 0,
    onChangePagination: (page: number, size: number) => handleUpdateGoodsPagination(getValues(), page, size),
  });

  const handleUpdateGoodsPagination = async (values: GoodsSearchFormField, page?: number, size?: number) => {
    const paginationItem = await requestGoodsList(
      toGoodsSearchParams(values, addedGoodsList, page ?? pagination.page, size ?? pagination.limit),
    );
    const item: PaginationResponse<GoodsModel> = {
      ...paginationItem,
      content: toGoodsListModel(paginationItem.content),
    };
    setGoodsPagination(item);
  };

  useEffect(() => {
    if (isOpenModal) {
      handleUpdateGoodsPagination(defaultGoodsSearchFormValues);
    }
    return () => {
      setSelectedRowKeys([]);
      setSelectedGoodsList([]);
      pagination.initPagination();
      reset(defaultGoodsSearchFormValues);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpenModal]);

  /**
   * 상품 리스트 항목선택 키 업데이트
   */
  const handleChangeRowSelect = (_selectedRowKeys: Array<string>) => {
    setSelectedRowKeys(_selectedRowKeys);

    const addRowKeys = _selectedRowKeys.filter((item) => !selectedRowKeys.includes(item));
    const removeRowKeys = selectedRowKeys.filter((item) => !_selectedRowKeys.includes(item));

    if (addRowKeys.length > 0) {
      const tmpGoodsList = addRowKeys.reduce<Array<GoodsModel>>((target, key) => {
        const goods = goodsPagination.content.find((item) => item.rowKey === key);
        const appendIndex = _selectedRowKeys.findIndex((item) => item === key);
        target.splice(appendIndex, 0, goods);
        return target;
      }, clone(selectedGoodsList));
      setSelectedGoodsList(tmpGoodsList);
    }

    if (removeRowKeys.length > 0) {
      setSelectedGoodsList((prev) => {
        return prev.filter((item) => !removeRowKeys.includes(item.rowKey));
      });
    }
  };

  /**
   * 선택한 상품 리스트 등록
   */
  const handleClickRegistGoodsList = () => {
    handleUpdateGoodsList(selectedGoodsList, 'append');
    handleCloseModal();
  };

  /**
   * 상품리스트 선택 disabled 옵션 처리
   */
  const getCheckboxProps = useCallback(
    (item: GoodsModel) => ({
      disabled: addedGoodsList.map((item) => item.rowKey).includes(item.rowKey),
    }),
    [addedGoodsList],
  );

  /**
   * 상품 검색 submit
   */
  const handleSubmitSearch = onSubmit(async (values) => {
    pagination.onUpdatePage(1);
    handleUpdateGoodsPagination(values, 1);
  });

  /**
   * 상품 검색필터 초기화
   */
  const handleResetSearch = () => {
    reset(defaultGoodsSearchFormValues);
  };

  /**
   * 선택상품 해제
   */
  const handleDeleteSelectGoods = (rowKey: string) => {
    return () => {
      setSelectedRowKeys((prev) => prev.filter((item) => item !== rowKey));
      setSelectedGoodsList((prev) => prev.filter((item) => item.rowKey !== rowKey));
    };
  };

  return {
    isOpenModal,
    goodsList: goodsPagination?.content ?? [],
    selectedGoodsList,
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
    handleClickRegistGoodsList,
    handleDeleteSelectGoods,
  };
};
