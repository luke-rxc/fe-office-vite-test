import { useEffect, useState } from 'react';
import type { VFC } from 'react';
import { useParams } from 'react-router';
import { Link as RouterLink } from 'react-router-dom';
import { useFormContext } from 'react-hook-form';
import { List, Grid, Typography, Box, Paper, Divider } from '@material-ui/core';
import { FORM_KEY, REPLY_NOTICE_TITLE_MAX_NUM, REPLY_NOTICE_SUBTITLE_MAX_NUM } from '../../constants';
import { ContentFormModel, ContentModel, FormContentReplyModel } from '../../models';
import { FormControlSwitch } from '../form';
import { ListItemWrapper } from '../Styled';
import { TextController } from '../TextController';
import { PreviewArcodian } from '../PreviewArcodian';

/**
 * 댓글 컴포넌트
 */
type ContentReplyProps = {
  content: ContentModel;
};
export const ContentReply: VFC<ContentReplyProps> = ({ content }) => {
  const { id: contentId } = useParams();
  const { id } = content;
  const { getValues, setValue } = useFormContext();
  const formValue: ContentFormModel = getValues(`${id}`);
  // 콘텐츠 정보
  const { useNotice, noticeTitle, noticeSubTitle } = formValue[FORM_KEY.CONTENTS] as FormContentReplyModel;

  const [isUseNotice, setIsUseNotice] = useState<boolean>(useNotice);

  /**
   * 초기 조건값으로 렌더가 되지 않은 폼데이터들은 formValue에서 키 값이 삭제되는 이슈.
   * 초기 렌더 시점에 formValue를 강제로 한번 업데이트 한다.
   */
  useEffect(() => {
    setValue(`${id}.${FORM_KEY.CONTENTS}`, {
      ...formValue[FORM_KEY.CONTENTS],
      useNotice,
      noticeTitle,
      noticeSubTitle,
    });
    setValue(`${id}.${FORM_KEY.MEDIA_UPLOADER}`, {
      ...formValue[FORM_KEY.MEDIA_UPLOADER],
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <PreviewArcodian
        title="댓글 컴포넌트"
        previewImage={['story/20220315/3e0202e2-b154-4a7e-a3fd-ddf8dceb37eb.jpeg']}
      />

      {/* 댓글 */}
      <Paper elevation={2} sx={{ p: 3, mt: 10 }}>
        <Typography color="textPrimary" variant="h6">
          텍스트 설정
        </Typography>
        <Box sx={{ mt: 1, width: '100%' }}>
          <Box component="span" sx={{ fontSize: '13px' }}>
            *작성된 댓글 관리는&nbsp;
            <RouterLink to={`/content/reply/${contentId}`} target="_" style={{ color: '#f50057' }}>
              댓글관리
            </RouterLink>
            &nbsp;페이지에서 가능합니다.
          </Box>
        </Box>
        <List>
          {/* 텍스트 등록 */}
          <ListItemWrapper listTitleName="텍스트 등록 (안내문구 등록 설정)">
            <Box sx={{ width: '100%' }}>
              <Grid container item>
                <Box sx={{ width: '100%' }}>
                  <FormControlSwitch
                    name={`${id}.${FORM_KEY.CONTENTS}.useNotice`}
                    defaultValue={useNotice}
                    onChangeSwitch={(value) => setIsUseNotice(value)}
                  />
                </Box>
              </Grid>
            </Box>
          </ListItemWrapper>
          {isUseNotice && (
            <Box>
              <Divider sx={{ mt: 3, mb: 3 }} />
              {/* 알림 타이틀 */}
              <ListItemWrapper isRequired listTitleName="타이틀">
                <Box sx={{ width: '100%' }}>
                  <Grid container item>
                    <Box sx={{ width: '100%' }}>
                      <TextController
                        textInputProps={{
                          name: `${id}.${FORM_KEY.CONTENTS}.noticeTitle.text`,
                          defaultValue: noticeTitle?.text,
                          placeholder: `타이틀을 입력하세요(띄워쓰기 포함 최대 ${REPLY_NOTICE_TITLE_MAX_NUM}자 이내)`,
                          inputProps: { max: REPLY_NOTICE_TITLE_MAX_NUM },
                          multiline: true,
                        }}
                      />
                    </Box>
                  </Grid>
                </Box>
              </ListItemWrapper>
              {/* 알림 서브타이틀 */}
              <ListItemWrapper isRequired listTitleName="서브타이틀">
                <Box sx={{ width: '100%' }}>
                  <Grid container item>
                    <Box sx={{ width: '100%' }}>
                      <TextController
                        textInputProps={{
                          name: `${id}.${FORM_KEY.CONTENTS}.noticeSubTitle.text`,
                          defaultValue: noticeSubTitle?.text,
                          placeholder: `서브 타이틀을 입력하세요(띄워쓰기 포함 최대 ${REPLY_NOTICE_SUBTITLE_MAX_NUM}자 이내)`,
                          inputProps: { max: REPLY_NOTICE_SUBTITLE_MAX_NUM },
                          multiline: true,
                        }}
                      />
                    </Box>
                  </Grid>
                </Box>
              </ListItemWrapper>
            </Box>
          )}
        </List>
      </Paper>
    </>
  );
};
