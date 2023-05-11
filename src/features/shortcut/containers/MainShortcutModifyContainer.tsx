import { Layout } from '@components/Layout';
import { Button } from '@material-ui/core';
import { FormProvider } from 'react-hook-form';
import { Section, BaseInformation, BannerInformation } from '../components';
import { useMainShortcutModifyService } from '../services';

interface Props {
  shortcutId: string;
}

export const MainShortcutModifyContainer = ({ shortcutId }: Props) => {
  const {
    formMethod,
    formRef,
    landingInfo,
    handleSubmitModify,
    handleClickSubmit,
    handleClickCancel,
    handleBlurLandingRefId,
    ...mainShortcutModifyServiceProps
  } = useMainShortcutModifyService({ shortcutId });

  return (
    <Layout
      title="숏컷 배너 편성 콘텐츠 상세"
      actions={[
        <Button key="banner-cancel" variant="contained" color="inherit" size="large" onClick={handleClickCancel}>
          취소
        </Button>,
        <Button
          key="banner-save"
          variant="contained"
          color="primary"
          size="large"
          onClick={handleClickSubmit}
          sx={{ ml: '5px' }}
        >
          저장
        </Button>,
      ]}
    >
      <FormProvider {...formMethod}>
        <form ref={formRef} onSubmit={handleSubmitModify}>
          <Section title="기본 정보">
            <BaseInformation landingInfo={landingInfo} onBlurLandingRefId={handleBlurLandingRefId} />
          </Section>
          <Section title="배너 노출 정보">
            <BannerInformation {...mainShortcutModifyServiceProps} />
          </Section>
        </form>
      </FormProvider>
    </Layout>
  );
};
