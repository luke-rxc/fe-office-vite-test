import styled from '@emotion/styled';
import { Box } from '@material-ui/core';
import { MainShortcutTitleType } from '../constants';
import { BannerInformationProps } from './BannerInformation';
import { UploadContents } from './UploadContents';

interface Props
  extends Omit<BannerInformationProps, 'primaryImageUploader' | 'primaryThumbnailImageUploader' | 'isVideoMediaType'> {
  title: string;
  titleType: MainShortcutTitleType;
}

export const BannerTitleView = ({ titleType, title, titleImageSvgUploader, titleImageLottieUploader }: Props) => {
  switch (titleType) {
    case MainShortcutTitleType.TEXT:
      return <TitleWrapperStyled>배너 노출 타이틀: {title}</TitleWrapperStyled>;

    case MainShortcutTitleType.SVG:
      return (
        <ImageWrapperStyled>
          <UploadContents
            name="titleImageSvgId"
            accept=".svg"
            requiredMessage="이미지(svg)를 선택해주세요"
            helperLabels={[
              [
                '이미지 업로드 가이드',
                '권장 이미지 사이즈: 1개 경우: 최대 가로 224px, 2개 경우: 최대 가로 96px',
                '이미지 파일 형식: svg',
              ],
            ]}
            {...titleImageSvgUploader}
          />
        </ImageWrapperStyled>
      );

    case MainShortcutTitleType.LOTTIE:
      return (
        <ImageWrapperStyled>
          <UploadContents
            name="titleImageLottieId"
            accept=".json"
            requiredMessage="이미지(lottie)를 선택해주세요"
            helperLabels={[
              [
                '이미지 업로드 가이드',
                '권장 이미지 사이즈: 1개 경우: 최대 가로 224px, 2개 경우: 최대 가로 96px',
                '이미지 파일 형식: Lottie',
              ],
            ]}
            {...titleImageLottieUploader}
          />
        </ImageWrapperStyled>
      );

    default:
      return null;
  }
};

const ImageWrapperStyled = styled(Box)`
  padding: 14px;
`;
const TitleWrapperStyled = styled(Box)`
  min-width: 300px;
  padding: 14px;
  margin-top: 10px;
  border: 1px solid #e8e8e8;
  border-radius: 10px;
  display: inline-block;
`;
