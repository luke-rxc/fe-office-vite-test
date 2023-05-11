import styled from '@emotion/styled';
import { Grid } from '@material-ui/core';
import { ShowtimeContentsItemFormField } from '../types';
import { KeywordComboItemModel, ShowroomComboItemModel } from '../models';
import { FormLayout } from './FormLayout';
import { ReactNode } from 'react';
import { FormControlTextField, FormControlTextArea } from '.';
import { useFormContext } from 'react-hook-form';
import { FormControlAutoComplete } from '@components/form';

interface Props {
  keywordOptions: Array<KeywordComboItemModel>;
  showroomOptions: Array<ShowroomComboItemModel>;
  primaryImagesComponent: ReactNode;
  goodsStandardTypeComponent: ReactNode;
  goodsAuctionTypeComponent: ReactNode | null;
}

export const ShowtimeBaseInformation = ({
  // keywordOptions,
  showroomOptions,
  primaryImagesComponent,
  goodsStandardTypeComponent,
  goodsAuctionTypeComponent,
}: Props) => {
  const { watch } = useFormContext<ShowtimeContentsItemFormField>();
  const isLimitCollaborationShowRoom = watch('guestShowRoomIds').length >= 4;

  return (
    <Grid container direction="row" justifyContent="flex-start" alignItems="flex-start">
      <GridStyled item md={12}>
        <FormLayout label="라이브 제목" required>
          <FormControlTextField<ShowtimeContentsItemFormField>
            name="title"
            sx={{ width: '600px' }}
            rules={{ required: '라이브 제목을 입력하세요' }}
          />
        </FormLayout>
      </GridStyled>

      <GridStyled item md={12}>
        <FormLayout label="라이브설명" required>
          <FormControlTextArea<ShowtimeContentsItemFormField>
            name="description"
            minRows={4}
            width="600px"
            rules={{ required: '라이브 설명을 입력하세요' }}
          />
        </FormLayout>
      </GridStyled>

      <GridStyled item md={12} xs={12}>
        <FormLayout label="대표이미지" required>
          {primaryImagesComponent}
        </FormLayout>
      </GridStyled>

      <GridStyled item md={12} xs={12}>
        {goodsStandardTypeComponent}
      </GridStyled>
      {goodsAuctionTypeComponent && (
        <GridStyled item md={12} xs={12}>
          {goodsAuctionTypeComponent}
        </GridStyled>
      )}
      {(showroomOptions || []).length > 0 && (
        <GridStyled item md={12} xs={12}>
          <FormLayout label="호스트 쇼룸" required>
            <FormControlAutoComplete<ShowtimeContentsItemFormField>
              name="showRoomId"
              options={showroomOptions}
              getOptionLabel={({ label, value }: ShowroomComboItemModel) => `${label} (${value})`}
              isOptionEqualToValue={(v: ShowroomComboItemModel, o: ShowroomComboItemModel) => v?.value === o?.value}
              placeholder="호스트 쇼룸 선택"
              rules={{ required: '호스트 쇼룸을 선택하세요.' }}
              sx={{ width: '600px' }}
            />
          </FormLayout>
        </GridStyled>
      )}
      {(showroomOptions || []).length > 0 && (
        <GridStyled item md={12} xs={12}>
          <FormLayout label="게스트 쇼룸">
            <FormControlAutoComplete<ShowtimeContentsItemFormField>
              name="guestShowRoomIds"
              multiple
              options={showroomOptions}
              getOptionLabel={({ label, value }: ShowroomComboItemModel) => `${label} (${value})`}
              isOptionEqualToValue={(v: ShowroomComboItemModel, o: ShowroomComboItemModel) => v?.value === o?.value}
              placeholder="게스트 쇼룸 선택 (최대 4개)"
              sx={{ width: '600px' }}
              isLimit={isLimitCollaborationShowRoom}
            />
          </FormLayout>
        </GridStyled>
      )}
    </Grid>
  );
};

const GridStyled = styled(Grid)`
  margin-bottom: 10px;
`;
