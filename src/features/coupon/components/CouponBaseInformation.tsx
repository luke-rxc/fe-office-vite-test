import {
  FormControlAutoComplete,
  FormControlDatePicker,
  FormControlRadioGroup,
  FormControlSelect,
  FormControlTextField,
} from '@components/form';
import styled from '@emotion/styled';
import { Box, Button, ButtonGroup, Grid, InputAdornment, List, MenuItem } from '@material-ui/core';
import { ReactNode } from 'react';
import {
  CouponUseType,
  CouponIssueType,
  CouponIssuePeriodType,
  CouponCostType,
  CouponIssuePeriodTypeLabel,
  DownloadLimitType,
  DownloadLimitTypeLabel,
  MinPurchasePriceLimit,
  MinPurchasePriceLimitLabel,
  CouponIssueTypeLabel,
  CouponCostTypeLabel,
  CouponIssueTypeOptions,
} from '../constants';
import { ShowroomComboItemModel } from '../models';
import { ReturnTypeUseCouponService } from '../services';
import { CouponFormField } from '../types';
import { FormLayout } from './FormLayout';

interface Props {
  form: ReturnTypeUseCouponService['form'];
  uploaderComponent: ReactNode;
  /**
   * 수정 페이지 여부
   */
  isModify?: boolean;
  /**
   * 다운로드 가능 쿠폰 여부
   */
  isDownloadableCoupon?: boolean;
  showroomComboList: Array<ShowroomComboItemModel>;
  onChangeRange: ReturnTypeUseCouponService['handleChangeRange'];
}

