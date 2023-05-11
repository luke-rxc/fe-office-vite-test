import { useEffect } from 'react';
import type { VFC } from 'react';
import { useFormContext, UseFormReturn } from 'react-hook-form';
import { Paper, Grid, Divider, Button, List, ListItem, Box } from '@material-ui/core';
import RotateLeftSharpIcon from '@material-ui/icons/RotateLeftSharp';
import SearchIcon from '@material-ui/icons/Search';
import { ListTitle } from '@components/ListTitle';
import { GOODS_SEARCH_TYPE_OPTIONS, DEAL_SALE_STATUS_OPTIONS } from '../constants';
import { ComboItemModel, GoodsSearchFieldModel } from '../models';
import {
  FormControlAutoComplete,
  FormControlCheckbox,
  FormControlRadioGroup,
  FormControlSelect,
  FormControlTextField,
} from './form';
import { Tooltip } from './Tooltip';

/**
 * 상품 검색 폼
 */
type GoodsSearchFormProps = {
  formMethod: UseFormReturn<GoodsSearchFieldModel>;
  providerComboList: ComboItemModel[]; // 입점사 콤보 리스트
  brandComboList: ComboItemModel[]; // 브랜드 콤보 리스트
  onSearch: () => void;
  onReset: () => void;
};
export const GoodsSearchForm: VFC<GoodsSearchFormProps> = ({
  formMethod,
  providerComboList,
  brandComboList,
  onSearch,
  onReset,
}) => {
  const { setValue, watch } = useFormContext();
  const isMyBrand = watch('isMyBrand');
  const status = watch('status');

  useEffect(() => {
    if (isMyBrand) {
      setValue('brandId', []);
      setValue('providerId', []);
    }
  }, [isMyBrand, setValue]);

  return (
    <form onSubmit={onSearch}>
      <Paper elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: 1, p: 2 }}>
        <Grid container>
          <Grid container item xs={10}>
            <List sx={{ width: '100%' }}>
              <ListItem sx={{ mb: 2 }}>
                <ListTitle name="콘텐츠 제목/콘텐츠 번호" sx={{ width: 200 }} />
                <Box sx={{ width: '100%' }}>
                  <Grid container spacing={1}>
                    <Grid item xs={3}>
                      <FormControlSelect<GoodsSearchFieldModel>
                        name="searchType"
                        label="검색어조건"
                        options={GOODS_SEARCH_TYPE_OPTIONS}
                        autoWidth
                      />
                    </Grid>
                    <Grid item xs={9}>
                      <FormControlTextField<GoodsSearchFieldModel>
                        name="keyword"
                        label="검색어 입력"
                        sx={{ width: '100%' }}
                      />
                    </Grid>
                  </Grid>
                </Box>
              </ListItem>
              <ListItem sx={{ mb: 2 }}>
                <ListTitle name="입점사" sx={{ width: 200 }} />
                <Box sx={{ width: '100%' }}>
                  {providerComboList && (
                    <FormControlAutoComplete<GoodsSearchFieldModel>
                      name="providerId"
                      fullWidth
                      options={providerComboList}
                      getOptionLabel={({ label }: ComboItemModel) => (label ? label : '')}
                      isOptionEqualToValue={(v: ComboItemModel, o: ComboItemModel) => v.value === o.value}
                      placeholder="입점사 선택"
                      sx={{ width: '100%' }}
                      disabled={isMyBrand}
                    />
                  )}
                </Box>
              </ListItem>
              <ListItem>
                <ListTitle name="브랜드" sx={{ width: 200 }} />
                <Box sx={{ width: '100%' }}>
                  {brandComboList && (
                    <FormControlAutoComplete<GoodsSearchFieldModel>
                      name="brandId"
                      fullWidth
                      options={brandComboList}
                      getOptionLabel={({ label }: ComboItemModel) => (label ? label : '')}
                      isOptionEqualToValue={(v: ComboItemModel, o: ComboItemModel) => v.value === o.value}
                      placeholder="브랜드 선택"
                      sx={{ width: '100%' }}
                      disabled={isMyBrand}
                    />
                  )}
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <FormControlCheckbox<GoodsSearchFieldModel> name="isMyBrand" label="나의 브랜드 상품 조회" />
                    <Tooltip
                      text={
                        <span>
                          *나의 쇼룸과 연결된&nbsp;
                          <strong style={{ textDecoration: 'underline' }}>브랜드의 등록된 전시 / 판매가능 상품</strong>
                          이 모두 조회 됩니다.
                        </span>
                      }
                    ></Tooltip>
                  </Box>
                </Box>
              </ListItem>
              <ListItem>
                <ListTitle name="상품상태" sx={{ width: 200 }} />
                <Box sx={{ width: '100%' }}>
                  <FormControlRadioGroup
                    row
                    name="status"
                    value={status}
                    options={[{ label: '전체', value: '' }, ...DEAL_SALE_STATUS_OPTIONS]}
                  />
                </Box>
              </ListItem>
            </List>
          </Grid>
          <Grid container item direction="column" justifyContent="center" alignItems="center" xs={2}>
            <Divider orientation="vertical" />
            <Button type="submit" startIcon={<SearchIcon />} sx={{ minWidth: 120 }} variant="contained">
              검색
            </Button>
            <Button
              onClick={onReset}
              startIcon={<RotateLeftSharpIcon />}
              sx={{ mt: 2, minWidth: 120 }}
              type="reset"
              variant="contained"
            >
              초기화
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </form>
  );
};
