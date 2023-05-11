import styled from '@emotion/styled';
import { Box, Button, Card, FormControl, FormGroup, FormLabel, Grid } from '@material-ui/core';
import { FormControlSelect, FormControlTextField, FormControlAutoComplete } from '@components/form';
import { ShowroomSearchFormField } from '../types';
import { ShowroomSearchType, ShowroomSearchTypeLabel } from '../constants';
import { ReturnTypeUseDiscoverAddShowroomService } from '../services';
import { BrandComboModel, ProviderComboModel } from '../models';

interface Props {
  form: ReturnTypeUseDiscoverAddShowroomService['form'];
  providerCombo: Array<ProviderComboModel>;
  brandCombo: Array<BrandComboModel>;
}

/**
 * 검색 타입 옵션
 */
const searchTypeOptions = Object.keys(ShowroomSearchType).map((key) => {
  return {
    label: ShowroomSearchTypeLabel[key],
    value: ShowroomSearchType[key],
  };
});

/**
 * 쇼룸 리스트 검색폼 component
 */
export const ShowroomSearchForm = ({
  form: { handleSubmit, handleReset, formMethod },
  providerCombo,
  brandCombo,
}: Props) => {
  const { watch } = formMethod;
  const searchType = watch('searchType');
  return (
    <Card sx={{ m: '10px 20px' }}>
      <WrapperStyled>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item md={2} xs={12}>
              <FormControlSelect<ShowroomSearchFormField>
                name="searchType"
                label="검색조건"
                inputProps={{ 'aria-label': 'searchType' }}
                options={searchTypeOptions}
                autoWidth
              />
            </Grid>
            <Grid item md={10} xs={12}>
              <FormControlTextField<ShowroomSearchFormField>
                name="searchValue"
                label=""
                disabled={searchType === ShowroomSearchType.ALL}
                sx={{ width: '350px' }}
              />
            </Grid>

            {providerCombo && (
              <Grid item md={4} xs={4}>
                <FormControlStyled fullWidth>
                  <FormLabel>입점사</FormLabel>
                  <FormGroup row>
                    <FormControlAutoComplete<ShowroomSearchFormField>
                      name="provider"
                      options={providerCombo}
                      variant="outlined"
                      placeholder="전체"
                      sx={{ width: '300px' }}
                    />
                  </FormGroup>
                </FormControlStyled>
              </Grid>
            )}

            {brandCombo && (
              <Grid item md={8} xs={8}>
                <FormControlStyled fullWidth>
                  <FormLabel>브랜드</FormLabel>
                  <FormGroup row>
                    <FormControlAutoComplete<ShowroomSearchFormField>
                      name="brand"
                      options={brandCombo}
                      placeholder="전체"
                      sx={{ width: '300px' }}
                    />
                  </FormGroup>
                </FormControlStyled>
              </Grid>
            )}
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
  padding-top: 10px;
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
