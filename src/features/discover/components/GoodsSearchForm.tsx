import styled from '@emotion/styled';
import { Box, Button, Card, FormControl, FormGroup, FormLabel, Grid } from '@material-ui/core';
import { FormControlSelect, FormControlTextField, FormControlAutoComplete } from '@components/form';
import { GoodsSearchFormField } from '../types';
import { GoodsSearchType, GoodsSearchTypeLabel, GoodsStatus, GoodsStatusLabel } from '../constants';
import { ReturnTypeUseDiscoverAddGoodsService } from '../services';
import { BrandComboModel, ProviderComboModel } from '../models';

interface Props {
  form: ReturnTypeUseDiscoverAddGoodsService['form'];
  providerCombo: Array<ProviderComboModel>;
  brandCombo: Array<BrandComboModel>;
}

/**
 * 검색 타입 옵션
 */
const searchTypeOptions = Object.keys(GoodsSearchType).map((key) => {
  return {
    label: GoodsSearchTypeLabel[key],
    value: GoodsSearchType[key],
  };
});

/**
 * 상품 상태 옵션
 */
const goodsStatusOptions = Object.keys(GoodsStatus).map((key) => {
  return {
    label: GoodsStatusLabel[key],
    value: GoodsStatus[key],
  };
});

/**
 * 상품 리스트 검색폼 component
 */
export const GoodsSearchForm = ({
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
              <FormControlSelect<GoodsSearchFormField>
                name="searchType"
                label="검색조건"
                inputProps={{ 'aria-label': 'searchType' }}
                options={searchTypeOptions}
                autoWidth
              />
            </Grid>
            <Grid item md={10} xs={12}>
              <FormControlTextField<GoodsSearchFormField>
                name="keyword"
                label=""
                sx={{ width: '350px' }}
                disabled={searchType === GoodsSearchType.ALL}
              />
            </Grid>

            <Grid item md={4} xs={4}>
              <FormControlStyled fullWidth>
                <FormLabel>상품상태</FormLabel>
                <FormGroup row>
                  <FormControlSelect<GoodsSearchFormField>
                    name="status"
                    inputProps={{ 'aria-label': 'status' }}
                    options={goodsStatusOptions}
                    displayEmpty
                    sx={{ width: '300px' }}
                  />
                </FormGroup>
              </FormControlStyled>
            </Grid>

            {providerCombo && (
              <Grid item md={4} xs={4}>
                <FormControlStyled fullWidth>
                  <FormLabel>입점사</FormLabel>
                  <FormGroup row>
                    <FormControlAutoComplete<GoodsSearchFormField>
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
                    <FormControlAutoComplete<GoodsSearchFormField>
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
