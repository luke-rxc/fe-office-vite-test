import { Paper, Grid, Divider, Button, List, Box, ButtonGroup } from '@material-ui/core';
import RotateLeftSharpIcon from '@material-ui/icons/RotateLeftSharp';
import SearchIcon from '@material-ui/icons/Search';
import {
  CONTENT_SEARCH_DATE_PERIOD_OPTIONS,
  CONTENT_SEARCH_DATE_TYPE_OPTIONS,
  CONTENT_SEARCH_TYPE_OPTIONS,
  CONTENT_STATUS_OPTIONS,
} from '../constants';
import { ContentSearchFieldModel, ContentFormProps, ComboItemModel } from '../models';
import { DateRangeModel } from '../services';
import {
  FormControlAutoComplete,
  FormControlDatePicker,
  FormControlRadioGroup,
  FormControlSelect,
  FormControlTextField,
} from './form';
import { ListItemWrapper } from './Styled';

/**
 * 콘텐츠 검색
 */
type ContentSearchFormProps = {
  form: ContentFormProps<ContentSearchFieldModel>;
  keywordComboList: ComboItemModel[];
  onChangeDateRange: (range: DateRangeModel) => void;
};

export const ContentSearchForm = ({ form, onChangeDateRange, keywordComboList }: ContentSearchFormProps) => {
  const { handleSubmit, handleReset } = form;
  const onClickRange = (range: DateRangeModel) => {
    return () => onChangeDateRange(range);
  };

  return (
    <Paper elevation={0} sx={{ padding: 3 }}>
      <form onSubmit={handleSubmit}>
        <Grid container>
          <Grid container item xs={10}>
            <List sx={{ width: '100%' }}>
              <ListItemWrapper listTitleName="검색어" listTitleWidth={130}>
                <Box sx={{ width: '100%' }}>
                  <Grid container item spacing={1}>
                    <Grid item xs={3}>
                      <FormControlSelect<ContentSearchFieldModel>
                        name="searchType"
                        label="검색어조건"
                        options={CONTENT_SEARCH_TYPE_OPTIONS}
                        autoWidth
                        sx={{ width: '100%' }}
                      />
                    </Grid>
                    <Grid item xs={9}>
                      <FormControlTextField<ContentSearchFieldModel>
                        name="searchValue"
                        label="검색어 입력"
                        sx={{ width: '100%' }}
                      />
                    </Grid>
                  </Grid>
                </Box>
              </ListItemWrapper>
            </List>
            <List sx={{ width: '100%' }}>
              <ListItemWrapper listTitleName="기간조회" listTitleWidth={130}>
                <Box sx={{ width: '100%' }}>
                  <Grid container item spacing={1}>
                    <Grid item xs={3}>
                      <FormControlSelect<ContentSearchFieldModel>
                        name="searchDateType"
                        label="기간조회"
                        options={CONTENT_SEARCH_DATE_TYPE_OPTIONS}
                        autoWidth
                      />
                    </Grid>
                    <Grid item container xs={9} spacing={1}>
                      <Grid item xs={6}>
                        <FormControlDatePicker<ContentSearchFieldModel>
                          name="searchStartDate"
                          label="날짜 검색범위(시작)"
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <FormControlDatePicker<ContentSearchFieldModel>
                          name="searchEndDate"
                          label="날짜 검색범위(종료)"
                        />
                      </Grid>
                      <Grid item xs={12} display="flex" alignItems="center">
                        <ButtonGroup sx={{ alignSelf: 'flex-start', height: '56px' }}>
                          {CONTENT_SEARCH_DATE_PERIOD_OPTIONS.map(
                            (period: { label: string; value: DateRangeModel }, index) => (
                              <Button key={index} onClick={onClickRange(period.value)}>
                                {period.label}
                              </Button>
                            ),
                          )}
                        </ButtonGroup>
                      </Grid>
                    </Grid>
                  </Grid>
                </Box>
              </ListItemWrapper>
            </List>
            <List sx={{ width: '100%' }}>
              <ListItemWrapper listTitleName="키워드" listTitleWidth={130}>
                <Box sx={{ width: '100%' }}>
                  <FormControlAutoComplete<ContentSearchFieldModel>
                    name="keywordIds"
                    fullWidth
                    multiple
                    options={keywordComboList}
                    getOptionLabel={({ label }: ComboItemModel) => label}
                    isOptionEqualToValue={(v: ComboItemModel, o: ComboItemModel) => v.value === o.value}
                    placeholder="키워드선택"
                    sx={{ width: '100%' }}
                  />
                </Box>
              </ListItemWrapper>
            </List>
            <List sx={{ width: '100%' }}>
              <ListItemWrapper listTitleName="공개상태" listTitleWidth={130}>
                <Box sx={{ width: '100%' }}>
                  <FormControlRadioGroup<ContentSearchFieldModel>
                    name="statusList"
                    options={[{ label: '전체', value: '' }, ...CONTENT_STATUS_OPTIONS]}
                  />
                </Box>
              </ListItemWrapper>
            </List>
          </Grid>
          <Grid container item direction="column" justifyContent="center" alignItems="center" xs={2}>
            <Divider orientation="vertical" />
            <Button startIcon={<SearchIcon />} sx={{ minWidth: 120 }} type="submit" variant="contained">
              검색
            </Button>
            <Button
              onClick={handleReset}
              startIcon={<RotateLeftSharpIcon />}
              sx={{ mt: 2, minWidth: 120 }}
              type="reset"
              variant="contained"
            >
              초기화
            </Button>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
};
