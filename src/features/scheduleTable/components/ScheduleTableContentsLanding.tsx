import { FormControlRadioGroup, FormControlTextArea, FormControlTextField } from '@components/form';
import styled from '@emotion/styled';
import { Grid } from '@material-ui/core';
import { useFormContext } from 'react-hook-form';
import { LandingTypeLabel, LandingType } from '../constants';
import { ScheduleModifyForm, OptionModel } from '../types';

/**
 * 랜딩 타입 옵션
 */
const landingTypeOptions: Array<OptionModel> = [
  { label: LandingTypeLabel[LandingType.MODAL], value: LandingType.MODAL },
  { label: LandingTypeLabel[LandingType.STORY], value: LandingType.STORY },
];

export const ScheduleTableContentsLanding = () => {
  const { watch } = useFormContext<ScheduleModifyForm>();
  const isModalLandingType = watch('landingType') === LandingType.MODAL;

  return (
    <>
      <FormControlRadioGroup<ScheduleModifyForm> name="landingType" row options={landingTypeOptions} sizes={[460]} />
      <Grid container mt="10px">
        <LabelGridStyled item>설명</LabelGridStyled>
        <Grid item>
          <FormControlTextArea<ScheduleModifyForm>
            name="benefits"
            minRows={4}
            width="340px"
            disabled={!isModalLandingType}
            readOnly={!isModalLandingType}
            rules={{ required: isModalLandingType ? '설명을 입력하세요' : false }}
          />
        </Grid>
        <LabelGridStyled item sx={{ ml: '90px' }}>
          콘텐츠 ID
        </LabelGridStyled>
        <Grid item>
          <FormControlTextField<ScheduleModifyForm>
            name="landingStoryId"
            sx={{ width: '340px' }}
            disabled={isModalLandingType}
            rules={{ required: !isModalLandingType ? '편성 제목을 입력하세요' : false }}
          />
        </Grid>
      </Grid>
    </>
  );
};

const LabelGridStyled = styled(Grid)`
  font-weight: 500;
  padding-bottom: 20px;
  margin-right: 10px;
`;