export const CouponBaseInformation = ({
  form: { formMethod },
  uploaderComponent,
  isModify = false,
  isDownloadableCoupon = false,
  showroomComboList,
  onChangeRange,
}: Props) => {
  const { watch } = formMethod;
  const [downloadPolicy, issuePeriod, salePolicy, useType, providerChargeRate] = watch([
    'downloadPolicy',
    'issuePeriod',
    'salePolicy',
    'useType',
    'providerChargeRate',
  ]);

  const onClickRange = (type: 'issuePeriod' | 'downloadPolicy', range: number) => {
    return () => onChangeRange(type, range);
  };

  const disabledDate = (date: Date) => {
    const { startDateTime } = downloadPolicy;

    if (!startDateTime) {
      return true;
    }

    return new Date(startDateTime) > new Date(date);
  };

  return (
    <>
      <Grid container direction="row" justifyContent="flex-start" alignItems="flex-start">
        <RowGrid item sm={6}>
          <FormLayout label="쿠폰명" required>
            <FormControlTextField<CouponFormField>
              name="display.name"
              size="small"
              rules={{
                required: '쿠폰명을 입력하세요',
                minLength: { value: 2, message: '쿠폰명은 2자 이상으로 입력해주세요' },
                maxLength: { value: 100, message: '쿠폰명은 100자 이하로 입력해주세요' },
              }}
              placeholder="쿠폰명"
              fullWidth
            />
          </FormLayout>
        </RowGrid>
        <RowGrid item sm={6}>
          <FormLayout label="관리자용 쿠폰명" required>
            <FormControlTextField<CouponFormField>
              name="name"
              size="small"
              rules={{
                required: '관리자용 쿠폰명을 입력하세요',
                minLength: { value: 2, message: '관리자용 쿠폰명은 2자 이상으로 입력해주세요' },
                maxLength: { value: 100, message: '관리자용 쿠폰명은 100자 이하로 입력해주세요' },
              }}
              placeholder="관리자용 쿠폰명"
              fullWidth
            />
          </FormLayout>
        </RowGrid>
        <RowGrid item sm={6}>
          <FormLayout label="쿠폰설명">
            <FormControlTextField<CouponFormField>
              name="display.contents"
              size="small"
              placeholder="쿠폰설명"
              fullWidth
            />
          </FormLayout>
        </RowGrid>
        <RowGrid item sm={12}>
          <FormLayout label="쿠폰유형" required>
            {isDownloadableCoupon ? (
              <FormItemContentStyled>
                {useType === CouponUseType.GOODS ? '상품단위할인' : '장바구니할인'}
              </FormItemContentStyled>
            ) : (
              <FormControlSelect<CouponFormField>
                name="useType"
                size="small"
                options={[
                  { value: CouponUseType.GOODS, label: '상품단위할인' },
                  { value: CouponUseType.CART, label: '장바구니할인' },
                ]}
                rules={{ required: '쿠폰유형을 선택하세요' }}
                displayEmpty
                sx={{ width: '200px' }}
              >
                <MenuItem value="" disabled>
                  선택
                </MenuItem>
              </FormControlSelect>
            )}
          </FormLayout>
        </RowGrid>
        <RowGrid item sm={12}>
          <FormLayout label="쿠폰 발급방법" required>
            {isModify ? (
              <FormItemContentStyled>
                {CouponIssueTypeLabel[downloadPolicy.issueType]}{' '}
                {downloadPolicy?.issueType === CouponIssueType.KEYWORD && downloadPolicy.keyword
                  ? downloadPolicy.keyword
                  : ''}
                {downloadPolicy?.issueType === CouponIssueType.SHOWROOM && downloadPolicy.showRoomId
                  ? `( 쇼룸: ${downloadPolicy.showRoomId.label} )`
                  : ''}
              </FormItemContentStyled>
            ) : (
              <>
                <FormControlRadioGroup<CouponFormField>
                  name="downloadPolicy.issueType"
                  row
                  options={CouponIssueTypeOptions}
                />
                {downloadPolicy?.issueType === CouponIssueType.KEYWORD && (
                  <Box sx={{ display: 'flex', alignItems: 'top' }}>
                    <FormItem>
                      <FormControlTextField<CouponFormField>
                        name="downloadPolicy.keyword"
                        size="small"
                        rules={{
                          required:
                            downloadPolicy?.issueType === CouponIssueType.KEYWORD ? '키워드를 입력하세요' : false,
                        }}
                        disabled={downloadPolicy?.issueType !== CouponIssueType.KEYWORD}
                        sx={{ margin: '0 10px 0 0' }}
                      />
                    </FormItem>
                    <Box p="8px 0 8px">최대 글자수 제한</Box>
                  </Box>
                )}
                {downloadPolicy?.issueType === CouponIssueType.SHOWROOM && (
                  <FormControlAutoComplete<CouponFormField>
                    name="downloadPolicy.showRoomId"
                    options={showroomComboList}
                    sx={{ width: '400px' }}
                    variant="outlined"
                    placeholder="쇼룸을 선택하세요"
                    isOptionEqualToValue={(v, o) => v.value === o.value}
                    rules={{
                      required: downloadPolicy?.issueType === CouponIssueType.SHOWROOM ? '쇼룸을 선택하세요' : false,
                    }}
                  />
                )}
              </>
            )}
          </FormLayout>
        </RowGrid>
        <RowGrid item sm={12}>
          <FormLayout label="쿠폰 다운로드 기간" required>
            <IssuePeriodWrapperStyled>
              <FormControlDatePicker<CouponFormField>
                name="downloadPolicy.startDateTime"
                label="쿠폰 다운로드 시작일"
                rules={{
                  required: '쿠폰 다운로드 시작일을 입력해주세요.',
                }}
                disabled={isDownloadableCoupon}
                dateTime
              />
              <FormControlDatePicker<CouponFormField>
                name="downloadPolicy.endDateTime"
                label="쿠폰 다운로드 종료일"
                rules={{
                  required: '쿠폰 다운로드 종료일을 입력해주세요.',
                }}
                shouldDisableDate={disabledDate}
                dateTime
              />
              <ButtonGroup sx={{ alignSelf: 'flex-start', height: '56px' }} disabled={isDownloadableCoupon}>
                {[1, 7, 30, 90, 365].map((day) => (
                  <Button key={`btn-downloadPolicy-${day}`} onClick={onClickRange('downloadPolicy', day)}>
                    {day === 365 ? `1년` : `${day}일`}
                  </Button>
                ))}
              </ButtonGroup>
            </IssuePeriodWrapperStyled>
            <List>
              <ListItem>설정된 기간동안 쿠폰이 노출됩니다.</ListItem>
            </List>
          </FormLayout>
        </RowGrid>
        <RowGrid item sm={12}>
          <FormLayout label="쿠폰 유효기간" required>
            <>
              <FormControlRadioGroup<CouponFormField>
                name="issuePeriod.issuePeriodType"
                rules={{ required: '' }}
                options={[
                  { label: CouponIssuePeriodTypeLabel[CouponIssuePeriodType.DAY], value: CouponIssuePeriodType.DAY },
                  {
                    label: CouponIssuePeriodTypeLabel[CouponIssuePeriodType.PERIOD],
                    value: CouponIssuePeriodType.PERIOD,
                  },
                ]}
              />
              <IssueWrapperStyled>
                {issuePeriod?.issuePeriodType === CouponIssuePeriodType.DAY && (
                  <Box sx={{ display: 'flex', alignItems: 'top' }} p="3px">
                    <Box p="8px">발급일로부터</Box>
                    <FormControlTextField<CouponFormField>
                      name="issuePeriod.downloadAfterDay"
                      size="small"
                      rules={{
                        required: '유효기간을 입력해주세요.',
                      }}
                      InputProps={{
                        endAdornment: <InputAdornment position="start">일</InputAdornment>,
                      }}
                      type="number"
                      sx={{ margin: '0 10px', width: 150 }}
                    />
                    <Box p="8px 0 8px">간 유효</Box>
                  </Box>
                )}
                {issuePeriod?.issuePeriodType === CouponIssuePeriodType.PERIOD && (
                  <IssuePeriodWrapperStyled>
                    <FormControlDatePicker<CouponFormField>
                      name="issuePeriod.startDateTime"
                      label="쿠폰 유효기간 시작일"
                      rules={{
                        required: '쿠폰 유효기간 시작일을 입력해주세요.',
                      }}
                      disabled={true}
                      dateTime
                    />
                    <FormControlDatePicker<CouponFormField>
                      name="issuePeriod.expiredDateTime"
                      label="쿠폰 유효기간 종료일"
                      rules={{
                        required: '쿠폰 유효기간 종료일을 입력해주세요.',
                      }}
                      shouldDisableDate={disabledDate}
                      dateTime
                    />
                    <ButtonGroup
                      sx={{ alignSelf: 'flex-start', height: '56px' }}
                      disabled={!downloadPolicy.startDateTime}
                    >
                      {[1, 7, 30, 90, 365].map((day) => (
                        <Button key={`btn-issuePeriod-${day}`} onClick={onClickRange('issuePeriod', day)}>
                          {day === 365 ? `1년` : `${day}일`}
                        </Button>
                      ))}
                    </ButtonGroup>
                  </IssuePeriodWrapperStyled>
                )}
              </IssueWrapperStyled>
            </>
          </FormLayout>
        </RowGrid>
        <RowGrid item sm={12}>
          <FormLayout label="쿠폰 총 발급갯수">
            {isDownloadableCoupon ? (
              <FormItemContentStyled>
                {downloadPolicy.useLimitEa === DownloadLimitType.UNLIMIT
                  ? DownloadLimitTypeLabel[DownloadLimitType.UNLIMIT]
                  : `${downloadPolicy.limitEaAll}개`}
              </FormItemContentStyled>
            ) : (
              <ItemsWrapper>
                <FormControlRadioGroup<CouponFormField>
                  name="downloadPolicy.useLimitEa"
                  options={[
                    { label: DownloadLimitTypeLabel[DownloadLimitType.UNLIMIT], value: DownloadLimitType.UNLIMIT },
                    { label: DownloadLimitTypeLabel[DownloadLimitType.LIMIT], value: DownloadLimitType.LIMIT },
                  ]}
                />

                <FormItem>
                  <FormControlTextField<CouponFormField>
                    name="downloadPolicy.limitEaAll"
                    size="small"
                    rules={{
                      required:
                        downloadPolicy?.useLimitEa === DownloadLimitType.LIMIT ? '발급갯수를 입력하세요' : false,
                    }}
                    InputProps={{
                      endAdornment: <InputAdornment position="start">개</InputAdornment>,
                    }}
                    disabled={downloadPolicy?.useLimitEa !== DownloadLimitType.LIMIT}
                    sx={{ margin: '0 10px', width: 140 }}
                    type="number"
                  />
                </FormItem>
              </ItemsWrapper>
            )}
          </FormLayout>
        </RowGrid>
        <RowGrid item sm={12}>
          <FormLayout label="최소주문금액">
            <ItemsWrapper>
              <FormControlRadioGroup<CouponFormField>
                name="salePolicy.useLimitMinPurchasePrice"
                options={[
                  {
                    label: MinPurchasePriceLimitLabel[MinPurchasePriceLimit.UNLIMIT],
                    value: MinPurchasePriceLimit.UNLIMIT,
                  },
                  {
                    label: MinPurchasePriceLimitLabel[MinPurchasePriceLimit.LIMIT],
                    value: MinPurchasePriceLimit.LIMIT,
                  },
                ]}
              />

              <FormItem>
                <FormControlTextField<CouponFormField>
                  name="salePolicy.limitMinPurchasePrice"
                  size="small"
                  rules={{
                    required:
                      salePolicy?.useLimitMinPurchasePrice === MinPurchasePriceLimit.LIMIT
                        ? '최소 주문금액을 입력하세요.'
                        : false,
                  }}
                  InputProps={{
                    endAdornment: <InputAdornment position="start">원</InputAdornment>,
                  }}
                  disabled={salePolicy?.useLimitMinPurchasePrice !== MinPurchasePriceLimit.LIMIT}
                  sx={{ margin: '0 10px', width: 170 }}
                  type="number"
                />
              </FormItem>
              <Box p="8px 0 8px">이상 구매시 사용가능</Box>
            </ItemsWrapper>
          </FormLayout>
        </RowGrid>
        <RowGrid item sm={12}>
          <FormLayout label="할인설정" required>
            {isDownloadableCoupon ? (
              <FormItemContentStyled>
                {Number(salePolicy.value).toLocaleString()}
                {`${CouponCostTypeLabel[salePolicy.costType]} 할인`}
                {Number(salePolicy.limitMaxSalePrice) > 0
                  ? ` (최대 ${Number(salePolicy.limitMaxSalePrice).toLocaleString()}원 할인)`
                  : ''}
              </FormItemContentStyled>
            ) : (
              <ItemsWrapper>
                <FormControlTextField<CouponFormField>
                  name="salePolicy.value"
                  size="small"
                  rules={{
                    required: '할인설정값을 입력하세요.',
                    max:
                      salePolicy.costType === CouponCostType.PERCENT
                        ? { value: 100, message: '할인율 설정 값이 100을 넘을수 없습니다.' }
                        : undefined,
                  }}
                  sx={{ marginRight: '10px' }}
                  type="number"
                />
                <FormControlSelect<CouponFormField>
                  name="salePolicy.costType"
                  size="small"
                  options={[
                    { value: CouponCostType.PERCENT, label: CouponCostTypeLabel[CouponCostType.PERCENT] },
                    { value: CouponCostType.WON, label: CouponCostTypeLabel[CouponCostType.WON] },
                  ]}
                  rules={{ required: '설정단위선택' }}
                  displayEmpty
                  sx={{ width: '80px', margin: '0 30px 0 10px' }}
                >
                  <MenuItem value="" disabled>
                    선택
                  </MenuItem>
                </FormControlSelect>
                <Box p="8px 0 8px">최대</Box>
                <FormControlTextField<CouponFormField>
                  name="salePolicy.limitMaxSalePrice"
                  size="small"
                  InputProps={{
                    endAdornment: <InputAdornment position="start">원</InputAdornment>,
                  }}
                  sx={{ margin: '0 10px', width: 140 }}
                  type="number"
                />
                <Box p="8px 0 8px">할인</Box>
              </ItemsWrapper>
            )}
          </FormLayout>
        </RowGrid>
        <RowGrid item sm={12}>
          <FormLayout label="입점사분담율" required>
            {isDownloadableCoupon ? (
              <FormItemContentStyled>{providerChargeRate ?? 0}%</FormItemContentStyled>
            ) : (
              <FormControlTextField<CouponFormField>
                name="providerChargeRate"
                size="small"
                rules={{
                  required: useType !== CouponUseType.CART ? '입점사분담율을 입력하세요' : false,
                  max: { value: 100, message: '수수료는 값이 100을 넘을수 없습니다.' },
                  pattern: { value: /^[0-9]{1,3}$/, message: '숫자만 입력하세요' },
                }}
                InputProps={{
                  endAdornment: <InputAdornment position="start">%</InputAdornment>,
                  inputMode: 'numeric',
                }}
                placeholder="입점사분담율"
                sx={{ width: 180 }}
              />
            )}
          </FormLayout>
        </RowGrid>
        <RowGrid item sm={12}>
          <FormLayout label="쿠폰썸네일">{uploaderComponent}</FormLayout>
        </RowGrid>
      </Grid>
    </>
  );
};

const RowGrid = styled(Grid)`
  margin-bottom: 10px;

  .Mui-disabled fieldset {
    background-color: #eee !important;
  }
`;

const ItemsWrapper = styled(Box)`
  display: flex;
  align-items: start;
`;

const FormItem = styled(Box)`
  display: inline-flex;
  align-items: center;
`;

const IssueWrapperStyled = styled(Box)`
  margin-top: 10px;
`;

const IssuePeriodWrapperStyled = styled(Box)`
  display: flex;
  align-items: flex-start;
  padding: 3px;

  > div.MuiFormControl-root {
    width: 210px;
    margin-right: 10px;

    .Mui-disabled fieldset {
      background-color: #ffffff00 !important;
    }
  }
`;

const ListItem = styled.li`
  list-style: inside;
  padding-left: 10px;
`;

const FormItemContentStyled = styled(Box)`
  font-size: 16px;
  padding: 8px 0;
`;
