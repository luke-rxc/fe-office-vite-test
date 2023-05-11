import { FormControlSelect } from '@components/form';
import styled from '@emotion/styled';
import { Box, Button, Grid, MenuItem } from '@material-ui/core';
import { ChangeEvent } from 'react';
import { FormProvider } from 'react-hook-form';
import { CategoryModel } from '../models';
import { CategoriesFormField, CategoryFormProps } from '../types';

interface Props {
  form: CategoryFormProps;
  categoryData: {
    rootCategories: Array<CategoryModel>;
    subCategories: Array<CategoryModel>;
    lastCategories: Array<CategoryModel>;
  };
}

export const CouponCategories = ({
  form: { formMethod, handleSubmit, handleChangeCategory },
  categoryData: { rootCategories, subCategories, lastCategories },
}: Props) => {
  const onChangeCategory = (
    event: ChangeEvent<{
      name?: string;
      value: string;
      event: Event;
    }>,
  ) => {
    handleChangeCategory(event.target.name, event.target.value);
  };

  return (
    <FormStyled onSubmit={handleSubmit}>
      <FormProvider {...formMethod}>
        <Grid container direction="row" justifyContent="flex-start" alignItems="flex-start">
          <ItemWrapperStyled>
            <FormControlSelect<CategoriesFormField>
              name="rootCategory"
              options={rootCategories}
              rules={{ required: '카테고리를 선택하세요' }}
              displayEmpty
              onChange={onChangeCategory}
            >
              <MenuItem value="">전체</MenuItem>
            </FormControlSelect>
          </ItemWrapperStyled>
          <ItemWrapperStyled>
            <FormControlSelect<CategoriesFormField>
              name="subCategory"
              options={subCategories}
              displayEmpty
              onChange={onChangeCategory}
            >
              <MenuItem value="">전체</MenuItem>
            </FormControlSelect>
          </ItemWrapperStyled>
          <ItemWrapperStyled>
            <FormControlSelect<CategoriesFormField>
              name="lastCategory"
              options={lastCategories}
              displayEmpty
              onChange={onChangeCategory}
            >
              <MenuItem value="">전체</MenuItem>
            </FormControlSelect>
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
