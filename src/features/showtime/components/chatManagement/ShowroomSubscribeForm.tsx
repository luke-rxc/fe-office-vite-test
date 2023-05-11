import { FormControlRadioGroup, FormLayout } from '..';
import { ShowtimeChatShowroomSubscribeFormField } from '@features/showtime/types';
import { useFormContext } from 'react-hook-form';
import { ShowroomType, ShowroomTypeLabel } from '@features/showtime/constants';
import { FormControlAutoComplete } from '@components/form';
import { ShowroomComboItemModel, ShowtimeContentsItemModel } from '@features/showtime/models';
import { useMemo } from 'react';
import { Grid } from '@material-ui/core';
import styled from '@emotion/styled';

interface Props {
  showtimeContentsItem: ShowtimeContentsItemModel;
  showroomComboList: Array<ShowroomComboItemModel>;
}

export const ShowroomSubscribeForm = ({ showtimeContentsItem, showroomComboList }: Props) => {
  const { watch } = useFormContext<ShowtimeChatShowroomSubscribeFormField>();
  const showroomType = watch('showroomType');
  const { showRoomId, showRoomName, guestShowRoomIds } = showtimeContentsItem;

  const messageTypeOptions = useMemo(() => {
    const options = [
      {
        label: ShowroomTypeLabel[ShowroomType.HOST],
        value: ShowroomType.HOST,
      },
      {
        label: ShowroomTypeLabel[ShowroomType.GUEST],
        value: ShowroomType.GUEST,
      },
      {
        label: ShowroomTypeLabel[ShowroomType.ETC],
        value: ShowroomType.ETC,
      },
    ];
    return guestShowRoomIds.length > 0 ? options : options.filter((option) => option.value !== ShowroomType.GUEST);
  }, [guestShowRoomIds.length]);

  return (
    <>
      <FormLayout label="쇼룸 선택">
        <Grid container>
          <Grid item xs={4}>
            <RadioWrapperStyled>
              <FormControlRadioGroup<ShowtimeChatShowroomSubscribeFormField>
                name="showroomType"
                options={messageTypeOptions}
                row={false}
                sx={{ width: '450px' }}
              />
            </RadioWrapperStyled>
          </Grid>
          <Grid item xs>
            <SelectWrapperStyled>
              {showRoomName} ({showRoomId})
            </SelectWrapperStyled>
            {guestShowRoomIds.length > 0 && (
              <SelectWrapperStyled>
                <FormControlAutoComplete<ShowtimeChatShowroomSubscribeFormField>
                  name="guestShowroom"
                  options={showroomComboList.filter((item) => guestShowRoomIds.includes(item.value))}
                  getOptionLabel={({ label, value }: ShowroomComboItemModel) => `${label} (${value})`}
                  isOptionEqualToValue={(v: ShowroomComboItemModel, o: ShowroomComboItemModel) => v?.value === o?.value}
                  placeholder="게스트 쇼룸 선택"
                  rules={{ required: showroomType === ShowroomType.GUEST ? '게스트 쇼룸을 선택하세요' : false }}
                  disabled={showroomType !== ShowroomType.GUEST}
                  sx={{ width: '280px' }}
                />
              </SelectWrapperStyled>
            )}
            <SelectWrapperStyled>
              <FormControlAutoComplete<ShowtimeChatShowroomSubscribeFormField>
                name="etcShowroom"
                options={showroomComboList}
                getOptionLabel={({ label, value }: ShowroomComboItemModel) => `${label} (${value})`}
                isOptionEqualToValue={(v: ShowroomComboItemModel, o: ShowroomComboItemModel) => v?.value === o?.value}
                placeholder="기타 쇼룸 선택"
                rules={{ required: showroomType === ShowroomType.ETC ? '기타 쇼룸을 선택하세요' : false }}
                disabled={showroomType !== ShowroomType.ETC}
                sx={{ width: '280px' }}
              />
            </SelectWrapperStyled>
          </Grid>
        </Grid>
      </FormLayout>
    </>
  );
};

const RadioWrapperStyled = styled.div`
  .MuiFormGroup-root > .MuiBox-root {
    margin: 16px 0;

    &:first-of-type {
      margin: 0;
    }
  }
`;

const SelectWrapperStyled = styled.div`
  & {
    height: 74px;
    display: flex;
    align-items: center;

    &:first-of-type {
      height: 42px;
    }
  }
`;
