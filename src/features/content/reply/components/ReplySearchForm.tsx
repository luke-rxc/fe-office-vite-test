import { Paper, Grid, Divider, Button, List, Box } from '@material-ui/core';
import RotateLeftSharpIcon from '@material-ui/icons/RotateLeftSharp';
import SearchIcon from '@material-ui/icons/Search';
import { toDateFormat } from '@utils/date';
import { REPLY_SEARCH_DATE_TYPE_OPTIONS, REPLY_SEARCH_TYPE_OPTIONS, REPLY_STATUS_OPTIONS } from '../constants';
import { ContentReplyFormProps, ReplySearchFieldModel } from '../models';
import {
  FormControlDatePicker,
  FormControlRadioGroup,
  FormControlSelect,
  FormControlTextField,
  FormControlCheckbox,
} from './form';
import { ListItemWrapper } from './Styled';

/**
 * 콘텐츠 댓글 검색
 */
type ReplySearchFormProps = {
  form: ContentReplyFormProps<ReplySearchFieldModel>;
};

export const ReplySearchForm = ({ form }: ReplySearchFormProps) => {
  const { handleSubmit, handleReset, formMethod } = form;
  const { setValue } = formMethod;

  const handleChangeStartDate = (date: Date) => {
    const newTime = new Date(`${toDateFormat(date, 'yyyy/MM/dd')} 00:00:00`).getTime();
    setValue('startDate', newTime);
  };

  const handleChangeEndDate = (date: Date) => {
    const newTime = new Date(`${toDateFormat(date, 'yyyy/MM/dd')} 23:59:59`).getTime();
    setValue('endDate', newTime);
  };

  return (
    <Paper elevation={0} sx={{ padding: 3 }}>
      <form onSubmit={handleSubmit}>
        <Grid container>
          <Grid container item xs={10}>
            <List sx={{ width: '100%' }}>
              <ListItemWrapper listTitleName="사용자조회" listTitleWidth={130}>
                <Box sx={{ width: '100%' }}>
                  <Grid container item spacing={1}>
                    <Grid item xs={3}>
                      <FormControlSelect<ReplySearchFieldModel>
                        name="searchType"
                        label="사용자 닉네임/이메일"
                        options={REPLY_SEARCH_TYPE_OPTIONS}
                        autoWidth
                        sx={{ width: '100%' }}
                      />
                    </Grid>
                    <Grid item xs={9}>
                      <FormControlTextField<ReplySearchFieldModel>
                        name="keyword"
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
                      <FormControlSelect<ReplySearchFieldModel>
                        name="periodDateType"
                        label="기간조회"
                        options={REPLY_SEARCH_DATE_TYPE_OPTIONS}
                        autoWidth
                      />
                    </Grid>
                    <Grid item container xs={9} spacing={1}>
                      <Grid item xs={6}>
                        <FormControlDatePicker<ReplySearchFieldModel>
                          name="startDate"
                          label="날짜 검색범위(시작)"
                          onChangeDate={handleChangeStartDate}
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <FormControlDatePicker<ReplySearchFieldModel>
                          name="endDate"
                          label="날짜 검색범위(종료)"
                          onChangeDate={handleChangeEndDate}
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                </Box>
              </ListItemWrapper>
            </List>
            <List sx={{ width: '100%' }}>
              <ListItemWrapper listTitleName="댓글 상태" listTitleWidth={130}>
                <Box sx={{ width: '100%' }}>
                  <FormControlRadioGroup<ReplySearchFieldModel>
                    name="status"
                    options={[{ label: '전체', value: '' }, ...REPLY_STATUS_OPTIONS]}
                  />
                </Box>
              </ListItemWrapper>
            </List>
            <List sx={{ width: '100%' }}>
              <ListItemWrapper listTitleName="댓글 신고" listTitleWidth={130}>
                <Box sx={{ width: '100%' }}>
                  <FormControlCheckbox<ReplySearchFieldModel> name="isReport" label="신고 댓글 모아보기" />
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
