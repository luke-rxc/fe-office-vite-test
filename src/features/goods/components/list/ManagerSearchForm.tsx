import { memo } from 'react';
import { FormProvider, UseFormReturn } from 'react-hook-form';
import { Box, Card, Divider, CardContent, Grid, CardHeader, List, ListItem } from '@material-ui/core';
import { ListTitle } from '@components/ListTitle';
import {
  FormControlCheckbox,
  FormControlTextField,
  FormControlDatePicker,
  FormControlSelect,
  FormControlRadioGroup,
  FormControlAutoComplete,
} from '@components/form';
import { GoodsStatusLabel } from '@constants/goods';
import {
  DateTypeOptions,
  SaleStatusCbOptions,
  GoodsTypeCbOptions,
  GoodsTypeLabel,
  ListTitleWidth,
  GoodsKindOptions,
} from '../../constants';
import { ListFormField, ProviderModel, ComboModel } from '../../models';
import { callbackDateConverter } from '../../utils';
import { DatePickerPreset } from '../DatePickerPreset';
import { ListSearchButton } from './ListSearchButton';

interface Props {
  onSubmit: (value: ListFormField) => void;
  onReset: () => void;
  onDatePreset: (range?: number) => () => void;

  // search category
  /* categoryInfos: CategoryListModel[][];
  onChangeCategory: (props: SearchCategoryInfoProp) => void; */

  // search brand
  brandListOptions: ComboModel[];

  // provider
  providerListOptions: ProviderModel[];

  // keyword
  keywordListOptions: ComboModel[];

  // react-hook-form method
  methods: UseFormReturn<ListFormField>;
}

