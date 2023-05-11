import { Box, Button, Card, Divider, Grid, InputAdornment } from '@material-ui/core';
import SearchIcon from '@assets/icons/Search';
import { FormProvider } from 'react-hook-form';
import styled from '@emotion/styled';
import { CouponListFormValue } from '../types';
import { UseCouponListService } from '../services';
import { FormControlTextField } from '@components/form';

interface Props {
  form: UseCouponListService['form'];
}

export const SearchForm = ({ form }: Props) => {
  const { formMethod, handleSubmit, handleReset } = form;
  return (
    <Card>
      <Wrapper>
        <form onSubmit={handleSubmit}>
          <FormProvider {...formMethod}>
            <Grid container spacing={3}>
              <Grid item md={9} xs={12}>
                <FormControlTextField<CouponListFormValue>
                  name="name"
                  size="small"
                  fullWidth
                  label="검색어"
                  sx={{ width: '280px' }}
                  rules={{ required: '검색어를 입력하세요' }}
                  placeholder="검색어를 입력하세요"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon fontSize="small" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
            </Grid>
            <Divider sx={{ my: 3 }} />
            <ButtonWrapper>
              <Button color="primary" type="submit" variant="contained">
                검색
              </Button>
              <Button color="secondary" type="button" variant="contained" onClick={handleReset} sx={{ ml: 1 }}>
                초기화
              </Button>
            </ButtonWrapper>
          </FormProvider>
        </form>
      </Wrapper>
    </Card>
  );
};

const Wrapper = styled(Box)`
  min-height: 100%;
  padding: 25px 20px 20px;
  background-color: 'background.paper';
`;

const ButtonWrapper = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: flex-start;
`;
