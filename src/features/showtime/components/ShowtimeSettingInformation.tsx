import { FormControlRadioGroup } from '@components/form';
import { TOption } from '@components/Select';
import styled from '@emotion/styled';
import { Box, Grid } from '@material-ui/core';
import { FormControlTextField, FormControlInput, FormControlSelect } from '.';
import { OpenStatus, OpenStatusLabel, PIPMode, PIPModeLabel } from '../constants';
import { ShowtimeContentsItemFormField } from '../types';
import { FormLayout } from './FormLayout';

const OpenStatusOptions: Array<TOption> = [
  { label: OpenStatusLabel[OpenStatus.PRIVATE], value: OpenStatus.PRIVATE },
  { label: OpenStatusLabel[OpenStatus.DRAFT], value: OpenStatus.DRAFT },
  { label: OpenStatusLabel[OpenStatus.PUBLIC], value: OpenStatus.PUBLIC },
];

const PipModeOptions = [
  { value: PIPMode.ON, label: PIPModeLabel[PIPMode.ON] },
  { value: PIPMode.OFF, label: PIPModeLabel[PIPMode.OFF] },
];

export const ShowtimeSettingInformation = () => {
  return (
    <Grid container direction="row" justifyContent="flex-start" alignItems="flex-start">
      <GridStyled item md={6} xs={12}>
        <FormLayout label="라이브 시작일시" required>
          <FormControlTextField<ShowtimeContentsItemFormField>
            name="liveStartDate"
            type="datetime-local"
            InputLabelProps={{
              shrink: true,
            }}
            rules={{ required: '라이브 시작일시를 선택하세요' }}
          />
        </FormLayout>
      </GridStyled>
      <GridStyled item md={6} xs={12}>
        <FormLayout label="방송길이" required>
          <FormControlInput<ShowtimeContentsItemFormField>
            name="livePlayTime"
            type="number"
            endAdornment="분"
            inputProps={{ min: 0 }}
            rules={{ required: '방송길이를 입력하세요' }}
          />
        </FormLayout>
      </GridStyled>
      <GridStyled item md={6} xs={12} sx={{ height: '140px' }}>
        <FormLayout label="공개상태" required>
          <FormControlSelect<ShowtimeContentsItemFormField>
            name="openStatus"
            options={OpenStatusOptions}
            sx={{ width: '300px' }}
            rules={{ required: '공개상태를 선택하세요' }}
          />
        </FormLayout>
      </GridStyled>
      <GridStyled item md={6} xs={12}>
        <FormLayout label="OS PIP 모드 설정" required>
          <FormControlRadioGroup<ShowtimeContentsItemFormField>
            name="pipMode"
            options={PipModeOptions}
            sx={{ width: '300px' }}
            rules={{ required: 'OS PIP 모드 설정을 선택하세요' }}
          />
          <Box sx={{ width: '300px' }}>
            * PIP 모드로 시청할 경우 해당 시청자의 라이브 접속여부를 알 수 없어 미접속으로 처리됩니다.라이브 접속여부가
            중요한 방송에서는 설정을 OFF 해 주세요 예) 와우드로우와 같은 추첨방송
          </Box>
        </FormLayout>
      </GridStyled>
    </Grid>
  );
};

const GridStyled = styled(Grid)`
  margin-bottom: 10px;
  align-items: center;
`;