export const ManagerSearchForm = memo(
  ({
    methods,
    brandListOptions,
    providerListOptions,
    keywordListOptions,
    onSubmit: handleSearchSubmit,
    onReset: handleReset,
    onDatePreset: handleDatePreset,
  }: /* categoryInfos,
    onChangeCategory: handleChangeCategory, */
  Props) => {
    const { handleSubmit } = methods;

    return (
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(handleSearchSubmit)} onReset={handleReset}>
          <Card>
            <CardHeader title="상품조회" />
            <Divider />
            <CardContent>
              <Grid container>
                <Grid item md={9} xs={12}>
                  <List>
                    {/* 상품명 */}
                    <ListItemWrapper>
                      <ListTitleWrapper name="상품명" />
                      <FormControlTextField<ListFormField>
                        name="name"
                        label=""
                        placeholder="상품명을 입력해주세요"
                        fullWidth
                        triggerPressEnterSubmit
                      />
                    </ListItemWrapper>
                    {/* // 상품명 */}

                    {/* 상품유형 */}
                    <ListItemWrapper>
                      <ListTitleWrapper name="상품유형" />
                      {GoodsTypeCbOptions.map((option, index) => {
                        return (
                          <FormControlCheckbox<ListFormField>
                            name={`typeList.${index}`}
                            key={option}
                            label={GoodsTypeLabel[option]}
                            value={option}
                          />
                        );
                      })}
                    </ListItemWrapper>
                    {/* // 상품유형 */}

                    {/* 상품분류 */}
                    <ListItemWrapper>
                      <ListTitleWrapper name="상품분류" />
                      <FormControlRadioGroup<ListFormField> name="goodsKind" options={GoodsKindOptions} row />
                    </ListItemWrapper>
                    {/* // 상품분류 */}

                    {/* 판매기간 */}
                    <ListItemWrapper>
                      <ListTitleWrapper name="판매기간" />
                      <FormControlSelect<ListFormField>
                        name="dateType"
                        label="기간 기준"
                        inputProps={{ 'aria-label': 'dateType' }}
                        options={DateTypeOptions}
                      />
                      <Box sx={{ mx: 1 }} />
                      <FormControlDatePicker<ListFormField>
                        name="fromDate"
                        label="시작일"
                        fullWidth={false}
                        callbackDateConverter={callbackDateConverter}
                      />
                      <Box sx={{ mx: 1 }}>~</Box>
                      <FormControlDatePicker<ListFormField>
                        name="toDate"
                        label="종료일"
                        fullWidth={false}
                        callbackDateConverter={callbackDateConverter}
                      />
                      <DatePickerPreset onDatePreset={handleDatePreset} sx={{ ml: 2 }} />
                    </ListItemWrapper>
                    {/* // 판매기간 */}

                    {/* 카테고리 */}
                    {/* <ListItemWrapper>
                      <ListTitleWrapper name="카테고리" isRequired />
                      <GoodsCategory
                        formFieldKeys={CategoryFieldKeys}
                        infos={categoryInfos}
                        onChange={handleChangeCategory}
                      />
                    </ListItemWrapper> */}
                    {/* // 카테고리 */}

                    {/* 판매상태 */}
                    <ListItemWrapper>
                      <ListTitleWrapper name="판매상태" />
                      {SaleStatusCbOptions.map((option, index) => {
                        return (
                          <FormControlCheckbox<ListFormField>
                            name={`statusList.${index}`}
                            key={option}
                            label={GoodsStatusLabel[option]}
                            value={option}
                          />
                        );
                      })}
                    </ListItemWrapper>
                    {/* // 판매상태 */}

                    {/* 브랜드, 입점사 */}
                    <ListItemWrapper>
                      <Grid item md={6} xs={12} display="flex" alignItems="center">
                        <ListTitleWrapper name="브랜드" />
                        <FormControlAutoComplete<ListFormField>
                          name="brandInfo"
                          multiple
                          options={brandListOptions}
                          getOptionLabel={({ label }: ComboModel) => (label ? label : '')}
                          isOptionEqualToValue={(v: ComboModel, o: ComboModel) => v.value === o.value}
                          placeholder="브랜드명을 입력해주세요"
                          sx={{ width: '70%' }}
                        />
                      </Grid>
                      <Grid item md={6} xs={12} display="flex" alignItems="center">
                        <ListTitleWrapper name="입점사" />
                        <FormControlAutoComplete<ListFormField>
                          name="providerInfo"
                          multiple
                          options={providerListOptions}
                          getOptionLabel={({ label }: ComboModel) => (label ? label : '')}
                          isOptionEqualToValue={(v: ComboModel, o: ComboModel) => v.value === o.value}
                          placeholder="입점사를 입력해주세요"
                          sx={{ width: '70%' }}
                        />
                      </Grid>
                    </ListItemWrapper>
                    {/* // 브랜드, 입점사 */}

                    {/* 키워드 */}
                    <ListItemWrapper>
                      {/* 키워드 */}
                      <ListTitleWrapper name="키워드" />
                      <FormControlAutoComplete<ListFormField>
                        name="keywordInfo"
                        multiple
                        options={keywordListOptions}
                        getOptionLabel={({ label }: ComboModel) => (label ? label : '')}
                        isOptionEqualToValue={(v: ComboModel, o: ComboModel) => v.value === o.value}
                        placeholder="키워드를 선택해주세요"
                        sx={{ width: '29%' }}
                      />
                      {/* // 키워드 */}
                    </ListItemWrapper>

                    {/* 상품 아이디 */}
                    <ListItemWrapper>
                      <ListTitleWrapper name="상품 아이디" />
                      <FormControlTextField<ListFormField>
                        name="goodsIds"
                        label=""
                        placeholder="복수의 아이디일 경우 띄어쓰기, 콤마(,)로 구분해주세요"
                        fullWidth
                        triggerPressEnterSubmit
                      />
                    </ListItemWrapper>
                    {/* // 상품 아이디 */}
                  </List>
                </Grid>

                <Divider orientation="vertical" flexItem sx={{ mx: 2 }} />

                <Grid item md={2} xs={12} display="flex" justifyContent="flex-end" flexDirection="column">
                  <ListSearchButton />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </form>
      </FormProvider>
    );
  },
);

ManagerSearchForm.displayName = 'ManagerSearchForm';

const ListItemWrapper = ({ children }) => {
  return <ListItem sx={{ mt: 2 }}>{children}</ListItem>;
};

const ListTitleWrapper = (props) => {
  return <ListTitle width={ListTitleWidth} {...props} sx={{ flexShrink: 0 }} />;
};
