import styled from '@emotion/styled';
import { Grid } from '@material-ui/core';
import { FormLayout } from './FormLayout';
import { FormControlRadioGroup } from '@components/form';
import { MainShortcutFormField } from '../types';
import { useFormContext } from 'react-hook-form';
import {
  MainShortcutDescriptionType,
  MainShortcutDescriptionTypeOptions,
  MainShortcutTitleType,
  MainShortcutTitleTypeOptions,
  MainShortcutVideoPlayTypeOptions,
} from '../constants';
import { BannerTitleView } from './BannerTitleView';
import { BannerDescriptionView } from './BannerDescriptionView';
import { ReturnTypeUseImageUploader } from '../hooks';
import { UploadContents } from './UploadContents';

export interface BannerInformationProps {
  primaryImageUploader: ReturnTypeUseImageUploader;
  primaryThumbnailImageUploader: ReturnTypeUseImageUploader;
  titleImageSvgUploader: ReturnTypeUseImageUploader;
  titleImageLottieUploader: ReturnTypeUseImageUploader;
  isVideoMediaType: boolean;
}

export const BannerInformation = ({
  primaryImageUploader,
  primaryThumbnailImageUploader,
  isVideoMediaType,
  ...props
}: BannerInformationProps) => {
  const { watch } = useFormContext<MainShortcutFormField>();
  const [titleType, title, descriptionType] = watch(['titleType', 'title', 'descriptionType']);

  return (
    <Grid container direction="row" justifyContent="flex-start" alignItems="flex-start">
      <GridStyled item md={12} xs={12}>
        <FormLayout label="배너 노출 타이틀" required>
          <FormControlRadioGroup<MainShortcutFormField> row name="titleType" options={MainShortcutTitleTypeOptions} />
          <BannerTitleView title={title} titleType={titleType as MainShortcutTitleType} {...props} />
        </FormLayout>
      </GridStyled>

      <GridStyled item md={12} xs={12}>
        <FormLayout label="서브 타이틀" required>
          <FormControlRadioGroup<MainShortcutFormField>
            row
            name="descriptionType"
            options={MainShortcutDescriptionTypeOptions}
          />
          <BannerDescriptionView descriptionType={descriptionType as MainShortcutDescriptionType} />
        </FormLayout>
      </GridStyled>

      <GridStyled item md={12} xs={12}>
        <FormLayout label="미디어(백그라운드)" required>
          <UploadContents
            name="mediaId"
            accept="image/png, image/jpeg, video/mp4"
            requiredMessage="미디어(동영상/이미지)를 선택해주세요"
            {...primaryImageUploader}
          />
        </FormLayout>
      </GridStyled>

      {isVideoMediaType && (
        <>
          <GridStyled item md={12} xs={12}>
            <FormLayout label="동영상 재생 방식" required>
              <FormControlRadioGroup<MainShortcutFormField>
                row
                name="videoRepeatType"
                options={MainShortcutVideoPlayTypeOptions}
              />
            </FormLayout>
          </GridStyled>

          <GridStyled item md={12} xs={12}>
            <FormLayout label="동영상 썸네일" required>
              <UploadContents
                name="mediaThumbnailId"
                accept="image/png, image/jpeg"
                requiredMessage="동영상 썸네일을 선택해주세요"
                helperLabels={[
                  ['이미지 업로드 가이드', '권장 이미지 사이즈: 1080 X 288 px', '이미지 파일 형식: jpg, png'],
                ]}
                {...primaryThumbnailImageUploader}
              />
            </FormLayout>
          </GridStyled>
        </>
      )}
    </Grid>
  );
};

const GridStyled = styled(Grid)`
  margin-bottom: 10px;
`;
