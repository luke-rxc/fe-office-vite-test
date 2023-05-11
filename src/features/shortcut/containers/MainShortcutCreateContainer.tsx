import { Layout } from '@components/Layout';
import { Button } from '@material-ui/core';
import { FormProvider } from 'react-hook-form';
import { BannerInformation, BaseInformation, Section } from '../components';
import { useMainShortcutCreateService } from '../services';

export const MainShortcutCreateContainer = () => {
  const {
    formMethod,
    formRef,
    landingInfo,
    handleSubmitCreate,
    handleClickSubmit,
    handleClickCancel,
    handleBlurLandingRefId,
    ...mainShortcutCreateServiceProps
  } = useMainShortcutCreateService();

  return (
    <Layout
      title="숏컷 배너 편성 콘텐츠 생성"
      actions={[
        <Button key="banner-cancel" variant="contained" color="inherit" size="large" onClick={handleClickCancel}>
          취소
        </Button>,
        <Button
          key="banner-create"
          variant="contained"
          color="primary"
          size="large"
          onClick={handleClickSubmit}
          sx={{ ml: '5px' }}
        >
          신규 생성하기
        </Button>,
      ]}
    >
      <FormProvider {...formMethod}>
        <form ref={formRef} onSubmit={handleSubmitCreate}>
          <Section title="기본 정보">
            <BaseInformation landingInfo={landingInfo} onBlurLandingRefId={handleBlurLandingRefId} />
          </Section>
          <Section title="배너 노출 정보">
            <BannerInformation {...mainShortcutCreateServiceProps} />
          </Section>
        </form>
      </FormProvider>
    </Layout>
  );
};
