import styled from '@emotion/styled';
import { Chip, Theme } from '@material-ui/core';
import { MainBannerStatusLabels } from '../constants';

interface Props {
  label: string;
}

export const StatusChip = ({ label }: Props) => {
  return <ChipStyled label={label} variant="outlined" />;
};

const ChipStyled = styled(Chip)(({ theme, label }: { theme?: Theme; label: string }) => {
  const palette = {
    '공개 예정': theme.palette.success.main,
    공개중: theme.palette.primary.main,
    '편성 종료': theme.palette.text.primary,
    '공개 중지': theme.palette.error.main,
    '편성 가능': '#67ad5c',
    '편성 불가': theme.palette.error.main,
  } as Record<MainBannerStatusLabels, string>;

  return { color: palette[label], borderColor: palette[label] };
});
