import { FormControlTextArea, FormControlTextField } from '@components/form';
import { Box, Grid } from '@material-ui/core';
import { ShowtimeContentsItemFormField } from '../types';
import { FormLayout } from './FormLayout';

export const ShowtimeAppPushSetting = () => {
  return (
    <>
      <FormLayout label="메시지 제목 직접입력">
        <FormControlTextField<ShowtimeContentsItemFormField>
          name="pushTitle"
          sx={{ width: '600px' }}
          placeholder="메시지 제목 입력"
        />
      </FormLayout>
      <FormLayout label="메시지 본문 직접입력">
        <FormControlTextArea<ShowtimeContentsItemFormField>
          name="pushContents"
          placeholder="메시지 본문 입력"
          minRows={4}
          width="600px"
        />
        <Box sx={{ width: '100%' }} mt="10px">
          <Box>* 메시지 제목과 본문을 입력하지 않으면 아래 기본포맷으로 발송됩니다.</Box>
          <Box ml="10px">
            <Box mt="5px">제목 : [ 호스트 쇼룸명 ]</Box>
            <Grid container spacing="5px">
              <Grid item>본문 : </Grid>
              <Grid item>
                <Box>라이브 방송 시작 알림</Box>
                <Box>[ 라이브 제목 ]</Box>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </FormLayout>
    </>
  );
};
