import { Button, Grid, InputAdornment } from '@material-ui/core';
import SearchIcon from '@assets/icons/Search';
import { FormControlTextField, FormControlSelect } from '.';
import { SearchGoodsFormField } from '../types';
import { ShowtimeGoodsSearchType, ShowtimeGoodsSearchTypeLabel } from '../constants';

interface Props {
  disableAddItem: boolean;
  onAddSelectItem: () => void;
}

const searchTypeOption = Object.keys(ShowtimeGoodsSearchType).map((key) => {
  return {
    label: ShowtimeGoodsSearchTypeLabel[key],
    value: ShowtimeGoodsSearchType[key],
  };
});

export const ShowtimeGoodsSearchForm = ({ disableAddItem, onAddSelectItem }: Props) => {
  return (
    <>
      <Grid container justifyContent="flex-end">
        <FormControlSelect<SearchGoodsFormField>
          name="searchType"
          size="small"
          options={searchTypeOption}
          sx={{ width: '100px' }}
        />
        <FormControlTextField<SearchGoodsFormField>
          name="value"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" />
              </InputAdornment>
            ),
          }}
          size="small"
          sx={{ width: '280px', marginLeft: '10px' }}
        />
        <Button type="submit" variant="contained" color="primary" size="small" sx={{ marginLeft: '10px' }}>
          검색
        </Button>
        <Button
          type="submit"
          variant="contained"
          color="secondary"
          size="small"
          sx={{ marginLeft: '10px' }}
          disabled={disableAddItem}
          onClick={onAddSelectItem}
        >
          선택항목 추가
        </Button>
      </Grid>
    </>
  );
};
