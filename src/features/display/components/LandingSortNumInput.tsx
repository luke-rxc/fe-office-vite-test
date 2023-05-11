import { ControlledText, LabelWrapper } from '.';
import { MainBannerDetailFormFields, MainFeedDetailFormFields } from '../types';

interface Props {
  disabled?: boolean;
}

export const LandingSortNumInput = ({ disabled = false }: Props) => {
  return (
    <LabelWrapper label="편성 우선순위" required>
      <ControlledText<MainBannerDetailFormFields | MainFeedDetailFormFields>
        label="편성 우선순위"
        name="sortNum"
        type="number"
        sx={{ width: '100%' }}
        disabled={disabled}
        rules={{ required: '편성 우선순위를 입력하세요' }}
      />
    </LabelWrapper>
  );
};
