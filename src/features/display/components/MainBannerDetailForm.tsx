import { Button, Grid } from '@material-ui/core';
import { FormProvider } from 'react-hook-form';
import {
  DescriptionTextarea,
  LandingIdChecker,
  LandingSortNumInput,
  LandingTypeComboBox,
  MainBannerMediaUploadGuide,
  MediaUploader,
  PublishDatePicker,
  TitleTextarea,
} from '.';
import { UseMainBannerCreateService, UseMainBannerDetailService } from '../services';
import { MainBannerDetailFormFields } from '../types';

interface Props extends Partial<UseMainBannerDetailService>, Partial<UseMainBannerCreateService> {}

export const MainBannerDetailForm = ({
  getSubLandingTypeOptions,
  formMethods,
  fileInfos,
  mode,
  onCancel,
  landingInfo,
  onSubmit,
  getLandingTypeLabel,
  landingTypeOptions,
  currentTitleLength,
  currentDescriptionLength,
  onMainTypeChange,
}: Props) => {
  const handleCancel = (isDirty: boolean) => () => {
    onCancel(isDirty);
  };

  return (
    <FormProvider {...formMethods}>
      <form onSubmit={formMethods.handleSubmit<MainBannerDetailFormFields>(onSubmit)}>
        <Grid container direction="column" spacing={3} p="0 20px">
          <Grid item>
            <LandingTypeComboBox
              disabled={mode === 'DEFAULT'}
              landingTypeOptions={landingTypeOptions}
              handleMainTypeChangeCapture={onMainTypeChange}
              getSubLandingTypeOptions={getSubLandingTypeOptions}
            />
          </Grid>

          <Grid item>
            <LandingIdChecker
              disabled={mode === 'DEFAULT'}
              landingType={formMethods.watch('landingType.main')}
              landingInfo={landingInfo}
              getLandingTypeLabel={getLandingTypeLabel}
            />
          </Grid>

          <Grid item>
            <TitleTextarea
              disabled={mode === 'DEFAULT'}
              currentLength={currentTitleLength}
              maxLength={32}
              maxRows={2}
            />
          </Grid>

          <Grid item>
            <DescriptionTextarea
              disabled={mode === 'DEFAULT'}
              currentLength={currentDescriptionLength}
              maxLength={72}
              maxRows={3}
            />
          </Grid>

          <Grid item>
            <PublishDatePicker disabled={mode === 'DEFAULT'} />
          </Grid>

          <Grid item>
            <LandingSortNumInput disabled={mode === 'DEFAULT'} />
          </Grid>

          <Grid item>
            <MediaUploader
              showDeleteButton={mode === 'EDIT'}
              label="미디어(동영상/이미지)"
              fileInfos={fileInfos}
              guideContent={<MainBannerMediaUploadGuide />}
              error={formMethods?.formState?.errors?.mediaId}
            />
          </Grid>

          {mode === 'EDIT' && (
            <Grid item display="flex" justifyContent="center" gap="1rem">
              <Button variant="outlined" onClick={handleCancel(formMethods.formState.isDirty)}>
                취소
              </Button>

              <Button variant="contained" type="submit">
                저장
              </Button>
            </Grid>
          )}
        </Grid>
      </form>
    </FormProvider>
  );
};
