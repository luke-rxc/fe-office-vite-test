import { FormControlTextArea, FormControlTextField } from '@components/form';
import { FormControlColorPicker } from '@components/form/FormControlColorPicker';
import styled from '@emotion/styled';
import { Grid } from '@material-ui/core';
import { ReactNode } from 'react';
import { ScheduleTableContentsBanner, ScheduleTableContentsLanding, ScheduleTableContentsStatus } from '.';
import { ScheduleTableDetailItemModel } from '../models';
import { ScheduleModifyForm } from '../types';
import { FormLayout } from './FormLayout';

interface Props {
  item: ScheduleTableDetailItemModel;
  bgImagesComponent: ReactNode;
  chromakeyImagesComponent?: ReactNode;
  bannerImagesComponent?: ReactNode;
}

export const ScheduleTableContentsInfo = ({
  item,
  bgImagesComponent,
  chromakeyImagesComponent,
  bannerImagesComponent,
}: Props) => {
  const validateBackgroundColor = (value: string) => {
    if (!/^#/.test(value)) {
      return '백그라운드 컬러 앞에 #을 추가해주세요';
    } else if (value.length !== 7) {
      return '백그라운드 컬러는 앞에 #을 제외한 6자리이어야 합니다';
    }

    return null;
  };

  return (
    <Grid container direction="row" justifyContent="flex-start" alignItems="flex-start">
      <GridStyled item md={12} xs={12}>
        <FormLayout label="편성 제목" required>
          <FormControlTextField<ScheduleModifyForm>
            name="title"
            sx={{ width: '400px' }}
            rules={{ required: '편성 제목을 입력하세요' }}
          />
        </FormLayout>
      </GridStyled>
      <GridStyled item md={12} xs={12}>
        <FormLayout label="내용" required>
          <FormControlTextArea<ScheduleModifyForm>
            name="subtitle"
            minRows={4}
            width="400px"
            rules={{ required: '내용을 입력하세요' }}
          />
        </FormLayout>
      </GridStyled>
      <GridStyled item md={6} xs={12}>
        <FormLayout label="백그라운드 이미지" required>
          {bgImagesComponent}
        </FormLayout>
      </GridStyled>
      <GridStyled item md={6} xs={12}>
        <FormLayout label="크로마키 이미지" required>
          {chromakeyImagesComponent}
        </FormLayout>
      </GridStyled>
      <GridStyled item md={12} xs={12}>
        <FormLayout label="백그라운드 컬러" required>
          <FormControlColorPicker<ScheduleModifyForm>
            name="bgColor"
            placeholder="백그라운드 컬러 코드 입력 (ex.#2e89ff)"
            rules={{ required: '백그라운드 컬러를 입력(선택)하세요', validate: validateBackgroundColor }}
            fullWidth={false}
            sx={{ width: '400px' }}
          />
        </FormLayout>
      </GridStyled>
      <GridStyled item md={12} xs={12}>
        <FormLayout label="랜딩 설정" required>
          <ScheduleTableContentsLanding />
        </FormLayout>
      </GridStyled>
      <GridStyled item md={12} xs={12}>
        <FormLayout label="부가 정보 설정" required>
          <ScheduleTableContentsBanner
            items={item?.bannerGoodsList ?? []}
            bannerImagesComponent={bannerImagesComponent}
          />
        </FormLayout>
      </GridStyled>
      <GridStyled item md={12} xs={12}>
        <FormLayout label="공개상태" required>
          <ScheduleTableContentsStatus />
        </FormLayout>
      </GridStyled>
    </Grid>
  );
};

const GridStyled = styled(Grid)`
  margin-bottom: 10px;
`;
