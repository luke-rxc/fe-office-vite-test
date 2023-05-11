import { FormControlAutoComplete, FormControlTextField } from '@components/form';
import { Grid } from '@material-ui/core';
import { Link } from 'react-router-dom';
import { LiveComboItemModel } from '../models';
import { ReturnTypeUseRaffleEventDetailService } from '../services';
import { RaffleEventDetailFormField } from '../types';
import { FormLayout } from './FormLayout';

interface Props {
  isEdit: boolean;
  liveId: ReturnTypeUseRaffleEventDetailService['liveId'];
  raffleEventDetailItem: ReturnTypeUseRaffleEventDetailService['raffleEventDetailItem'];
  liveComboList: ReturnTypeUseRaffleEventDetailService['liveComboList'];
}

export const RaffleEventBaseInformation = ({ isEdit, raffleEventDetailItem, liveId, liveComboList = [] }: Props) => {
  if (!raffleEventDetailItem) {
    return null;
  }

  const { id } = raffleEventDetailItem;

  return (
    <Grid container>
      <Grid item xs={6}>
        <FormLayout label="이벤트 명">
          <FormControlTextField<RaffleEventDetailFormField>
            name="name"
            rules={{
              required: '이벤트 명을 입력하세요',
              maxLength: { message: '최대 16자까지 가능합니다.', value: 16 },
            }}
            disabled={!isEdit}
            showLength
            maxLength={16}
            sx={{ width: '400px' }}
          />
        </FormLayout>
      </Grid>
      <Grid item xs={6}>
        <FormLayout label="이벤트 ID">{id}</FormLayout>
      </Grid>
      <Grid item xs={6}>
        <FormLayout label="라이브 명" required>
          <FormControlAutoComplete<RaffleEventDetailFormField>
            name="liveItem"
            options={liveComboList}
            getOptionLabel={({ label, value }: LiveComboItemModel) => `${label} (${value})`}
            isOptionEqualToValue={(v: LiveComboItemModel, o: LiveComboItemModel) => v?.value === o?.value}
            rules={{
              required: '라이브를 선택하세요',
            }}
            disabled={!isEdit}
            sx={{ width: '400px' }}
          />
        </FormLayout>
      </Grid>
      <Grid item xs={6}>
        <FormLayout label="라이브 콘텐츠 ID">
          <Link to={`/showtime/contents/${liveId}`} target="_blank" rel="noopener">
            {liveId}
          </Link>
        </FormLayout>
      </Grid>
    </Grid>
  );
};
