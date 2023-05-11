import debounce from 'lodash/debounce';
import { useFormContext } from 'react-hook-form';
import { Card, Divider, CardContent, CardHeader, Typography, List, ListItem, Grid, Box, Link } from '@material-ui/core';
import styled from '@emotion/styled';
import type { Theme } from '@material-ui/core';
import type { SxProps } from '@material-ui/system';
import { ListTitle } from '@components/ListTitle';
import { UploadFileInfo } from '@models/UploadModel';
import { GoodsKind, PurchaseLimitedType, SettlementKindType } from '@constants/goods';
import {
  FormControlRadioGroup,
  FormControlTextField,
  FormControlSelect,
  FormControlDatePickerLocal,
  FormControlAutoComplete,
  FormControlCheckbox,
} from '@components/form';
import { useCount, useLogger, usePageType } from '../hooks';
import {
  CategorySelectItemModel,
  ComboModel,
  ProviderModel,
  TicketModel,
  TicketGroupModel,
  GoodsInfoResModel,
  TicketInfoModel,
  StateModel,
} from '../models';
import { GoodsCategory } from '../components';
import { GoodsType, PageType, FeedConfigTypeOptions, FeedConfigTypeLabel } from '../constants';
import { TextField } from '../components/form';
import { DetailUpload, DetailTicketInfo } from '../components/detailBase';
import { DetailToolTip } from '../components/detail';
import {
  MaxPurchaseLimit,
  DetailListTitleWidth,
  MaxPurchaseLimitOptions,
  GoodsTypeOptions,
  GoodsNameMaxLength,
  DetailBaseCategoryFieldKeys,
  BooleanOptions,
  GoodsKindOptions,
  PurchaseLimitedTypeOptions,
  SettlementKindOptions,
  VatCodeOptions,
} from '../constants';
import { useBrandInProviderService } from '../services';
import { useDetailBaseService, useDetailUploadService } from '../services/detailBase';

interface Props {
  initCategoryItemInfos?: CategorySelectItemModel[];
  initKcFileList?: UploadFileInfo[];
  initCertFileList?: UploadFileInfo[];
  initTicket?: GoodsInfoResModel['ticket'] | null;
  keywordListOptions: ComboModel[];
  providerInfo: ProviderModel;
  ticketNormalListOptions?: TicketModel[];
  ticketAgentListOptions?: TicketModel[];
  ticketAgentGroupListOptions?: TicketGroupModel[];
  selectedGoodsKind: GoodsKind;
  selectedTicketInfo: TicketInfoModel | null;
  isTempListLoadStatus?: boolean;
  onSelectTicketAgent?: () => void;
  onSelectTicketAgentGroup?: () => void;
  onSelectTicketInfo: (ticketInfo: TicketInfoModel | null) => void;
  onChangeGoodsKind?: (goodsKind: GoodsKind) => void;
  onUpdateCommission: (commissionRate: number) => void;
}

const { base: listTitleWidth } = DetailListTitleWidth;

