import { Box } from '@material-ui/core';
import { ControlledDatePicker, LabelWrapper } from '.';
import { MainBannerDetailFormFields, MainFeedDetailFormFields } from '../types';

interface Props {
  disabled?: boolean;
}

export const PublishDatePicker = ({ disabled = false }: Props) => {
  return (
    <LabelWrapper label="편성 시작/종료 시간" required>
      <Box display="flex" alignItems="baseline">
        <ControlledDatePicker<MainBannerDetailFormFields | MainFeedDetailFormFields>
          name="publishStartDate"
          dateTime
          disabled={disabled}
          rules={{ required: '편성 시작시간을 선택하세요' }}
        />
        -
        <ControlledDatePicker<MainBannerDetailFormFields | MainFeedDetailFormFields>
          name="publishEndDate"
          dateTime
          disabled={disabled}
          rules={{ required: '편성 종료시간을 선택하세요' }}
        />
      </Box>
    </LabelWrapper>
  );
};
