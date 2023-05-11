import { FormControlAutoComplete, FormControlRadioGroup, FormControlTextField } from '@components/form';
import styled from '@emotion/styled';
import { Box, Grid } from '@material-ui/core';
import { useFormContext } from 'react-hook-form';
import { EnterDrawPeriodType, enterDrawPeriodTypeOptions } from '../constants';
import { RaffleEventDetailFormField } from '../types';
import { FormLayout } from './FormLayout';
import { RaffleEventDrawConditionFormProps } from './RaffleEventDrawConditionForm';

type Props = Omit<RaffleEventDrawConditionFormProps, 'onOpenRaffleEventModel'>;

export const RaffleEventDrawConditionShowroomFollowerForm = ({
  itemIndex,
  isEdit,
  hostShowroomInfo,
  showroomOptions,
}: Props) => {
  const { watch } = useFormContext<RaffleEventDetailFormField>();

  const [showRoomIdList, enterDrawPeriod] = watch([
    `itemList.${itemIndex}.showRoomIdList`,
    `itemList.${itemIndex}.enterDrawPeriod`,
  ]);
  const isEditableEnterDrawDate = enterDrawPeriod === EnterDrawPeriodType.SETUP;

  return (
    <WrapperStyled>
      <Grid container sx={{ border: '1px solid #e5e5e5', borderRadius: '10px', padding: '10px 20px' }}>
        <Grid item xs={12}>
          <FormLayout label="라이브 호스트 쇼룸" required>
            {hostShowroomInfo}
          </FormLayout>
        </Grid>
        <Grid item xs={12}>
          <FormLayout label="추가 쇼룸 설정">
            <FormControlAutoComplete<RaffleEventDetailFormField>
              name={`itemList.${itemIndex}.showRoomIdList`}
              multiple
              options={showroomOptions}
              getOptionLabel={({ label, value }: any) => `${label} (${value})`}
              isOptionEqualToValue={(v: any, o: any) => v?.value === o?.value}
              placeholder="추가 쇼룸 선택 (최대 10개)"
              disabled={!isEdit}
              isLimit={(showRoomIdList || []).length >= 10}
              sx={{ maxWidth: '780px' }}
            />
          </FormLayout>
        </Grid>
        <RowGrid item sm={12}>
          <FormLayout label="사전 응모 기간설정" required>
            <ItemsWrapper>
              <FormControlRadioGroup<RaffleEventDetailFormField>
                name={`itemList.${itemIndex}.enterDrawPeriod`}
                options={enterDrawPeriodTypeOptions}
                disabled={!isEdit}
              />

              <IssuePeriodWrapperStyled>
                <FormControlTextField<RaffleEventDetailFormField>
                  name={`itemList.${itemIndex}.enterDrawStartDate`}
                  label="응모 기간 시작일"
                  type="datetime-local"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  rules={{
                    required: isEditableEnterDrawDate ? '응모 기간 시작일을 입력해주세요.' : false,
                  }}
                  disabled={!(isEdit && isEditableEnterDrawDate)}
                />
                <FormControlTextField<RaffleEventDetailFormField>
                  name={`itemList.${itemIndex}.enterDrawEndDate`}
                  label="응모 기간 종료일"
                  type="datetime-local"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  rules={{
                    required: isEditableEnterDrawDate ? '응모 기간 종료일을 입력해주세요.' : false,
                  }}
                  disabled={!(isEdit && isEditableEnterDrawDate)}
                />
              </IssuePeriodWrapperStyled>
            </ItemsWrapper>
          </FormLayout>
        </RowGrid>
      </Grid>
    </WrapperStyled>
  );
};

const WrapperStyled = styled(Box)`
  padding: 10px 40px;
`;

const RowGrid = styled(Grid)`
  margin-bottom: 10px;

  .Mui-disabled fieldset {
    background-color: #eee !important;
  }
`;

const ItemsWrapper = styled(Box)`
  display: flex;
  align-items: center;
`;

const IssuePeriodWrapperStyled = styled(Box)`
  display: flex;
  align-items: flex-start;
  padding: 3px;

  div.MuiFormControl-root {
    width: 240px;
    margin-right: 10px;

    .Mui-disabled fieldset {
      background-color: #ffffff00 !important;
    }
  }
`;
