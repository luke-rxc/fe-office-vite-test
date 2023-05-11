import { FormControlAutoComplete } from '@components/form';
import styled from '@emotion/styled';
import { Box, Button, Grid } from '@material-ui/core';
import { FormProvider } from 'react-hook-form';
import { BrandComboModel } from '../models';
import { BrandFormField, BrandFormProps } from '../types';

interface Props {
  form: BrandFormProps;
  brandList: Array<BrandComboModel>;
  getOptionDisabled: (option: BrandComboModel) => boolean;
}

export const CouponBrands = ({ form: { formMethod, handleSubmit }, brandList, getOptionDisabled }: Props) => {
  return (
    <FormStyled onSubmit={handleSubmit}>
      <FormProvider {...formMethod}>
        <Grid container direction="row" justifyContent="flex-start" alignItems="flex-start">
          <ItemWrapperStyled>
            <FormControlAutoComplete<BrandFormField>
              name="brand"
              options={brandList}
              rules={{ required: '브랜드를 선택하세요' }}
              placeholder="브랜드 선택"
              getOptionDisabled={getOptionDisabled}
            />
          </ItemWrapperStyled>
          <Button type="submit" variant="contained" color="primary" sx={{ margin: '10px' }}>
            추가
          </Button>
        </Grid>
      </FormProvider>
    </FormStyled>
  );
};

const FormStyled = styled.form`
  margin-bottom: 20px;
`;

const ItemWrapperStyled = styled(Box)`
  width: 200px;
  margin: 0 10px;
`;
