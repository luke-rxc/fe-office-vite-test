import { FormControlCheckbox, FormControlInput, FormControlRadioGroup, FormControlTextField } from '@components/form';
import styled from '@emotion/styled';
import { Box, Grid } from '@material-ui/core';
import { UploadFileType } from '@services/useFileUploader';
import { ReactNode } from 'react';
import { useFormContext } from 'react-hook-form';
import { RaffleEventDrawConditionForm, RaffleEventDrawConditionFormProps } from '.';
import {
  allowDuplicateWinnerTypeOptions,
  EnterDrawConditionType,
  enterDrawConditionTypeOptions,
  winnerConditionTypeOptions,
} from '../constants';
import { RaffleEventDetailFormField } from '../types';
import { FormLayout } from './FormLayout';

interface Props extends RaffleEventDrawConditionFormProps {
  show: boolean;
  uploadComponent: ReactNode;
  diabledAllowDuplicateWinner: boolean;
}

export const RaffleEventTimesItemForm = ({
  show,
  isEdit,
  itemIndex,
  uploadComponent,
  diabledAllowDuplicateWinner,
  ...props
}: Props) => {
  const { getValues } = useFormContext<RaffleEventDetailFormField>();
  const [enterDrawConditionType, fileType] = getValues([
    `itemList.${itemIndex}.enterDrawConditionType`,
    `itemList.${itemIndex}.fileType`,
  ]);
  const isNoneEnterDrawConditionType = enterDrawConditionType === EnterDrawConditionType.NONE;
  // TODO: 크로마키 동영상 처리 전까지 비활성화 처리 (23.2.8)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const isVideoFileType = fileType === UploadFileType.VIDEO;

  const validateWinnerCount = (value: string) => {
    if (Number(value) <= 0) {
      return '당첨자 수는 1명 이상 설정해야 합니다.';
    }

    return null;
  };

  const validateLandingUrl = (value: string) => {
    if (value && !value.match(/^(http(s)?:\/\/)/)) {
      return 'http:// 혹은 https://를 포함한 전체 url을 입력해 주세요.';
    }

    return null;
  };

  return (
    <Grid container display={show ? 'grid' : 'none'}>
      <Grid item xs={12}>
        <FormLayout label="사전 응모 조건" required>
          <FormControlRadioGroup<RaffleEventDetailFormField>
            name={`itemList.${itemIndex}.enterDrawConditionType`}
            rules={{ required: true }}
            options={enterDrawConditionTypeOptions}
            disabled={!isEdit}
          />
        </FormLayout>
      </Grid>
      <RaffleEventDrawConditionForm itemIndex={itemIndex} isEdit={isEdit} {...props} />
      <Grid item xs={12}>
        <FormLayout label="추가 당첨 조건" required>
          <FormControlRadioGroup<RaffleEventDetailFormField>
            name={`itemList.${itemIndex}.winnerConditionType`}
            rules={{ required: true }}
            options={winnerConditionTypeOptions}
            disabled={isNoneEnterDrawConditionType || !isEdit}
          />
        </FormLayout>
      </Grid>
      <Grid item xs={12}>
        <FormLayout label="중복 당첨 설정" required>
          <FormControlRadioGroup<RaffleEventDetailFormField>
            name={`itemList.${itemIndex}.allowDuplicateWinner`}
            rules={{ required: true }}
            options={allowDuplicateWinnerTypeOptions}
            disabled={!isEdit || diabledAllowDuplicateWinner}
          />
        </FormLayout>
      </Grid>
      <GridStyled item xs={6}>
        <FormLayout label="당첨자 수 설정" required>
          <FormControlInput<RaffleEventDetailFormField>
            name={`itemList.${itemIndex}.winnerCount`}
            type="number"
            inputProps={{ min: 0, onWheel: (e) => e.target instanceof HTMLElement && e.target.blur() }}
            rules={{ required: true, validate: validateWinnerCount }}
            size="small"
            disabled={!isEdit}
          />
        </FormLayout>
      </GridStyled>
      <Grid item md={12} xs={12}>
        <FormLayout label="경품 정보 등록(이미지/동영상)">{uploadComponent}</FormLayout>
      </Grid>

      <Grid item md={12} xs={12}>
        <FormLayout label="동영상 크로마키 여부">
          <FormControlCheckbox<RaffleEventDetailFormField>
            name={`itemList.${itemIndex}.mediaChromakey`}
            disabled
            // disabled={!isEdit || !isVideoFileType} // TODO: 크로마키 동영상 처리 전까지 비활성화 처리 (23.2.8)
          />
        </FormLayout>
      </Grid>
      <Grid item xs={12}>
        <FormLayout label="당첨자 알림 발송 랜딩 설정" required>
          <Grid container direction="column" spacing={2}>
            <Grid item>
              <FormControlTextField<RaffleEventDetailFormField>
                name={`itemList.${itemIndex}.landingUrl`}
                size="small"
                placeholder="랜딩 URL을 입력하세요"
                sx={{ width: '700px' }}
                rules={{ validate: validateLandingUrl, required: '랜딩 URL을 입력하세요' }}
                disabled={!isEdit}
              />
            </Grid>
            <Grid item>
              <Box>- 당첨자에게 추가 정보 수집이 필요한 경우 별도 설문지 링크를 삽입해주세요</Box>
            </Grid>
          </Grid>
        </FormLayout>
      </Grid>
    </Grid>
  );
};

const GridStyled = styled(Grid)`
  input[type='number']::-webkit-outer-spin-button,
  input[type='number']::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
`;
