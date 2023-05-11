import styled from '@emotion/styled';
import { Box, Grid } from '@material-ui/core';
import { FormLayout } from './FormLayout';
import { useMemo } from 'react';
import { FormControlDatePickerLocal, FormControlSelect, FormControlTextField } from '@components/form';
import { MainShortcutFormField } from '../types';
import {
  MainShortcutLandingSubTypeLabel,
  MainShortcutLandingSubTypeOptions,
  MainShortcutLandingMainTypeOptions,
} from '../constants';
import { useFormContext } from 'react-hook-form';
import { ReturnTypeUseMainShortcutCreateService } from '../services';

interface Props {
  landingInfo: ReturnTypeUseMainShortcutCreateService['landingInfo'];
  onBlurLandingRefId: ReturnTypeUseMainShortcutCreateService['handleBlurLandingRefId'];
}

export const BaseInformation = ({ landingInfo, onBlurLandingRefId: handleBlurLandingRefId }: Props) => {
  const { watch } = useFormContext<MainShortcutFormField>();
  const [landingType, publishStartDate] = watch(['landingType', 'publishStartDate']);

  const landingSubTypeOption = useMemo(() => {
    const filteredOptions = MainShortcutLandingSubTypeOptions.filter((item) => item.parent === landingType);

    if (filteredOptions.length === 0) {
      return null;
    }

    return filteredOptions.map((option) => {
      return {
        label: MainShortcutLandingSubTypeLabel[option.value],
        value: option.value,
      };
    });
  }, [landingType]);

  return (
    <Grid container direction="row" justifyContent="flex-start" alignItems="flex-start">
      <GridStyled item md={6}>
        <FormLayout label="랜딩타입" required>
          <FormControlSelect<MainShortcutFormField>
            name="landingType"
            sx={{ width: '400px' }}
            options={MainShortcutLandingMainTypeOptions}
            rules={{ required: '랜딩타입을 선택하세요' }}
            placeholder="랜딩타입을 선택하세요"
          />
        </FormLayout>
      </GridStyled>
      <GridStyled item md={6}>
        {landingSubTypeOption && (
          <FormLayout label="랜딩타입(상세)" required>
            <FormControlSelect<MainShortcutFormField>
              name="landingSubType"
              sx={{ width: '400px' }}
              options={landingSubTypeOption}
              rules={{ required: '랜딩타입(상세)을 선택하세요' }}
              placeholder="랜딩타입(상세)을 선택하세요"
            />
          </FormLayout>
        )}
      </GridStyled>

      <GridStyled item md={12}>
        <FormLayout label="랜딩 상세 정보" required>
          <FormControlInputWrapperStyled>
            <FormControlTextField<MainShortcutFormField>
              name="referenceId"
              sx={{ width: '400px' }}
              inputProps={{ maxLength: 10 }}
              rules={{
                required: '랜딩 상세 정보를 입력하세요',
                pattern: { value: /^[0-9]{1,10}$/, message: '숫자만 입력하세요' },
                validate: {
                  value: () => (landingInfo?.success ? true : landingInfo?.label ?? ''),
                },
              }}
              placeholder="랜딩 상세 정보를 입력하세요"
              onBlur={handleBlurLandingRefId}
            />
          </FormControlInputWrapperStyled>
          {landingInfo?.success && <LandingInfoLabelStyled>{landingInfo.label}</LandingInfoLabelStyled>}
        </FormLayout>
      </GridStyled>

      <GridStyled item md={12}>
        <FormLayout label="편성 우선순위" required>
          <FormControlInputWrapperStyled>
            <FormControlTextField<MainShortcutFormField>
              name="sortNum"
              sx={{ width: '400px' }}
              inputProps={{ maxLength: 5 }}
              rules={{
                required: '편성 우선순위를 입력하세요',
                pattern: { value: /^[0-9]{1,10}$/, message: '숫자만 입력하세요' },
              }}
              placeholder="편성 우선순위를 입력하세요"
            />
          </FormControlInputWrapperStyled>
        </FormLayout>
      </GridStyled>

      <GridStyled item md={12}>
        <FormLayout label="편성 시작/종료 시간" required>
          <Grid container spacing={1} alignItems="flex-start">
            <Grid item xs={4}>
              <FormControlDatePickerLocal<MainShortcutFormField>
                name="publishStartDate"
                label="편성 시간"
                fullWidth
                inputProps={{
                  min: new Date().toISOString().slice(0, 16),
                }}
                InputLabelProps={{
                  shrink: true,
                }}
                rules={{ required: '편성 시간을 선택하세요' }}
              />
            </Grid>
            <Grid item sx={{ display: 'flex', alignItems: 'center', lineHeight: '56px' }}>
              ~
            </Grid>
            <Grid item xs={4}>
              <FormControlDatePickerLocal<MainShortcutFormField>
                name="publishEndDate"
                label="종료 시간"
                fullWidth
                inputProps={{
                  min: publishStartDate
                    ? new Date(publishStartDate).toISOString().slice(0, 16)
                    : new Date().toISOString().slice(0, 16),
                }}
                InputLabelProps={{
                  shrink: true,
                }}
                rules={{ required: '종료 시간을 선택하세요' }}
              />
            </Grid>
          </Grid>
        </FormLayout>
      </GridStyled>

      <GridStyled item md={12}>
        <FormLayout label="타이틀" required>
          <FormControlTextField<MainShortcutFormField>
            name="title"
            showLength
            maxLength={10}
            sx={{ width: '400px' }}
            rules={{ required: '타이틀을 입력하세요', maxLength: { message: '최대 10자까지 가능합니다', value: 10 } }}
            placeholder={`타이틀을 입력하세요`}
          />
        </FormLayout>
      </GridStyled>
    </Grid>
  );
};

const GridStyled = styled(Grid)`
  margin-bottom: 10px;
`;

const LandingInfoLabelStyled = styled(Box)`
  margin: 3px 14px 0;
  color: ${({ theme }) => theme.palette.text.secondary};
  font-size: 0.75rem;
`;

const FormControlInputWrapperStyled = styled(Box)`
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
`;
