import { FormControlTextField } from '@components/form';
import { MainShortcutDescriptionType } from '../constants';
import { MainShortcutFormField } from '../types';

interface Props {
  descriptionType: MainShortcutDescriptionType;
}

export const BannerDescriptionView = ({ descriptionType }: Props) => {
  switch (descriptionType) {
    case MainShortcutDescriptionType.TEXT:
      return (
        <FormControlTextField<MainShortcutFormField>
          name="description"
          showLength
          maxLength={12}
          sx={{ width: '400px' }}
          rules={{
            required: '서브 타이틀을 입력하세요',
            maxLength: { message: '최대 12자까지 가능합니다', value: 12 },
          }}
          placeholder={`서브 타이틀을 입력하세요`}
        />
      );

    default:
      return null;
  }
};
