import { FormControlTextField } from '@components/form';
import styled from '@emotion/styled';
import { Box, Grid, InputAdornment } from '@material-ui/core';
import { ReactNode } from 'react';
import { ScheduleModifyForm } from '../types';

interface Props {
  children: ReactNode;
}

export const ScheduleTableContentsBannerCTA = ({ children }: Props) => {
  return (
    <>
      <Grid container mt="10px" flexDirection="row">
        <LabelGridStyled item>
          버튼명<LegendStyled>*</LegendStyled>
        </LabelGridStyled>
        <Grid item>
          <FormControlTextField<ScheduleModifyForm>
            name="bannerButtonText"
            inputProps={{ maxLength: 10 }}
            placeholder="10자 이내"
            rules={{ required: '버튼명을 입력하세요' }}
          />
        </Grid>
        <LabelGridStyled item>
          딥링크 URL<LegendStyled>*</LegendStyled>
        </LabelGridStyled>
        <Grid item>
          <Box>
            <FormControlTextField<ScheduleModifyForm>
              name="bannerScheme"
              InputProps={{
                startAdornment: <InputAdornment position="start">prizm://prizm.co.kr</InputAdornment>,
              }}
              rules={{
                required: '딥링크 URL을 입력하세요',
                validate: (value) => {
                  const includeServiceUrl = value.match('prizm://prizm.co.kr');

                  if (includeServiceUrl && includeServiceUrl.length > 0) {
                    return 'prizm://prizm.co.kr를 제외한 path만 입력해 주세요';
                  } else if (!value.match(/^(\/[^/]+)+\/?$/gm)) {
                    return '/를 포함한 path를 입력해 주세요. ex)/content/teaser/123456';
                  }

                  return true;
                },
              }}
              sx={{ width: '400px' }}
            />
          </Box>
          <Box
            component="a"
            href="https://www.notion.so/rxc/Deep-Link-URI-1c164ad8cf8b462c89c870ff9ae3f702"
            target="_blank"
            rel="noreferrer"
            sx={{ mt: 1, color: '#f50057', fontSize: 12 }}
          >
            인앱 딥링크 항목 보기&gt;
          </Box>
        </Grid>
      </Grid>
      <Grid container mt="10px" flexDirection="row">
        <GridStyled item>이미지 파일</GridStyled>
        <Grid item>{children}</Grid>
      </Grid>
    </>
  );
};

const LabelGridStyled = styled(Grid)`
  position: relative;
  display: flex;
  font-weight: 500;
  margin: 20px 20px 0 0;
  align-items: flex-start;

  &:not(:first-of-type) {
    margin: 20px 20px 0 90px;
  }
`;

const GridStyled = styled(Grid)`
  display: flex;
  font-weight: 500;
  margin-right: 20px;
  align-items: center;
`;

const LegendStyled = styled.span`
  position: absolute;
  top: 0;
  right: -12px;
  color: #ff0000;
  font-size: 18px;
`;
