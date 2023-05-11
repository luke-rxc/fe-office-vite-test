import { FormControlAutoComplete, FormControlTextField } from '@components/form';
import { LiveComboItemModel } from '../models';
import { RaffleEventCreateFormField } from '../types';

import { FormLayout } from './FormLayout';

interface Props {
  liveComboList: Array<LiveComboItemModel>;
}

/**
 * 래플 이벤트 생성 form component
 */
export const RaffleEventCreateForm = ({ liveComboList }: Props) => {
  const validateEventName = (value: string) => {
    if (value.trim().length === 0) {
      return '이벤트명을 입력하세요(공백만 입력불가)';
    }

    return null;
  };

  return (
    <>
      <FormLayout label="이벤트명" required>
        <FormControlTextField<RaffleEventCreateFormField>
          name="eventName"
          maxLength={16}
          showLength
          rules={{
            required: '이벤트명을 입력하세요',
            maxLength: { message: '최대 16자까지 가능합니다.', value: 16 },
            validate: validateEventName,
          }}
          sx={{ width: '400px' }}
        />
      </FormLayout>
      <FormLayout label="라이브 콘텐츠" required>
        <FormControlAutoComplete<RaffleEventCreateFormField>
          name="liveItem"
          options={liveComboList}
          getOptionLabel={({ label, value }: LiveComboItemModel) => `${label} (${value})`}
          isOptionEqualToValue={(v: LiveComboItemModel, o: LiveComboItemModel) => v?.value === o?.value}
          placeholder="라이브 콘텐츠 선택"
          rules={{ required: '라이브 콘텐츠를 선택하세요.' }}
          sx={{ width: '400px' }}
        />
      </FormLayout>
    </>
  );
};
