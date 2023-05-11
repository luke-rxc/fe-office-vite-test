import { Box, Button, ButtonGroup, Card, Divider, FormControl, FormGroup, FormLabel, Grid } from '@material-ui/core';
import { ShowtimeFormProps, ShowtimeListFormField } from '../types';
import {
  FormControlTextField,
  FormControlSelect,
  FormControlDatePicker,
  FormControlRadioGroup,
  FormControlCheckbox,
  FormControlAutoComplete,
} from '.';
import styled from '@emotion/styled';
import {
  ContentsType,
  ContentsTypeLabel,
  limitSearchShowroomCount,
  LiveStatusLabel,
  liveStatusOptions,
  OpenStatusLabel,
  openStatusOptions,
  SearchField,
  SearchFieldLabel,
  SearchFilterMore,
  SearchFilterMoreLabel,
} from '../constants';
import { KeywordComboItemModel, ShowroomComboItemModel } from '../models';

interface Props {
  form: ShowtimeFormProps<ShowtimeListFormField>;
  more: SearchFilterMore;
  keywordOptions: Array<KeywordComboItemModel>;
  showroomOptions: Array<ShowroomComboItemModel>;
  onClickShowMore: () => void;
  onChangeLiveRange: (range: number) => void;
}

/**
 * 검색 타입 옵션
 */
const searchFieldOptions = Object.keys(SearchField).map((key) => {
  return {
    label: SearchFieldLabel[key],
    value: SearchField[key],
  };
});

/**
 * 콘텐츠 타입 옵션
 */
const contentsTypeOptions: Array<{ label: string; value: string }> = [
  { label: '전체', value: '' },
  { label: ContentsTypeLabel[ContentsType.STANDARD], value: ContentsType.STANDARD },
  { label: ContentsTypeLabel[ContentsType.AUCTION], value: ContentsType.AUCTION },
];

export const SearchForm = ({
  form,
  more,
  keywordOptions,
  showroomOptions,
  onClickShowMore,
  onChangeLiveRange,
}: Props) => {
  const {
    handleSubmit,
    handleReset,
    limit: { showRoomIds: isLimitShowRoomIds },
  } = form;

  const onClickRange = (range: number) => {
    return () => onChangeLiveRange(range);
  };

  return (
    <Card>
      <WrapperStyled>
        <form onSubmit={handleSubmit}>
          <GridStyled container spacing={3} more={more}>
            <Grid item md={2} xs={12}>
              <FormControlSelect<ShowtimeListFormField>
                name="searchField"
                label="검색조건"
                inputProps={{ 'aria-label': 'searchField' }}
                options={searchFieldOptions}
                autoWidth
              />
            </Grid>
            <Grid item md={10} xs={12}>
              <FormControlTextField<ShowtimeListFormField>
                name="keyword"
                label="검색어"
                triggerPressEnterSubmit
                sx={{ width: '600px' }}
              />
            </Grid>

            <Grid item md={3} xs={6}>
              <FormControlDatePicker<ShowtimeListFormField> name="liveStartDate" label="방송날짜 검색범위(시작)" />
            </Grid>
            <Grid item md={3} xs={6}>
              <FormControlDatePicker<ShowtimeListFormField> name="liveEndDate" label="방송날짜 검색범위(종료)" />
            </Grid>
            <Grid item md={6} xs={12} display="flex" alignItems="center">
              <ButtonGroup sx={{ alignSelf: 'flex-start', height: '56px' }}>
                <Button onClick={onClickRange(0)}>오늘</Button>
                <Button onClick={onClickRange(3)}>3일</Button>
                <Button onClick={onClickRange(7)}>7일</Button>
                <Button onClick={onClickRange(14)}>14일</Button>
                <Button onClick={onClickRange(30)}>30일</Button>
              </ButtonGroup>
            </Grid>
            <Grid item md={12} xs={12}>
              <FormControlStyled fullWidth>
                <FormLabel>타입</FormLabel>
                <FormGroup row>
                  <FormControlRadioGroup<ShowtimeListFormField> name="contentsType" options={contentsTypeOptions} />
                </FormGroup>
              </FormControlStyled>
            </Grid>
            {showroomOptions && (
              <Grid item md={12} xs={12}>
                <FormControlStyled fullWidth>
                  <FormLabel>쇼룸</FormLabel>
                  <FormControlAutoComplete<ShowtimeListFormField>
                    name="showRoomIds"
                    multiple
                    options={showroomOptions}
                    getOptionLabel={({ label }: ShowroomComboItemModel) => label}
                    isOptionEqualToValue={(v: ShowroomComboItemModel, o: ShowroomComboItemModel) => v.value === o.value}
                    placeholder={isLimitShowRoomIds ? `최대 ${limitSearchShowroomCount}개 선택` : '쇼룸 선택'}
                    sx={{ width: '800px' }}
                    isLimit={isLimitShowRoomIds}
                  />
                </FormControlStyled>
              </Grid>
            )}
            <Grid item md={12} xs={12}>
              <FormControlStyled fullWidth>
                <FormLabel>Live 상태</FormLabel>
                <FormGroup row>
                  {/* <Checkbox size="small" label="전체" indeterminate={false} /> */}
                  {liveStatusOptions.map((option, index) => (
                    <FormControlCheckbox<ShowtimeListFormField>
                      name={`liveStatuses.${index}`}
                      key={option}
                      label={LiveStatusLabel[option]}
                      value={option}
                    />
                  ))}
                </FormGroup>
              </FormControlStyled>
            </Grid>
            <Grid item md={12} xs={12}>
              <FormControlStyled fullWidth>
                <FormLabel>공개상태</FormLabel>
                <FormGroup row>
                  {/* <Checkbox size="small" label="전체" indeterminate={false} /> */}
                  {openStatusOptions.map((option, index) => (
                    <FormControlCheckbox<ShowtimeListFormField>
                      name={`openStatuses.${index}`}
                      key={option}
                      label={OpenStatusLabel[option]}
                      value={option}
                    />
                  ))}
                </FormGroup>
              </FormControlStyled>
            </Grid>
          </GridStyled>
          <Divider sx={{ m: '10px 0' }}>
            <Button variant="outlined" onClick={onClickShowMore}>
              {SearchFilterMoreLabel[more === SearchFilterMore.ALL ? SearchFilterMore.REQUIRED : SearchFilterMore.ALL]}
            </Button>
          </Divider>
          <ButtonWrapperStyled>
            <Button color="primary" type="submit" variant="contained">
              검색
            </Button>
            <Button color="secondary" type="button" variant="contained" onClick={handleReset} sx={{ ml: 1 }}>
              초기화
            </Button>
          </ButtonWrapperStyled>
        </form>
      </WrapperStyled>
    </Card>
  );
};

const WrapperStyled = styled(Box)`
  min-height: 100%;
  padding: 25px 40px;
`;

const ButtonWrapperStyled = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;

const GridStyled = styled(Grid)<{ more?: SearchFilterMore }>`
  ${({ more = SearchFilterMore.ALL }) =>
    more === SearchFilterMore.REQUIRED &&
    `
      height: 180px;
      overflow: hidden;
  `}
`;

const FormControlStyled = styled(FormControl)`
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;

  & > label {
    width: 80px;
    margin-right: 20px;
  }
`;
