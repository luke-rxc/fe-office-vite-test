import { FormControlSelect, FormControlTextField } from '@components/form';
import { Grid } from '@material-ui/core';
import { DiscoverKeywordStatusOptions } from '../constants';
import { DiscoverKeywordModifyFormField } from '../types';
import { FormLayout } from './FormLayout';

interface Props {
  isEdit: boolean;
}

export const DiscoverKeywordModifyForm = ({ isEdit }: Props) => {
  return (
    <Grid container>
      <Grid item xs={6}>
        <FormLayout label="키워드 타이틀" required>
          <FormControlTextField<DiscoverKeywordModifyFormField>
            name="keyword"
            sx={{ width: '400px' }}
            maxLength={12}
            showLength
            disabled={!isEdit}
            rules={{
              required: '키워드 타이틀을 입력하세요',
              maxLength: { message: '최대 12자까지 가능합니다.', value: 12 },
            }}
          />
        </FormLayout>
      </Grid>
      <Grid item xs={6}>
        <FormLayout label="공개 여부" required>
          <FormControlSelect<DiscoverKeywordModifyFormField>
            name="status"
            options={DiscoverKeywordStatusOptions}
            rules={{ required: '공개 여부를 입력하세요' }}
            disabled={!isEdit}
            sx={{ width: '200px' }}
          />
        </FormLayout>
      </Grid>
    </Grid>
  );
};