export const DetailBaseContainer: React.FC<Props> = ({
  initCategoryItemInfos,
  initKcFileList,
  initCertFileList,
  initTicket,
  keywordListOptions,
  providerInfo,
  ticketNormalListOptions,
  ticketAgentListOptions,
  ticketAgentGroupListOptions,
  selectedGoodsKind,
  selectedTicketInfo,
  isTempListLoadStatus = false,
  onSelectTicketAgent,
  onSelectTicketAgentGroup,
  onSelectTicketInfo,
  onChangeGoodsKind,
  onUpdateCommission,
}) => {
  const {
    formState: { errors },
    getValues,
  } = useFormContext();
  const { type: pageType, isPartnerSite } = usePageType();
  const { count: goodsNameCount, handleInputLength } = useCount(getValues('name')?.length ?? 0);
  const {
    categoryInfos,
    watchAlwaysDateTime,
    watchUserMaxPurchaseLimit,
    watchLimitedType,
    watchLimitedTypeYn,
    watchKcAuthYn,
    watchGoodsType,
    watchSettlementKind,
    getDisabledSelectTicketUi,
    handleChangeCategory,
    handleSameSalesTime,
    handleChangeBrand,
    handleChangeTicket,
    handleChangeTicketGroup,
    handleChangeGoodsKind,
  } = useDetailBaseService({
    initCategoryItemInfos: initCategoryItemInfos ?? null,
    initTicket: initTicket ?? null,
    providerId: providerInfo?.value,
    selectedGoodsKind,
    ticketNormalListOptions,
    ticketAgentListOptions,
    isTempListLoadStatus,
    onSelectTicketAgent,
    onSelectTicketAgentGroup,
    onSelectTicketInfo,
    onChangeGoodsKind,
    onUpdateCommission,
  });

  /**
   * KC Upload
   */
  const {
    fileInfos: kcFileInfos,
    validErrorMessage: ValidErrorMessageKcUpload,
    handleChangeUpload: handleChangeKcUpload,
    handleRemove: handleRemoveKcUpload,
  } = useDetailUploadService({
    initFileInfos: initKcFileList ?? [],
    fieldValueName: 'kcFileList',
  });

  /**
   * 법적 허가/신고 필수 서류 Upload
   */
  const {
    fileInfos: certFileInfos,
    validErrorMessage: ValidErrorMessageCertUpload,
    handleChangeUpload: handleChangeCertUpload,
    handleRemove: handleRemoveCertUpload,
  } = useDetailUploadService({
    initFileInfos: initCertFileList ?? [],
    fieldValueName: 'certificationList',
  });

  // 브랜드
  const { brandLists: brandListOptions } = useBrandInProviderService({ providerId: providerInfo?.value });

  useLogger('DetailBaseContainer');

  return (
    <Card>
      <CardHeader title="기본정보" />
      <Divider />
      <CardContent>
        <List>
          {/* 파트너 입점사명 */}
          <ListItemWrapper listTitleName="입점사명" isView={isPartnerSite}>
            {providerInfo?.label}
          </ListItemWrapper>
          {/* // 파트너 입점사명 */}

          {/* 상품 유형 */}
          <ListItemWrapper
            listTitleName="상품유형"
            isRequired
            toolTip={`- 일반 상품 : 일반 실물 배송 상품\r\n- 프리오더 : 한정된 수량 판매 및 선주문 제작 방식의 상품`}
          >
            <>
              <FormControlRadioGroup<StateModel>
                name="goodsType"
                options={GoodsTypeOptions}
                row
                disabled={pageType !== PageType.CREATE && selectedGoodsKind !== GoodsKind.REAL}
              />
              <Typography color="primary" variant="body2" sx={{ ml: 1 }}>
                프리오더로 선택하시면 상품분류는 "실물"로만 선택 가능합니다.
              </Typography>
            </>
          </ListItemWrapper>
          {/* // 상품 유형 */}

          {/* 상품분류 */}
          <ListItemWrapper listTitleName="상품분류" isRequired isView={!isPartnerSite}>
            <FormControlRadioGroup<StateModel>
              name="goodsKind"
              options={GoodsKindOptions}
              row
              onChange={(evt: React.ChangeEvent<HTMLInputElement>) =>
                handleChangeGoodsKind(evt.target.value as GoodsKind)
              }
              disabled={pageType !== PageType.CREATE || watchGoodsType === GoodsType.PREORDER}
            />
          </ListItemWrapper>
          {/* // 상품분류 */}

          {/* 상품분류 - 티켓상품 */}
          <ListItemWrapper
            isView={selectedGoodsKind !== GoodsKind.REAL}
            listTitleName={selectedGoodsKind === GoodsKind.TICKET_NORMAL ? '티켓(일반) 선택' : '티켓(연동) 선택'}
            isRequired
          >
            {/* 티켓 연동 그룹 */}
            {selectedGoodsKind === GoodsKind.TICKET_AGENT && ticketAgentGroupListOptions && (
              <FormControlSelect<StateModel>
                label="티켓그룹 선택"
                name="ticketGroupId"
                options={ticketAgentGroupListOptions}
                sx={{ width: '300px', mr: 2 }}
                placeholder="티켓그룹을 선택해주세요"
                showError={!!errors.ticketGroupId}
                onChange={handleChangeTicketGroup}
                disabled={pageType === PageType.MODIFY}
              />
            )}
            <FormControlSelect<StateModel>
              label="티켓 선택"
              name="ticketId"
              options={selectedGoodsKind === GoodsKind.TICKET_NORMAL ? ticketNormalListOptions : ticketAgentListOptions}
              sx={{ width: '350px' }}
              placeholder="티켓을 선택해주세요"
              showError={!!errors.ticketId}
              onChange={handleChangeTicket}
              disabled={getDisabledSelectTicketUi()}
            />
          </ListItemWrapper>
          {selectedTicketInfo && (
            <ListItemWrapper listTitleName=" " sx={{ mt: -1 }} isView={selectedGoodsKind !== GoodsKind.REAL}>
              <DetailTicketInfo
                channel={selectedTicketInfo.channelName}
                typeName={selectedTicketInfo.typeName}
                period={selectedTicketInfo.periodDisplay}
              />
            </ListItemWrapper>
          )}
          {/* // 상품분류 - 티켓상품 */}

          {/* 직접취소가능 여부 */}
          <ListItemWrapper
            listTitleName="직접취소가능여부"
            isView={!isPartnerSite && selectedGoodsKind !== GoodsKind.REAL}
          >
            <FormControlRadioGroup<StateModel> name="cancelableYn" options={BooleanOptions} row />
          </ListItemWrapper>
          {/* // 직접취소가능 여부 */}

          {/* 상품명 */}
          <ListItemWrapper
            listTitleName="상품명"
            isRequired
            toolTip={`실제 서비스 화면에 노출되는 상품명을 입력해주세요.\r\n*상품명 내에 브랜드명 기입 불가`}
            linkProps={{
              label: '상품명 가이드',
              link: 'https://rxc.notion.site/1ba4fb9616684f78aa8cae809663bd45',
            }}
          >
            {/* @todo 신규 컴포넌트 체크 필요 */}
            <TextField
              name="name"
              placeholder="상품명을 입력해주세요"
              helperText={`최대 ${GoodsNameMaxLength}자 까지 가능합니다`}
              sx={{ width: '30%' }}
              inputProps={{ maxLength: GoodsNameMaxLength }}
              onChange={debounce(handleInputLength, 50)}
            />
            <Typography variant="body2" paragraph sx={{ ml: 2, my: 0 }}>
              ({goodsNameCount}/{GoodsNameMaxLength})
            </Typography>
          </ListItemWrapper>
          {/* // 상품명 */}

          {/* 정산방식 */}
          <ListItemWrapper listTitleName="정산방식" isRequired isView={!isPartnerSite}>
            <FormControlRadioGroup<StateModel>
              name="settlementKind"
              options={SettlementKindOptions}
              row
              disabled={pageType !== PageType.CREATE}
            />
          </ListItemWrapper>
          {/* // 정산방식 */}

          {watchSettlementKind === SettlementKindType.BUYING && (
            <ListItemWrapper listTitleName="부가세 코드 등록" isRequired>
              <Grid display="flex" flexDirection="column">
                <FormControlRadioGroup<StateModel> name="vatCode" options={VatCodeOptions} row />
                {errors.vatCode?.message && (
                  <Typography color="secondary" variant="caption">
                    {errors.vatCode?.message}
                  </Typography>
                )}
              </Grid>
            </ListItemWrapper>
          )}
          {/* // KC 인증여부 */}

          {/* 출고명 */}
          <ListItemWrapper
            listTitleName="출고명"
            toolTip="출고 처리를 위한 입점사 관리 출고명을 입력해주세요"
            isView={selectedGoodsKind === GoodsKind.REAL}
          >
            <TextField
              name="partnerExportCode"
              placeholder="출고명을 입력해주세요"
              variant="outlined"
              sx={{ width: '30%' }}
            />
          </ListItemWrapper>
          {/* // 출고명 */}

          {/* 제품코드 */}
          <ListItemWrapper listTitleName="제품코드" isView={selectedGoodsKind === GoodsKind.REAL}>
            <TextField
              name="code"
              placeholder="제품코드를 입력해주세요"
              variant="outlined"
              helperText="제품의 고유 모델명을 입력해주세요"
              sx={{ width: '30%' }}
            />
          </ListItemWrapper>
          {/* // 제품코드 */}

          {/* 상품 데이터 수집 여부 */}
          <ListItemWrapper
            listTitleName="명품/해외브랜드 상품 데이터 수집 여부"
            isRequired
            isView={!isPartnerSite && selectedGoodsKind === GoodsKind.REAL}
          >
            <Grid display="flex" flexDirection="column">
              <FormControlRadioGroup<StateModel> name="dataCollectYn" options={BooleanOptions} row />
              <TypographyCaptionStyled variant="caption">
                명품/해외브랜드 상품군만 Y로 체크해주세요
              </TypographyCaptionStyled>
            </Grid>
          </ListItemWrapper>
          {/* // 상품 데이터 수집 여부 */}

          {/* 카탈로그 수집 여부 */}
          <ListItemWrapper listTitleName="카탈로그 수집 여부" isRequired isView={!isPartnerSite}>
            {FeedConfigTypeOptions.map((option, index) => {
              return (
                <FormControlCheckbox<StateModel>
                  name={`feedConfigList.${index}`}
                  key={option}
                  label={FeedConfigTypeLabel[option]}
                  value={option}
                />
              );
            })}
          </ListItemWrapper>
          {/* // 카탈로그 수집 여부 */}

          {/* 검색태그 */}
          {/* @todo FormControlTextField watch의 성능 이슈 check 필요 */}
          <ListItemWrapper listTitleName="검색태그" isView={!isPartnerSite}>
            <TextField
              name="searchTags"
              variant="outlined"
              placeholder="복수의 검색태그일 경우에 콤마(,)로 구분해주세요"
              sx={{ width: '600px' }}
            />
          </ListItemWrapper>
          {/* // 검색태그 */}

          {/* 브랜드 */}
          <ListItemWrapper listTitleName="브랜드" isRequired toolTip="판매하고자 하는 상품의 브랜드를 선택해주세요.">
            <FormControlAutoComplete<StateModel>
              name="brandInfo"
              options={brandListOptions}
              sx={{ width: '48%' }}
              getOptionLabel={({ label }) => label ?? ''}
              isOptionEqualToValue={(option, value) => option.value === value.value}
              placeholder="브랜드명을 선택해주세요"
              helperText={errors.brandInfo?.message ? '' : '입점사를 먼저 선택한 상태에서 브랜드 선택이 가능합니다'}
              onChange={handleChangeBrand}
            />
          </ListItemWrapper>
          {/* // 브랜드 */}

          {/* 키워드 */}
          <ListItemWrapper listTitleName="키워드" isView={!isPartnerSite}>
            <FormControlAutoComplete<StateModel>
              name="keywords"
              multiple
              options={keywordListOptions}
              sx={{ width: '48%' }}
              getOptionLabel={({ label }) => label ?? ''}
              isOptionEqualToValue={(option, value) => option.value === value.value}
              placeholder="키워드를 선택해주세요"
            />
          </ListItemWrapper>
          {/* // 키워드 */}

          {/* 카테고리 */}
          <ListItemWrapper
            listTitleName="카테고리"
            isRequired
            toolTip="판매하고자 하는 상품의 카테고리를 선택해주세요. (대분류 > 중분류 > 소분류)"
          >
            <GoodsCategory
              formFieldKeys={DetailBaseCategoryFieldKeys}
              infos={categoryInfos}
              onChange={handleChangeCategory}
            />
          </ListItemWrapper>
          {/* // 카테고리 */}

          {/* 추가 카테고리 */}
          {/* 211126 v1 version hide #FE-512 */}
          {/* <ListItemWrapper listTitleName="추가 카테고리">
            <GoodsCategory
              formFieldKeys={DetailAddCategoryFieldKeys}
              infos={addCategoryInfos}
              onChange={handleAddChangeCategory}
            />
          </ListItemWrapper> */}
          {/* // 추가 카테고리 */}

          {/* 판매기간 */}
          <ListItemWrapper
            listTitleName="판매기간"
            isRequired
            toolTip={`상품을 판매할 시작일과 종료일을 설정해 주세요.\r\n판매종료일이 없는 경우 ‘상시판매’로 체크해주세요.`}
          >
            <Typography variant="body2" paragraph sx={{ mr: 2, my: 0 }}>
              판매 시작일
            </Typography>
            <FormControlDatePickerLocal<StateModel>
              name="startDateTime"
              label="판매 시작일"
              fullWidth={false}
              InputLabelProps={{
                shrink: true,
              }}
            />
            <Typography variant="body2" paragraph sx={{ mx: 2, my: 0 }}>
              판매 종료일
            </Typography>
            <FormControlDatePickerLocal<StateModel>
              name="endDateTime"
              label="판매 종료일"
              fullWidth={false}
              InputLabelProps={{
                shrink: true,
              }}
              disabled={watchAlwaysDateTime}
            />
            <FormControlCheckbox<StateModel> name="alwaysDateTime" label="상시판매" sx={{ ml: 2 }} />
          </ListItemWrapper>
          {/* // 판매기간 */}

          {/* 전시시작일 설정 */}
          <ListItemWrapper
            listTitleName="전시시작일 설정"
            isRequired
            toolTip="미리 상품을 노출을 원하는 경우 전시시작일을 판매시작일보다 미리 설정 가능합니다."
          >
            <Typography variant="body2" display="inline-block" sx={{ mr: 2 }}>
              전시 시작일
            </Typography>
            <FormControlDatePickerLocal<StateModel>
              name="displayStartDateTime"
              label="전시 시작일"
              fullWidth={false}
              InputLabelProps={{
                shrink: true,
              }}
            />
            <FormControlCheckbox<StateModel>
              name="sameSalesTime"
              label="판매시작일과 동일"
              sx={{ ml: 2 }}
              onChange={(evt) => handleSameSalesTime(evt.target.checked)}
            />
            <Typography color="primary" variant="body2">
              전시시작일은 판매시작일보다 늦을수 없습니다. (같거나 이전날짜여야함)
            </Typography>
          </ListItemWrapper>
          {/* // 전시시작일 설정 */}

          {/* 1인 최대구매수량 */}
          <ListItemWrapper
            listTitleName="1인 최대구매수량"
            isRequired
            toolTip="유저 1인 당 구매할 수 있는 최대수량입니다."
          >
            <FormControlRadioGroup<StateModel> name="userMaxPurchaseLimit" options={MaxPurchaseLimitOptions} row />
            <FormControlTextField<StateModel>
              name="userMaxPurchaseEa"
              variant="outlined"
              disabled={watchUserMaxPurchaseLimit === MaxPurchaseLimit.UNLIMIT}
            />
          </ListItemWrapper>
          {/* // 1인 최대구매수량 */}

          {/* 한정수량 */}
          <ListItemWrapper listTitleName="한정수량 설정" isRequired isView={!isPartnerSite}>
            <FormControlRadioGroup<StateModel> name="limitedTypeYn" options={BooleanOptions} row />
            {watchLimitedTypeYn === 'Y' && (
              <Grid display="flex" sx={{ ml: 1 }}>
                <Box>
                  <FormControlRadioGroup<StateModel>
                    name="limitedType"
                    options={PurchaseLimitedTypeOptions}
                    row={false}
                  />
                  {!!errors.limitedType && (
                    <Typography color="error" variant="caption">
                      {errors.limitedType.message}
                    </Typography>
                  )}
                </Box>
                <FormControlTextField<StateModel>
                  name="limitedGoodsEa"
                  variant="outlined"
                  size="small"
                  disabled={watchLimitedType !== PurchaseLimitedType.GOODS}
                />
              </Grid>
            )}
          </ListItemWrapper>
          {/* // 한정수량 */}

          {/* 쿠폰사용 설정 */}
          <ListItemWrapper
            listTitleName="쿠폰사용 설정"
            isRequired
            toolTip={`쿠폰 사용 ‘N’ 으로 선택한 상품은 모든 쿠폰의 할인에서 제외됩니다.\r\n*쿠폰 적용 불가 상품 : 전통주, 도서상품, 환금성 상품 (쥬얼리,순금,E쿠폰 등)`}
          >
            <FormControlRadioGroup<StateModel> name="useCouponYn" options={BooleanOptions} row />
          </ListItemWrapper>
          {/* // 쿠폰사용 설정 */}

          {/* 성인인증여부 */}
          <ListItemWrapper
            listTitleName="성인인증여부"
            isRequired
            toolTip={`성인인증이 필요한 상품 판매 시 ‘Y’으로 설정해 주시기 바랍니다. 사용으로 설정한 상품은 구매 시 성인인증 절차가 추가됩니다.\r\n*성인인증 필요 상품 : 전통주,무알콜음료,성인용품,금연보조제,맥가이버칼,호신용스프레이,청소년유해약물(부탄가스,레이저포인 등)`}
          >
            <FormControlRadioGroup<StateModel> name="adultRequiredYn" options={BooleanOptions} row />
          </ListItemWrapper>
          {/* // 성인인증여부 */}

          {/* KC 인증여부 */}
          <ListItemWrapper
            listTitleName="KC 인증"
            isRequired
            toolTip={`KC 인증이 필요한 상품은 필수로 인증 자료를 첨부해야 합니다.\r\n사실과 다른 인증정보를 입력할 경우, 관련법에 의하여 처벌받으실 수 있으니 정확한 정보만 입력해 주시기바랍니다.\r\n*KC 인증 필요 상품 : 전기용품,생활용품,어린이 제품 중 안전인증,안전 확인,공급자 적합성 확인,어린이 보호포장 대상 및 방송 통신기자재 적합성 평가 등`}
          >
            <FormControlRadioGroup<StateModel> name="kcAuthYn" options={BooleanOptions} row />
          </ListItemWrapper>
          {watchKcAuthYn === 'Y' && (
            <ListItemWrapper listTitleName="KC 인증 파일 첨부" isRequired>
              {/* kcFileList (kcFileListInfos), onRemove, maxFiles */}
              <DetailUpload
                fileInfos={kcFileInfos}
                onRemove={handleRemoveKcUpload}
                onChange={handleChangeKcUpload}
                maxFiles={999}
                errorMessage={ValidErrorMessageKcUpload}
              />
            </ListItemWrapper>
          )}
          {/* // KC 인증여부 */}

          {/* 법적 허가/신고 필수 서류 */}
          <ListItemWrapper listTitleName="법적 허가/신고 필수 서류">
            <Grid display="flex" flexDirection="column">
              <DetailUpload
                fileInfos={certFileInfos}
                onRemove={handleRemoveCertUpload}
                onChange={handleChangeCertUpload}
                maxFiles={999}
                errorMessage={ValidErrorMessageCertUpload}
              />
              <TypographyCaptionStyled variant="caption" sx={{ mt: 1 }}>
                • 판매 허가 또는 신고가 필요한 상품인 경우 신고 자료를 필수로 첨부해주세요
              </TypographyCaptionStyled>
              <TypographyCaptionStyled variant="caption">
                • 대상 상품 : 건강기능식품, 기능성화장품, 의료기기 등
              </TypographyCaptionStyled>
            </Grid>
          </ListItemWrapper>
          {/* // 법적 허가/신고 필수 서류 */}

          {/* 프리즘 단독 상품 여부 */}
          <ListItemWrapper listTitleName="PRIZM ONLY 표시 설정" isRequired isView={!isPartnerSite}>
            <FormControlRadioGroup<StateModel> name="prizmOnlyYn" options={BooleanOptions} row />
          </ListItemWrapper>
          {/* // 프리즘 단독 상품 여부 */}
        </List>
      </CardContent>
    </Card>
  );
};

const ListItemWrapper = ({
  isView = true,
  listTitleName,
  isRequired,
  toolTip,
  linkProps,
  children,
  sx,
}: {
  isView?: boolean;
  listTitleName?: string;
  isRequired?: boolean;
  toolTip?: string;
  linkProps?: {
    link: string;
    label: string;
  };
  children: React.ReactNode;
  sx?: SxProps<Theme>;
}) => {
  if (!isView) {
    return null;
  }

  return (
    <ListItem sx={{ mt: 2, ...sx }}>
      <Box sx={{ width: 18, height: 18, flexShrink: 0 }}>{toolTip && <DetailToolTip message={toolTip} />}</Box>
      <Box>
        {listTitleName && (
          <ListTitle
            name={listTitleName}
            isRequired={isRequired}
            width={listTitleWidth}
            sx={{
              flexShrink: 0,
              ml: 1,
            }}
          />
        )}
        {linkProps && (
          <Link href={linkProps.link} target="_blank" sx={{ fontSize: '0.875rem', fontWeight: 500, ml: '8px' }}>
            {linkProps.label}
          </Link>
        )}
      </Box>
      {children}
    </ListItem>
  );
};

const TypographyCaptionStyled = styled(Typography)`
  color: #6b778c;
`;
