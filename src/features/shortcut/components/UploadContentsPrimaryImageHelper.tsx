import { Grid, Typography } from '@material-ui/core';
import React from 'react';

interface Props {
  helperLabels?: Array<Array<string>>;
}

export const UploadContentsPrimaryImageHelper = ({
  helperLabels = [
    ['이미지 업로드 가이드', '권장 이미지 사이즈: 1080 X 288 px', '이미지 파일 형식: jpg, png'],
    ['동영상 업로드 가이드', '권장 해상도: 1080 X 288 px', '동영상 파일 형식: mp4'],
  ],
}: Props) => {
  return (
    <>
      <Grid item>
        {helperLabels.map((helperLabelItems) => {
          return helperLabelItems.map((item, index) => {
            if (index === 0) {
              return (
                <Typography key={item} sx={{ mt: 2 }} color="primary" variant="subtitle2">
                  {item}
                </Typography>
              );
            }

            return (
              <React.Fragment key={item}>
                <Typography sx={{ ml: 1 }} variant="caption">
                  - {item}
                </Typography>
                <br />
              </React.Fragment>
            );
          });
        })}
      </Grid>
    </>
  );
};
