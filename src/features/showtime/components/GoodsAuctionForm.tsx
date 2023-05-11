import styled from '@emotion/styled';
import { Box, Grid, MenuItem, Typography } from '@material-ui/core';
import { ReactNode, useEffect, useState } from 'react';
import { SettlementKindTypeLabel, VatCodeType, VatCodeTypeLabel } from '@constants/goods';
import {
  FormControlInput,
  FormControlTextField,
  UploadContents,
  FormControlTextArea,
  FormLayout,
  FormControlCheckbox,
  FormControlRadioGroup,
  FormControlSelect,
} from '.';
import { AuctionGoodsType, AuctionGoodsTypeLabel, ModalType } from '../constants';
import { TicketGoodsInfoModel, TicketGoodsComboModel } from '../models';
import { ReturnTypeUseShowtimeContentsAuctionGoodsService } from '../services';
import { ShowtimeContentsAuctionGoodsFormField, UploadImage } from '../types';

interface Props {
  primaryImage: UploadImage;
  goodsImage: UploadImage;
  ticketGoodsInfo: TicketGoodsInfoModel;
  keywordComponent: ReactNode;
  formMethod: ReturnTypeUseShowtimeContentsAuctionGoodsService['auction']['formMethod'];
  modalType: ReturnTypeUseShowtimeContentsAuctionGoodsService['auction']['modalType'];
}

/**
 * 주문 출고상태 옵션
 */
const AuctionGoodsTypeOptions = Object.keys(AuctionGoodsType).map((key) => {
  return {
    label: AuctionGoodsTypeLabel[key],
    value: AuctionGoodsType[key],
  };
});

/**
 * 부가세코드 옵션
 */
const VatCodeTypeOptions = Object.keys(VatCodeType).map((key) => {
  return {
    label: VatCodeTypeLabel[key],
    value: VatCodeType[key],
  };
});

