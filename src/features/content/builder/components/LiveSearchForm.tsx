import { useState, VFC } from 'react';
import { useFormContext } from 'react-hook-form';
import { Paper, Grid, Divider, Button, List, ListItem, Box } from '@material-ui/core';
import RotateLeftSharpIcon from '@material-ui/icons/RotateLeftSharp';
import SearchIcon from '@material-ui/icons/Search';
import { ListTitle } from '@components/ListTitle';
import { Checkbox } from '@components/Checkbox';
import { LIVE_SEARCH_FIELD_OPTIONS, LIVE_OPEN_STATUS_OPTIONS } from '../constants';
import { LiveSearchFieldModel, ComboItemModel, ContentShowroomModel } from '../models';
import { FormControlAutoComplete, FormControlRadioGroup, FormControlSelect, FormControlTextField } from './form';

/**
 * 라이브 검색 폼
 */
type LiveSearchFormProps = {
  showroom: ContentShowroomModel;
  showroomOptions: ComboItemModel[];
  onSearch: () => void;
  onReset: () => void;
};
export const LiveSearchForm: VFC<LiveSearchFormProps> = ({ showroom, showroomOptions, onSearch, onReset }) => {
  const { setValue, watch } = useFormContext();
  const [checkedShowroom, setCheckedShowroom] = useState(false);
  const openStatuses = watch('openStatuses');
  const handleReset = () => {
    setCheckedShowroom(false);
    onReset();
  };

  return (
    <Paper elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: 1, p: 2 }}>
      <Grid container>
        <Grid container item xs={10}>
          <List sx={{ width: '100%' }}>
            <ListItem sx={{ mb: 2 }}>
              <ListTitle name="콘텐츠 제목/콘텐츠 번호" sx={{ width: 200 }} />
              <Box sx={{ width: '100%' }}>
                <Grid container spacing={1}>
                  <Grid item xs={3}>
                    <FormControlSelect<LiveSearchFieldModel>
                      name="searchField"
                      label="검색어조건"
                      options={LIVE_SEARCH_FIELD_OPTIONS}
                      autoWidth
                    />
                  </Grid>
                  <Grid item xs={9}>
                    <FormControlTextField<LiveSearchFieldModel>
                      name="keyword"
                      label="검색어 입력"
                      sx={{ width: '100%' }}
                    />
                  </Grid>
                </Grid>
              </Box>
            </ListItem>
            <ListItem sx={{ mb: 2 }}>
              <ListTitle name="쇼룸" sx={{ width: 200 }} />
              <Box sx={{ width: '100%' }}>
                {showroomOptions && (
                  <>
                    <FormControlAutoComplete<LiveSearchFieldModel>
                      name="showRoomIds"
                      fullWidth
                      multiple
                      options={showroomOptions}
                      getOptionLabel={({ label }: ComboItemModel) => label}
                      isOptionEqualToValue={(v: ComboItemModel, o: ComboItemModel) => v.value === o.value}
                      placeholder="쇼룸 선택"
                      sx={{ width: '100%' }}
                      disabled={checkedShowroom}
                    />
                    <Checkbox
                      label="나의 쇼룸 콘텐츠"
                      checked={checkedShowroom}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        setCheckedShowroom(checked);
                        setValue('showRoomIds', checked ? [{ label: showroom.name, value: showroom.id }] : []);
                      }}
                    />
                  </>
                )}
              </Box>
            </ListItem>
            <ListItem>
              <ListTitle name="공개상태" sx={{ width: 200 }} />
              <Box sx={{ width: '100%' }}>
                <FormControlRadioGroup
                  row
                  name="openStatuses"
                  value={openStatuses}
                  options={[{ label: '전체', value: '' }, ...LIVE_OPEN_STATUS_OPTIONS]}
                />
              </Box>
            </ListItem>
          </List>
        </Grid>
        <Grid container item direction="column" justifyContent="center" alignItems="center" xs={2}>
          <Divider orientation="vertical" />
          <Button
            onClick={onSearch}
            startIcon={<SearchIcon />}
            sx={{ minWidth: 120 }}
            type="button"
            variant="contained"
          >
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
    </Paper>
  );
};
