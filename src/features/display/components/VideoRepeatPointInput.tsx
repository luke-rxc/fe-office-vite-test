import { Box } from '@material-ui/core';
import { ControlledText, LabelWrapper } from '.';
import { MainBannerDetailFormFields, MainFeedDetailFormFields } from '../types';

interface Props {
  disabled?: boolean;
}

export const VideoRepeatPointInput = ({ disabled = false }: Props) => {
  return (
    <LabelWrapper label="동영상 반복 재생 시점" required={false}>
      <Box
        display="flex"
        alignItems="center"
        sx={{
          width: '100%',
        }}
      >
        <ControlledText<MainBannerDetailFormFields | MainFeedDetailFormFields>
          label="동영상 반복 재생 시점"
          name="videoRepeatPoint"
          type="number"
          sx={{
            marginRight: '1rem',
          }}
          disabled={disabled}
        />
        초
      </Box>
    </LabelWrapper>
  );
};
