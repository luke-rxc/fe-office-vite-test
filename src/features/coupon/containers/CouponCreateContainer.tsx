import { Layout } from '@components/Layout';
import { Box, Button } from '@material-ui/core';
import { FormProvider } from 'react-hook-form';
import { CouponPolicyModalContainer } from '.';
import { CouponBaseInformation, Section, CouponPolicyInformation, UploadContents } from '../components';
import { CouponPageType } from '../constants';
import { useCouponService, useCouponPolicyItemService, useCouponPolicyLayoutService } from '../services';

export const CouponCreateContainer = () => {
  const { policyInfo } = useCouponPolicyItemService();
  const {
    form,
    allowAllInfo,
    showCouponPolicyButton,
    uploader,
    showroomComboList,
    handleChangeRange,
    handleRedirectCouponList,
  } = useCouponService({
    pageType: CouponPageType.CREATE,
    policyInfo,
    couponId: null,
  });
  const layoutService = useCouponPolicyLayoutService();

  return (
    <>
      <form onSubmit={form.handleSubmit}>
        <FormProvider {...form.formMethod}>
          <Layout
            title="쿠폰등록"
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
                등록
              </Button>,
            ]}
          >
            <>
              <Section title="쿠폰 기본 정보">
                <CouponBaseInformation
                  form={form}
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
                등록
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
