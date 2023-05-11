import styled from '@emotion/styled';
import { Box, Button, Card, FormControl, FormGroup, FormLabel, Grid } from '@material-ui/core';
import { FormControlSelect, FormControlTextField, FormControlAutoComplete } from '@components/form';
import { ContentsSearchFormField } from '../types';
import { ContentsSearchType, ContentsSearchTypeLabel } from '../constants';
import { ReturnTypeUseDiscoverAddContentsService } from '../services';
import { ShowroomComboModel, ProviderComboModel } from '../models';

interface Props {
  form: ReturnTypeUseDiscoverAddContentsService['form'];
  providerCombo: Array<ProviderComboModel>;
  showroomCombo: Array<ShowroomComboModel>;
}

/**
 * 검색 타입 옵션
 */
const searchTypeOptions = Object.keys(ContentsSearchType).map((key) => {
  return {
    label: ContentsSearchTypeLabel[key],
    value: ContentsSearchType[key],
  };
});

/**
 * 콘텐츠 리스트 검색폼 component
 */
export const ContentsSearchForm = ({
  form: { handleSubmit, handleReset, formMethod },
  providerCombo,
  showroomCombo,
}: Props) => {
  const { watch } = formMethod;
  const searchType = watch('searchType');
  return (
    <Card sx={{ m: '10px 20px' }}>
      <WrapperStyled>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item md={2} xs={12}>
              <FormControlSelect<ContentsSearchFormField>
                name="searchType"
                label="검색조건"
                inputProps={{ 'aria-label': 'searchType' }}
                options={searchTypeOptions}
                autoWidth
              />
            </Grid>
            <Grid item md={10} xs={12}>
              <FormControlTextField<ContentsSearchFormField>
                name="searchValue"
                label=""
                disabled={searchType === ContentsSearchType.ALL}
                sx={{ width: '350px' }}
              />
            </Grid>

            {providerCombo && (
              <Grid item md={4} xs={4}>
                <FormControlStyled fullWidth>
                  <FormLabel>입점사</FormLabel>
                  <FormGroup row>
                    <FormControlAutoComplete<ContentsSearchFormField>
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

            {showroomCombo && (
              <Grid item md={8} xs={8}>
                <FormControlStyled fullWidth>
                  <FormLabel>쇼룸</FormLabel>
                  <FormGroup row>
                    <FormControlAutoComplete<ContentsSearchFormField>
                      name="showroom"
                      options={showroomCombo}
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
