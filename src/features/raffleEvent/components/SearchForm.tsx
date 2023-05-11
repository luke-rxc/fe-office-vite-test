import { FormControlDatePicker, FormControlSelect, FormControlTextField } from '@components/form';
import styled from '@emotion/styled';
import { Box, Button, ButtonGroup, Card, Grid } from '@material-ui/core';
import { RaffleEventListSearchField, RaffleEventListSearchFieldLabel } from '../constants';
import { ReturnTypeUseRaffleEventListService } from '../services';
import { RaffleEventListSearchFormField } from '../types';

interface Props {
  form: Omit<ReturnTypeUseRaffleEventListService['form'], 'formMethod'>;
}

/**
 * 검색 타입 옵션
 */
const RaffleEventListSearchFieldOptions = Object.keys(RaffleEventListSearchField).map((key) => {
  return {
    label: RaffleEventListSearchFieldLabel[key],
    value: RaffleEventListSearchField[key],
  };
});

export const SearchForm = ({ form }: Props) => {
  const { handleSubmit, handleReset, handleChangeLiveRange } = form;

  const onClickRange = (range: number) => {
    return () => handleChangeLiveRange(range);
  };

  return (
    <Card>
      <WrapperStyled>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item md={2} xs={12}>
              <FormControlSelect<RaffleEventListSearchFormField>
                name="searchField"
                label="검색조건"
                inputProps={{ 'aria-label': 'searchField' }}
                options={RaffleEventListSearchFieldOptions}
                autoWidth
              />
            </Grid>
            <Grid item md={10} xs={12}>
              <FormControlTextField<RaffleEventListSearchFormField>
                name="keyword"
                label="검색어"
                triggerPressEnterSubmit
                sx={{ width: '600px' }}
              />
            </Grid>

            <Grid item md={3} xs={6}>
              <FormControlDatePicker<RaffleEventListSearchFormField> name="startDate" label="방송날짜 검색범위(시작)" />
            </Grid>
            <Grid item md={3} xs={6}>
              <FormControlDatePicker<RaffleEventListSearchFormField> name="endDate" label="방송날짜 검색범위(종료)" />
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
          </Grid>
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
