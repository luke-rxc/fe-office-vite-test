import { FormControlTextField } from '@components/form';
import { DiscoverKeywordCreateFormField } from '../types';
import { FormLayout } from './FormLayout';

export const DiscoverKeywordCreateForm = () => {
  return (
    <>
      <FormLayout label="키워드 타이틀" required>
        <FormControlTextField<DiscoverKeywordCreateFormField>
          name="keyword"
          sx={{ width: '400px' }}
          maxLength={12}
          showLength
          rules={{
            required: '키워드 타이틀을 입력하세요',
            maxLength: { message: '최대 12자까지 가능합니다.', value: 12 },
          }}
        />
      </FormLayout>
    </>
  );
};
