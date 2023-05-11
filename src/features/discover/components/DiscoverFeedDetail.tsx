import { FormControlDatePickerLocal } from '@components/form';
import styled from '@emotion/styled';
import { Chip, Grid } from '@material-ui/core';
import { DiscoverFeedStatus } from '../constants';
import { DiscoverFeedDisplayGroupModel } from '../models';
import { DiscoverFeedFormField } from '../types';
import { FormLayout } from './FormLayout';

interface Props {
  item?: DiscoverFeedDisplayGroupModel;
  disabledEdit?: boolean;
}

/**
 * 디스커버 피드 상세 component
 */
export const DiscoverFeedDetail = ({ item, disabledEdit = false }: Props) => {
  return (
    <Grid container>
      {item && (
        <Grid item xs={12}>
          <FormLayout label="그룹 ID">
            <Chip label={`#${item.id}`} size="small" color="primary" />
          </FormLayout>
        </Grid>
      )}
      <Grid item xs={12}>
        <FormLayout label="전시 시작일" required>
          <FormControlDatePickerLocal<DiscoverFeedFormField>
            name="displayStartDate"
            inputProps={{
              min: new Date().toISOString().slice(0, 16),
            }}
            InputLabelProps={{
              shrink: true,
            }}
            disabled={disabledEdit}
            rules={{ required: '전시 시작일을 입력하세요' }}
          />
        </FormLayout>
      </Grid>
      {item && (
        <Grid item xs={6}>
          <FormLayout label="전시 상태" required>
            <ChipStyled label={item.statusText} status={item.status} />
          </FormLayout>
        </Grid>
      )}
    </Grid>
  );
};

const ChipStyled = styled(Chip)<{ status: DiscoverFeedStatus }>`
  font-weight: 'bold';
  background-color: ${({ status, theme }) =>
    status === DiscoverFeedStatus.OPEN ? theme.palette.common.white : '#ffffff00'};
  color: ${({ status, theme }) => (status === DiscoverFeedStatus.STOP ? theme.palette.grey[600] : '#4285F4')};
  border: ${({ status, theme }) => {
    switch (status) {
      case DiscoverFeedStatus.OPEN:
      case DiscoverFeedStatus.BEFORE_OPEN:
        return `1px solid #4285F4`;
      default:
        return `1px solid ${theme.palette.grey[600]}`;
    }
  }};
`;
