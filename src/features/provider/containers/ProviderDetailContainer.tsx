import { useCallback, useEffect, useState } from 'react';
import type { VFC } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FormProvider, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Grid, Box, Divider, CardHeader, CardContent, Card, Paper } from '@material-ui/core';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import ClearIcon from '@material-ui/icons/Clear';
import SaveIcon from '@material-ui/icons/Save';
import { Layout } from '@components/Layout';
import { useDialog } from '@hooks/useDialog';
import { DialogType } from '@models/DialogModel';
import { ProviderDefault, ProviderAccount, ProviderBrand, ProviderPerson } from '../components';
import { ProviderDetailFormFieldModel, toFormFieldProvider } from '../models';
import { useUpdateProviderService, useGetProviderService, useGetBankList } from '../services';
import { validationProviderCalculateForm, validationProviderDefaultForm, validationProviderPersonForm } from '../utils';
import { ProviderDetailShippingContainer } from './ProviderDetailShippingContainer';

/**
 * 입점사 상세
 * @returns
 */
export const ProviderDetailContainer: VFC = () => {
  const navigate = useNavigate();
  const matches = useMediaQuery('(min-width:1280px)');
  const { id } = useParams();
  const { providerData, isError, isSuccess, error } = useGetProviderService(+id); // 입점사 조회
  const { handleUpdateProvider, isSuccess: isUpdatedSuccess } = useUpdateProviderService(+id); // 입점사 수정
  const { bankList } = useGetBankList(); // 은행리스트 조회
  const { open: dialogOpen, close: dialogClose } = useDialog();
  const [isShow, setIsShow] = useState(false);
  const formMethods = useForm<ProviderDetailFormFieldModel>({
    resolver: yupResolver(
      Yup.object()
        .concat(validationProviderDefaultForm)
        .concat(validationProviderCalculateForm)
        .concat(validationProviderPersonForm),
    ),
    defaultValues: defaultFormValue,
  });

  const onSubmit = useCallback(
    (formData: ProviderDetailFormFieldModel) => {
      handleUpdateProvider(formData);
    },
    [handleUpdateProvider],
  );

  useEffect(() => {
    if (!providerData) {
      return;
    }
    formMethods.reset(toFormFieldProvider(providerData));
    setIsShow(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [providerData]);

  useEffect(() => {
    if (!isUpdatedSuccess) {
      return;
    }
    dialogOpen({
      title: '입점사 수정',
      content: '수정되었습니다.',
      type: DialogType.ALERT,
      onClose: () => {
        dialogClose();
        navigate('/provider/list');
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isUpdatedSuccess]);

  const handleFormValid = (e) => {
    e.preventDefault();
    formMethods.handleSubmit(onSubmit, () => {
      toast.error('입점사 입력 항목을 확인해 주세요.');
    })();
  };

  return (
    <>
      <Layout title="입점사 수정" locations={locations}>
        <Box sx={{ paddingBottom: 10 }}>
          {((isError && error) || (isSuccess && !providerData)) && (
            <Paper sx={{ padding: 20 }}>
              <Grid container textAlign="center" spacing={3}>
                <Grid item xs={12} sx={{ paddingTop: 200 }}>
                  {isError && error.data?.message}
                  {isSuccess && <>입점사 정보를 조회 할 수 없습니다.</>}
                </Grid>
                <Grid item xs={12}>
                  <Button onClick={() => navigate(-1)} sx={{ width: 100, marginRight: 10 }} variant="outlined">
                    Go Back
                  </Button>
                </Grid>
              </Grid>
            </Paper>
          )}
          {providerData && isShow && (
            <>
              <FormProvider {...formMethods}>
                <form onSubmit={handleFormValid}>
                  <Box sx={{ mt: 3 }}>
                    <Card>
                      <CardHeader title="기본 정보" />
                      <Divider />
                      <CardContent>
                        <ProviderDefault />
                      </CardContent>
                    </Card>
                  </Box>
                  <Box sx={{ mt: 3 }}>
                    <Card>
                      <CardHeader title="담당자 정보" />
                      <Divider />
                      <CardContent>
                        <ProviderPerson />
                      </CardContent>
                    </Card>
                  </Box>
                  <Box sx={{ mt: 3 }}>
                    <Card>
                      <CardHeader title="정산 정보" />
                      <Divider />
                      <CardContent>
                        <ProviderAccount bankList={bankList} />
                      </CardContent>
                    </Card>
                  </Box>
                  <Box
                    sx={{
                      position: 'fixed',
                      bottom: 0,
                      left: 0,
                      zIndex: 3,
                      width: '100%',
                      textAlign: 'center',
                      background: 'rgba(255, 255, 255, 0.8)',
                      borderTop: '2px solid #eee',
                      paddingLeft: matches ? '280px' : '0px',
                    }}
                  >
                    <Box sx={{ pt: 4, pb: 4 }}>
                      <Button
                        onClick={() => navigate(-1)}
                        variant="outlined"
                        startIcon={<ClearIcon />}
                        sx={{ ml: 2, minWidth: 100 }}
                      >
                        취소
                      </Button>
                      <Button type="submit" variant="contained" startIcon={<SaveIcon />} sx={{ ml: 2, minWidth: 100 }}>
                        저장
                      </Button>
                    </Box>
                  </Box>
                </form>
              </FormProvider>
              <Box sx={{ mt: 3 }}>
                <Card>
                  <CardHeader title="배송 정보" />
                  <Divider />
                  <CardContent>
                    <ProviderDetailShippingContainer />
                  </CardContent>
                </Card>
              </Box>
              <Box sx={{ mt: 3 }}>
                <Card>
                  <CardHeader title="브랜드 정보" />
                  <Divider />
                  <CardContent>
                    <ProviderBrand brands={providerData.brands} />
                  </CardContent>
                </Card>
              </Box>
            </>
          )}
        </Box>
      </Layout>
    </>
  );
};

const locations = [{ path: '/provider/browse/', text: '입점사 관리' }, { text: '입점사 수정' }];
const defaultFormValue: ProviderDetailFormFieldModel = {
  name: '',
  brands: [],
  businessType: '',
  businessNumber: '',
  businessNumberImage: null,
  businessNumberImageId: null,
  businessCondition: '',
  businessCategory: '',
  companyAddress: null,
  companyEmail: '',
  mailOrderSalesNumber: '',
  presidentName: '',
  phoneNumber: '',
  homepageUrl: '',
  commissionRate: 0,
  calculateCount: null, // 초기값
  bank: null,
  accountEmail: '',
  depositor: '',
  accountNumber: '',
  accountImage: null,
  accountImageId: null,
  person: [],
};
