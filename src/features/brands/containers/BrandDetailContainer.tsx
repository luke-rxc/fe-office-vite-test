import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Box, Button, Card, CardHeader, CardContent, Divider } from '@material-ui/core';
import PencilAlt from '@assets/icons/PencilAlt';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { Layout } from '@components/Layout';
import { DetailMode } from '../constants';
import { BrandForm } from '../components';
import { useBrandManageService } from '../services';
import { useBrandModal } from '../hooks';
import { toBrandUpdateRequestParams } from '../models';

export const BrandDetailContainer = () => {
  const params = useParams();
  const styles = useStyles();
  const brandId = Number(params.brandId);

  const { mode, handleChangeMode } = useBrandModal();

  useEffect(() => {
    handleChangeMode(DetailMode.READ);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const {
    form: {
      control,
      resetForm,
      handleSubmit,
      formState: { isDirty, errors },
    },
    upload: { fileInfos, handleChangeLogoFile, handleClearLogoFile },
    comboBoxProvider,
    comboBoxMd,
    comboBoxAmd,
    handleChangeComboProvider,
    handleChangeComboMd,
    handleChangeComboAmd,
    brandInfo,
    brandInfoRefetch,
    handleUpdateBrand,
  } = useBrandManageService(true, brandId);

  /**
   * Update 모드의 Cancel 처리
   */
  const handleCancelUpdateBrand = () => {
    const restore = () => {
      resetForm(brandInfo);
      handleChangeMode(DetailMode.READ);
    };

    // 수정사항이 없는 경우 confirm 노출하지 않음
    isDirty
      ? window.confirm('브랜드 수정을 취소하시나요?\r\n변경된 내용은 저장되지 않습니다.') && restore()
      : restore();
  };

  /**
   * Update 모드의 Confirm 처리
   */
  const handleConfirmUpdateBrand = (values) => {
    window.confirm('브랜드 변경 사항을 저장할까요?') &&
      handleUpdateBrand(toBrandUpdateRequestParams(values), {
        onSuccess: () => {
          toast.success('브랜드 변경사항이 저장되었습니다.');
          handleChangeMode(DetailMode.READ);
          brandInfoRefetch();
        },
        onError: (error) => {
          toast.error(error?.data?.message);
        },
      });
  };

  return (
    <Layout
      title="브랜드 조회/관리 상세"
      locations={[
        { text: '브랜드', path: '/brands' },
        { text: '브랜드 조회/관리', path: '/brands' },
        { text: '브랜드 조회/관리 상세' },
      ]}
    >
      <Card>
        <Box
          sx={{
            backgroundColor: 'background.paper',
            minHeight: '100%',
          }}
        >
          <CardHeader
            sx={{ p: 3 }}
            title="브랜드 상세"
            action={
              mode === DetailMode.UPDATE ? (
                <Box className={styles.buttons}>
                  <Button
                    children="취소하기"
                    size="large"
                    variant="outlined"
                    onClick={() => handleCancelUpdateBrand()}
                  />
                  <Button
                    children="저장하기"
                    size="large"
                    variant="contained"
                    onClick={handleSubmit(handleConfirmUpdateBrand)}
                  />
                </Box>
              ) : (
                <Button
                  children="수정하기"
                  startIcon={<PencilAlt />}
                  size="large"
                  variant="contained"
                  onClick={() => handleChangeMode(DetailMode.UPDATE)}
                />
              )
            }
          />
          <Divider />
          <CardContent>
            <BrandForm
              mode={mode}
              control={control}
              errors={errors}
              fileInfo={fileInfos?.[0]}
              comboBoxProvider={comboBoxProvider}
              comboBoxMd={comboBoxMd}
              comboBoxAmd={comboBoxAmd}
              onChangeComboProvider={handleChangeComboProvider}
              onChangeComboMd={handleChangeComboMd}
              onChangeComboAmd={handleChangeComboAmd}
              onChangeLogoFile={handleChangeLogoFile}
              onClearLogoFile={handleClearLogoFile}
            />
          </CardContent>
        </Box>
      </Card>
    </Layout>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  buttons: {
    '& button:last-child': { marginLeft: theme.spacing(1) },
  },
}));
