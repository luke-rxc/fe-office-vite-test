import { Layout } from '@components/Layout';
import { Box, Button } from '@material-ui/core';
import { FormProvider } from 'react-hook-form';
import { CouponPolicyModalContainer } from '.';
import { CouponBaseInformation, Section, CouponPolicyInformation, UploadContents } from '../components';
import { CouponPageType } from '../constants';
import { useCouponService, useCouponPolicyItemService, useCouponPolicyLayoutService } from '../services';

interface Props {
  couponId: number;
}

export const CouponModifyContainer = ({ couponId }: Props) => {
  const { policyInfo } = useCouponPolicyItemService();
  const {
    form,
    allowAllInfo,
    showCouponPolicyButton,
    isDownloadableCoupon,
    uploader,
    showroomComboList,
    handleChangeRange,
    handleRedirectCouponList,
  } = useCouponService({
    pageType: CouponPageType.MODIFY,
    policyInfo,
    couponId,
  });
  const layoutService = useCouponPolicyLayoutService();
  return (
    <>
      <form onSubmit={form.handleSubmit}>
        <FormProvider {...form.formMethod}>
          <Layout
            title="쿠폰수정"
            actions={[
              <Button
                key="cancel"
                type="button"
                variant="contained"
                color="secondary"
                onClick={handleRedirectCouponList}
              >
                취소
              </Button>,
              <Button key="save" type="submit" variant="contained" color="primary" sx={{ ml: '5px' }}>
                수정
              </Button>,
            ]}
          >
            <>
              <Section title="쿠폰 기본 정보">
                <CouponBaseInformation
                  form={form}
                  isDownloadableCoupon={isDownloadableCoupon}
                  isModify
                  showroomComboList={showroomComboList}
                  onChangeRange={handleChangeRange}
                  uploaderComponent={
                    <UploadContents
                      contents={uploader.fileInfos}
                      error={uploader.imageError}
                      onChangeUploadFile={uploader.handleChangeUploadFile}
                      onRemoveUploadFile={uploader.handleRemoveUploadFile}
                    />
                  }
                />
              </Section>
              <Section
                title="쿠폰 적용 대상"
                action={
                  showCouponPolicyButton ? (
                    <Button
                      key="save"
                      size="small"
                      variant="outlined"
                      sx={{ ml: '20px' }}
                      onClick={layoutService.handleModalOpen}
                    >
                      수정
                    </Button>
                  ) : null
                }
              >
                <CouponPolicyInformation allowAllInfo={allowAllInfo} policyInfo={policyInfo} />
              </Section>
            </>
            <Box p={2} display="flex" justifyContent="center" alignContent="center" bgcolor="#ffffff">
              <Button
                type="button"
                variant="contained"
                color="secondary"
                onClick={handleRedirectCouponList}
                sx={{ marginRight: '10px' }}
              >
                취소
              </Button>
              <Button size="large" type="submit" color="primary" variant="contained">
                수정
              </Button>
            </Box>
          </Layout>
        </FormProvider>
      </form>
      {layoutService.modalOpen && (
        <CouponPolicyModalContainer allowAllInfo={allowAllInfo} policyInfo={policyInfo} layoutInfo={layoutService} />
      )}
    </>
  );
};
