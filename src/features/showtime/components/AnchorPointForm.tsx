import { TOption } from '@components/Select';
import styled from '@emotion/styled';
import { Grid, MenuItem } from '@material-ui/core';
import React from 'react';
import { FormControlTextField, UploadContents, FormLayout, FormControlRadioGroup, FormControlSelect } from '.';
import { AnchorPointImageType, ModalType } from '../constants';
import { ShowtimeAnchorPointFormField, UploadImage } from '../types';

export interface AnchorPointFormProps {
  modalType: ModalType;
  goodsOptions: Array<TOption>;
  imageType: AnchorPointImageType;
  uploadImage: UploadImage;
  activeAnchorPoint: boolean | undefined;
}

const SeekingPositions = ['시간', '분', '초'];

export const AnchorPointForm = React.memo(
  ({ modalType, goodsOptions, imageType, uploadImage, activeAnchorPoint }: AnchorPointFormProps) => {
    const validateSeekingPositionSeconds = (value: string | Array<string>) => {
      if (typeof value !== 'string') {
        return null;
      }

      return isNaN(Number(value)) ? '재생시점 입력형식을 확인하세요' : null;
    };

    return (
      <Grid container justifyContent="flex-end">
        <GridStyled item xs={12}>
          <FormLayout label="앵커포인트 이름" required>
            <FormControlTextField<ShowtimeAnchorPointFormField>
              name="name"
              size="small"
              sx={{ width: '280px' }}
              rules={{ required: '앵커포인트 이름을 입력하세요' }}
            />
          </FormLayout>
        </GridStyled>
        <GridStyled item xs={12}>
          <FormLayout label="이미지 연동">
            <FormControlRadioGroup<ShowtimeAnchorPointFormField>
              name="imageType"
              options={[
                { label: '상품연동', value: AnchorPointImageType.GOODS },
                { label: '직접업로드', value: AnchorPointImageType.UPLOAD },
              ]}
            />
          </FormLayout>
        </GridStyled>
        <GridStyled item xs={12}>
          {imageType === AnchorPointImageType.GOODS ? (
            <FormLayout label="상품 선택">
              <FormControlSelect<ShowtimeAnchorPointFormField>
                name="goodsId"
                options={goodsOptions}
                rules={{ required: '상품을 선택하세요' }}
                displayEmpty
                sx={{ width: '300px' }}
              >
                <MenuItem value="" disabled>
                  상품을 선택하세요
                </MenuItem>
              </FormControlSelect>
            </FormLayout>
          ) : null}

          {imageType === AnchorPointImageType.UPLOAD ? (
            <FormLayout label="직접 업로드">
              <UploadContents
                contents={uploadImage.fileInfos}
                error={uploadImage.error}
                onChangeUploadFile={uploadImage.handleChangeUploadFile}
                onRemoveUploadFile={uploadImage.handleRemoveUploadFile}
              />
            </FormLayout>
          ) : null}
        </GridStyled>

        {modalType === ModalType.MODIFY && activeAnchorPoint && (
          <GridStyled item xs={12}>
            <FormLayout label="재생시점" required>
              {SeekingPositions.map((label, index) => {
                const max = [100, 59, 60][index];
                return (
                  <FormControlTextField<ShowtimeAnchorPointFormField>
                    key={`seekingPositionSeconds.${index}`}
                    name={`seekingPositionSeconds.${index}`}
                    type="number"
                    placeholder={label}
                    rules={{
                      required: `${label}을 입력하세요`,
                      max: { value: max, message: `${max} 넘을수 없습니다.` },
                      min: { value: 0, message: `0보다 큰값을 넣어주세요.` },
                      validate: validateSeekingPositionSeconds,
                    }}
                    size="small"
                    sx={{ width: '90px', marginLeft: index === 0 ? 0 : '10px' }}
                    InputProps={{
                      inputProps: {
                        max,
                        min: 0,
                      },
                    }}
                  />
                );
              })}
            </FormLayout>
          </GridStyled>
        )}
      </Grid>
    );
  },
  (
    {
      modalType: prevModalType,
      goodsOptions: prevGoodsOptions,
      imageType: prevImageType,
      uploadImage: prevUploadImage,
      activeAnchorPoint: prevActiveAnchorPoint,
    },
    {
      modalType: nextModalType,
      goodsOptions: nextGoodsOptions,
      imageType: nextImageType,
      uploadImage: nextUploadImage,
      activeAnchorPoint: nextActiveAnchorPoint,
    },
  ) =>
    prevModalType === nextModalType &&
    Object.is(prevGoodsOptions, nextGoodsOptions) &&
    prevImageType === nextImageType &&
    Object.is(prevUploadImage, nextUploadImage) &&
    prevActiveAnchorPoint === nextActiveAnchorPoint,
);

const GridStyled = styled(Grid)`
  margin-bottom: 10px;
`;
