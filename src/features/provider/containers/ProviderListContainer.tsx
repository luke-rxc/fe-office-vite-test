import { useState, useCallback, useEffect } from 'react';
import type { VFC } from 'react';
import { toast } from 'react-hot-toast';
import { useLocation, useNavigate } from 'react-router-dom';
import { FormProvider } from 'react-hook-form';
import { parse, stringifyUrl } from 'query-string';
import { Paper, Button, Grid } from '@material-ui/core';
import { SortOrderType } from '@constants/table';
import { Layout } from '@components/Layout';
import { useDialog } from '@hooks/useDialog';
import { DialogType } from '@models/DialogModel';
import { SearchFormModel, SearchParamsModel } from '../models';
import { SearchForm, ProviderList, CreateProvider } from '../components';
import { useProviderDeleteService, useProviderCreateService, useProviderListService } from '../services';

const locations = [{ path: '/provider/browse/', text: '입점사 관리' }, { text: '입점사 조회' }];

/**
 * 검색 폼 데이터
 */
const initSearchFormData: SearchFormModel = {
  providerName: '',
  businessType: '',
  fromDate: null,
  toDate: null,
  calculateCount: null,
};

const initSearchParams: SearchParamsModel = {
  ...initSearchFormData,
  page: 1,
  limit: 20,
  sort: SortOrderType.DESC,
};

/**
 * 입점사 리스트
 * @returns
 */
export const ProviderListContainer: VFC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchFormValue, setSearchFormValue] = useState<SearchFormModel>(initSearchFormData);
  const [params, setParams] = useState<SearchParamsModel>(initSearchParams);
  const { handleInvalidateQuery, providerListInfo, isLoading } = useProviderListService(params);
  const { isSuccess: isRegisterSuccess, formMethod: creatorMethods, handleProviderCreate } = useProviderCreateService(); // 입점사 등록
  const { isSuccess: isDeleteSuccess, handleProviderDelete } = useProviderDeleteService(); // 입점사 리스트 삭제
  const [isRegister, setIsRegister] = useState<boolean>(false); // 등록 팝업
  const [selectedRowKeys, setSelectedRowKeys] = useState<number[]>([]); // 리스트 select된 id 배열
  const { open: dialogOpen, close: dialogClose } = useDialog();

  /**
   * 쿼리 변경시
   */
  useEffect(() => {
    const values = parse(location.search);
    const { providerName, businessType, calculateCount, fromDate, toDate, page, limit, sort } = values;
    const formData: SearchFormModel = {
      providerName: (providerName as string) || initSearchParams.providerName,
      businessType: (businessType as string) || initSearchParams.businessType,
      calculateCount: +calculateCount || initSearchParams.calculateCount,
      fromDate: +fromDate || initSearchParams.fromDate,
      toDate: +toDate || initSearchParams.toDate,
    };

    setSearchFormValue(formData);
    setParams({
      ...formData,
      page: +page || initSearchParams.page,
      limit: +limit || initSearchParams.limit,
      sort: (sort as SortOrderType) || initSearchParams.sort,
    });
  }, [location.search]);

  /**
   * 입점사 삭제
   */
  const removeItem = useCallback(() => {
    if (!selectedRowKeys.length) {
      toast.error('입점사를 선택 해 주세요.');
      return;
    }
    dialogOpen({
      title: '입점사 삭제',
      content: '삭제하시겠습니까?',
      type: DialogType.CONFIRM,
      onConfirm: () => {
        handleProviderDelete(selectedRowKeys);
        dialogClose();
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedRowKeys]);

  /**
   * 삭제 완료후 리스트 갱신
   */
  useEffect(() => {
    if (isDeleteSuccess) {
      setSelectedRowKeys([]);
      handleInvalidateQuery(); // 리스트 갱신
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDeleteSuccess]);

  /**
   * 등록완료 후 옵션 초기화, 리스트 갱신
   */
  useEffect(() => {
    if (isRegisterSuccess) {
      setIsRegister(false);
      updateQueryParam({
        ...initSearchParams,
      });
      handleInvalidateQuery(); // 리스트 갱신
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRegisterSuccess]);

  /**
   * 검색
   * @param {SearchFormModel} formData
   */
  const handleSearch = (formData: SearchFormModel) => {
    const query: Partial<SearchParamsModel> = { ...formData, page: 1 };
    updateQueryParam(query);
  };

  /**
   * 리스트 정렬 변경
   * @param {string} orderKey
   * @param {SortOrderType} orderType
   */
  const handleChangeSort = (orderKey: string, orderType: SortOrderType) => {
    const query: Partial<SearchParamsModel> = { sort: orderType, page: 1 };
    updateQueryParam(query);
  };

  /**
   * 리스트 page, limit 변경
   * @param {number} page
   * @param {number} limit
   */
  const handleChangePaging = (page: number, limit: number) => {
    const query: Partial<SearchParamsModel> = {
      page: params.limit !== limit ? 1 : page, // 페이지 limit 변경될 경우 page 1 부터 다시 조회
      limit,
    };
    updateQueryParam(query);
  };

  /**
   * 라우터 변경
   * @param query
   */
  const updateQueryParam = (query: Partial<SearchParamsModel>) => {
    navigate(
      stringifyUrl(
        {
          url: location.pathname,
          query: {
            ...params,
            ...query,
          },
        },
        {
          skipNull: true,
          skipEmptyString: true,
        },
      ),
    );
  };

  return (
    <>
      <Layout title="입점사 관리" locations={locations}>
        <>
          <SearchForm params={searchFormValue} onSearch={handleSearch} />
          <Paper elevation={0} sx={{ mt: 2, padding: 3 }}>
            <Grid container direction="row" justifyContent="start" alignItems="center" sx={{ mb: 2 }}>
              <Button
                sx={{ minWidth: 80 }}
                onClick={() => {
                  setIsRegister(true);
                }}
                variant="contained"
              >
                등록
              </Button>
              <Button onClick={removeItem} sx={{ minWidth: 80, ml: 1 }} variant="outlined">
                삭제
              </Button>
            </Grid>
            {providerListInfo && (
              <ProviderList
                providerList={providerListInfo?.providerList || []}
                page={params.page}
                limit={params.limit}
                orderType={params.sort}
                totalCount={providerListInfo?.totalCount || 0}
                selectedRowKeys={selectedRowKeys}
                isLoading={isLoading}
                onUpdateSelectedKeyList={(list: number[]) => setSelectedRowKeys(list)}
                onChangeSort={handleChangeSort}
                onChangePaging={handleChangePaging}
              />
            )}
          </Paper>
        </>
      </Layout>

      {isRegister && (
        <FormProvider {...creatorMethods}>
          <CreateProvider
            onConfirm={() => creatorMethods.handleSubmit(handleProviderCreate)()}
            onCancel={() => setIsRegister(false)}
          />
        </FormProvider>
      )}
    </>
  );
};