export const GoodsAuctionForm = ({
  primaryImage,
  goodsImage,
  ticketGoodsInfo,
  keywordComponent,
  formMethod: {
    watch,
    formState: { errors },
  },
  modalType,
}: Props) => {
  const [ticketGoods, setTicketGoods] = useState<TicketGoodsComboModel>();
  const [startPrice, bidUnitPrice, usedMaximumBidPrice, itemType, ticketId] = watch([
    'startPrice',
    'bidUnitPrice',
    'usedMaximumBidPrice',
    'itemType',
    'ticketId',
  ]);

  useEffect(() => {
    if (!ticketId || ticketGoodsInfo?.items.length === 0) {
      return;
    }
    setTicketGoods(ticketGoodsInfo.items.find((item) => item.id === Number(ticketId)));
  }, [ticketGoodsInfo, ticketId]);

  const isModify = modalType === ModalType.MODIFY;

  return (
    <Grid container justifyContent="flex-end">
      <GridStyled item xs={12}>
        <FormLayout label="경매 상품명" required>
          <FormControlTextField<ShowtimeContentsAuctionGoodsFormField>
            name="name"
            fullWidth
            rules={{ required: '경매 상품명을 입력하세요' }}
          />
        </FormLayout>
      </GridStyled>
      <GridStyled item xs={12}>
        <FormLayout label="경매 상품 검색태그">
          <FormControlTextField<ShowtimeContentsAuctionGoodsFormField>
            name="searchTags"
            fullWidth
            placeholder="복수의 검색태그일 경우에 콤마(,)로 구분해주세요"
          />
        </FormLayout>
      </GridStyled>
      <GridStyled item xs={12}>
        <FormLayout label="시작 입찰가" required>
          <FormControlInput<ShowtimeContentsAuctionGoodsFormField>
            name="startPrice"
            type="number"
            endAdornment="원"
            inputProps={{ min: 0 }}
            rules={{ required: '시작 입찰가를 입력하세요' }}
          />
        </FormLayout>
      </GridStyled>
      <GridStyled item xs={12}>
        <FormLayout label="입찰 단위 금액" required>
          <FormControlInput<ShowtimeContentsAuctionGoodsFormField>
            name="bidUnitPrice"
            type="number"
            endAdornment="원"
            inputProps={{ min: 0 }}
            rules={{ required: '입찰 단위 금액를 입력하세요' }}
          />
        </FormLayout>
      </GridStyled>
      <GridStyled item xs={12}>
        <FormLayout label="입찰 상한가">
          <Box display="flex" flexDirection="column" justifyContent="center">
            <Box flexDirection="row" sx={{ marginBottom: usedMaximumBidPrice ? '10px' : 0 }}>
              <FormControlCheckbox<ShowtimeContentsAuctionGoodsFormField> name="usedMaximumBidPrice" label="사용" />
              <Box display="inline-block" sx={{ color: 'red', marginLeft: '20px' }}>
                * 입찰 상한가에서 입찰이 일시정지 됩니다.
              </Box>
            </Box>
            {usedMaximumBidPrice && (
              <FormControlInput<ShowtimeContentsAuctionGoodsFormField>
                name="maximumBidPrice"
                type="number"
                endAdornment="원"
                inputProps={{ min: Math.max(100, Number(startPrice) + Number(bidUnitPrice)) }}
                rules={{
                  required: '입찰 상한가를 입력하세요',
                  min: {
                    value: Math.max(100, Number(startPrice) + Number(bidUnitPrice)),
                    message: `${Math.max(
                      100,
                      Number(startPrice) + Number(bidUnitPrice),
                    ).toLocaleString()}원 이상의 금액을 입력하세요`,
                  },
                }}
                sx={{ width: '220px' }}
              />
            )}
          </Box>
        </FormLayout>
      </GridStyled>
      <GridStyled item md={12} xs={12}>
        <FormLayout label="상품 분류" required>
          {!isModify ? (
            <FormControlRadioGroup<ShowtimeContentsAuctionGoodsFormField>
              name="itemType"
              options={AuctionGoodsTypeOptions}
            />
          ) : (
            <b>{AuctionGoodsTypeOptions.find((item) => String(item.value) === itemType).label ?? ''}</b>
          )}
        </FormLayout>
      </GridStyled>

      {itemType === AuctionGoodsType.TICKET && (
        <>
          <GridStyled item md={12} xs={12}>
            <FormLayout label="티켓 정보" required>
              {!isModify ? (
                <FormControlSelect<ShowtimeContentsAuctionGoodsFormField>
                  name="ticketId"
                  options={ticketGoodsInfo.options}
                  rules={{ required: '티켓을 선택하세요.' }}
                  displayEmpty
                  sx={{ width: '400px' }}
                >
                  <MenuItem value="" disabled>
                    티켓을 선택하세요
                  </MenuItem>
                </FormControlSelect>
              ) : (
                <b>{ticketGoodsInfo.options.find((item) => String(item.value) === ticketId)?.label ?? ''}</b>
              )}
              <Box p={!isModify ? '10px 10px' : '10px 10px 10px 0'}>
                <b>유효기간: {ticketGoods?.info ?? ''}</b>
              </Box>
            </FormLayout>
          </GridStyled>
        </>
      )}
      <GridStyled item xs={12}>
        <FormLayout label="상품 썸네일 이미지" required>
          <UploadContents
            contents={primaryImage.fileInfos}
            error={primaryImage.error}
            onChangeUploadFile={primaryImage.handleChangeUploadFile}
            onRemoveUploadFile={primaryImage.handleRemoveUploadFile}
          />
        </FormLayout>
      </GridStyled>
      <GridStyled item xs={12}>
        <FormLayout label="상품 대표 콘텐츠" required>
          <UploadContents
            accept="image/*, video/*"
            contents={goodsImage.fileInfos}
            error={goodsImage.error}
            onChangeUploadFile={goodsImage.handleChangeUploadFile}
            onRemoveUploadFile={goodsImage.handleRemoveUploadFile}
            onChangeVideoPlayType={goodsImage.handleChangeVideoPlayType}
            multiple
            maxFiles={10}
          />
        </FormLayout>
      </GridStyled>
      <GridStyled item xs={12}>
        <FormLayout label="정산방식">
          <b>{SettlementKindTypeLabel.BUYING}</b>
        </FormLayout>
      </GridStyled>
      <GridStyled item md={12} xs={12}>
        <FormLayout label="부가세 코드 등록" required>
          <FormControlRadioGroup<ShowtimeContentsAuctionGoodsFormField>
            name="vatCode"
            options={VatCodeTypeOptions}
            rules={{ required: '부가세 코드 등록을 선택하세요' }}
          />
          {errors.vatCode?.message && (
            <TypographyStyled className="error-message" variant="caption" sx={{ mt: 0 }}>
              {errors.vatCode.message}
            </TypographyStyled>
          )}
        </FormLayout>
      </GridStyled>
      <GridStyled item xs={12}>
        <FormLayout label="상품설명" required>
          <FormControlTextArea<ShowtimeContentsAuctionGoodsFormField>
            name="description"
            minRows={4}
            width="400px"
            rules={{ required: '상품설명을 입력하세요' }}
          />
        </FormLayout>
      </GridStyled>
      <GridStyled item xs={12}>
        <FormLayout label="전시시작일" required>
          <FormControlTextField<ShowtimeContentsAuctionGoodsFormField>
            name="displayStartDate"
            type="datetime-local"
            InputLabelProps={{
              shrink: true,
            }}
            rules={{ required: '전시시작 일시를 선택하세요' }}
          />
        </FormLayout>
      </GridStyled>
      <GridStyled item xs={12}>
        <FormLayout label="키워드 관리">{keywordComponent}</FormLayout>
      </GridStyled>
    </Grid>
  );
};

const GridStyled = styled(Grid)`
  margin-bottom: 10px;
`;

const TypographyStyled = styled(Typography)`
  &.error-message {
    color: ${({ theme }) => theme.palette.error.main};
  }
`;
