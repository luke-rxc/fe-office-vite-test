import { useEffect } from 'react';
import { Box, Card, Divider, CardContent, Grid, CardHeader, Typography, List, ListItem } from '@material-ui/core';
import { ListTitle } from '@components/ListTitle';
import { GoodsKind, GoodsShippingMethod } from '@constants/goods';
import { FormControlRadioGroup, FormControlTextField, FormControlSelect } from '@components/form';
import {
  DetailListTitleWidth,
  DeliveryType,
  DeliveryTypeOptions,
  CombineDeliveryOptions,
  DeliveryMethodOptions,
  DeliveryMethodTicketOptions,
  // BooleanOptions,
} from '../constants';
import { ProviderModel, StateModel } from '../models';
import {
  useDetailDeliveryService,
  useDetailDeliveryTimeService,
  useDeliveryTmplService,
} from '../services/detailDelivery';
import { DetailDeliveryPolicy, DetailDeliveryShipPolicyTable } from '../components/detailDelivery';
import { DetailToolTip } from '../components/detail';
import { useLogger } from '../hooks';

interface Props {
  providerInfo: ProviderModel;
  // 상품 분류 정보
  selectedGoodsKind: GoodsKind;
  // 초기 선택된 입점사 배송정책 ID
  initProviderShippingId?: number | string;
  // 당일 배송일 경우의 시간
  initDeliveryTodayEndTime?: string;
}

const { delivery: listTitleWidth } = DetailListTitleWidth;
export const DetailDeliveryContainer: React.FC<Props> = ({
  providerInfo,
  selectedGoodsKind,
  initDeliveryTodayEndTime,
  initProviderShippingId = null,
}) => {
  // 입점사 Template
  const { deliveryTmplLists } = useDeliveryTmplService({ providerId: providerInfo?.value });
  const {
    selectedPolicyInfo,
    watchDeliveryType,
    isShippingPolicyShop,
    deliveryTmplOptions,
    handleChangeTmpl,
    handleResetTmpl,
    handleShippingMethodChange,
  } = useDetailDeliveryService({
    deliveryTmplLists,
    initProviderShippingId,
    selectedGoodsKind,
  });
  const { dailyTimeLists: dailyTimeOptions } = useDetailDeliveryTimeService({
    initDeliveryTodayEndTime,
  });
  // 입점사 Template List 갯수
  const deliveryTmplListsCount = deliveryTmplLists?.length ?? 0;

  useEffect(() => {
    handleResetTmpl();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(providerInfo), providerInfo?.value]);

  useLogger('DetailDeliveryContainer');

  return (
    <Box sx={{ mb: 10 }}>
      <Card>
        <CardHeader title="배송정보" />
        <Divider />
        <CardContent>
          <Grid container>
            <Grid item xs={12}>
              <List>
                {/* 배송 방법 적용 */}
                <ListItemWrapper
                  listTitleName="배송방법"
                  isRequired
                  toolTip={`배송 방법을 선택해주세요.\r\n화물/설치 및 퀵 배송 등 택배사를 이용하지 않는 배송하는 경우 ‘직접배송’을 선택해 주세요. `}
                >
                  <FormControlRadioGroup<StateModel>
                    name="shippingMethod"
                    options={selectedGoodsKind === GoodsKind.REAL ? DeliveryMethodOptions : DeliveryMethodTicketOptions}
                    disabled={selectedGoodsKind !== GoodsKind.REAL}
                    row
                    onChange={(evt) => {
                      handleShippingMethodChange(evt.target.value as GoodsShippingMethod);
                    }}
                  />
                </ListItemWrapper>
                {/* // 배송 방법 적용 */}

                {/* 배송 유형 */}
                <ListItemWrapper listTitleName="배송유형" isRequired toolTip="하단에 배송 출고일 정책을 참고해주세요.">
                  <FormControlRadioGroup<StateModel>
                    name="deliveryType"
                    options={DeliveryTypeOptions}
                    disabled={selectedGoodsKind !== GoodsKind.REAL}
                    row
                  />
                  <Typography>(</Typography>
                  <FormControlTextField<StateModel>
                    label="예외발송"
                    name="deliveryTypeOtherDay"
                    disabled={watchDeliveryType !== DeliveryType.OTHER}
                    sx={{ mx: 2 }}
                  />
                  <Typography>일이내발송예정 )</Typography>
                </ListItemWrapper>
                {/* // 배송 유형 */}

                {/* 당일발송 마감, 개인통관고유번호 */}
                {(!selectedGoodsKind || selectedGoodsKind === GoodsKind.REAL) && (
                  <ListItemWrapper
                    listTitleName="당일발송 마감시간"
                    isRequired
                    toolTip="당일 발송 유형의 경우 발송 마감 시간을 설정해 주세요."
                  >
                    <Grid item md={6} xs={12} display="flex" alignItems="center">
                      <FormControlSelect<StateModel>
                        label="당일발송 마감시간"
                        name="deliveryTodayEndTime"
                        options={dailyTimeOptions}
                        disabled={watchDeliveryType !== DeliveryType.TODAY}
                        showError
                        sx={{ width: 250 }}
                      />
                    </Grid>
                    {/* 개인통관고유번호 */}
                    {/* 211126 v1 version hide #FE-512 */}
                    {/* <Grid item md={6} xs={12} display="flex" alignItems="center">
                    <ListTitle name="개인통관고유번호 수집 여부" isRequired width={listTitleWidth} />
                    <FormControlRadioGroup name="isPcccRequired" options={BooleanOptions} row />
                  </Grid> */}
                    {/* // 개인통관고유번호 */}
                  </ListItemWrapper>
                )}

                {/* // 당일발송 마감, 개인통관고유번호 */}

                {/* 묶음 배송 적용 */}
                <ListItemWrapper
                  listTitleName="묶음배송적용"
                  isRequired
                  toolTip="배송정책이 동일한 상품끼리 묶음배송이 가능합니다. 직접배송의 경우 묶음배송 설정이 불가합니다."
                >
                  <FormControlRadioGroup<StateModel>
                    name="shippingPolicy"
                    options={CombineDeliveryOptions}
                    row
                    disabled={!selectedPolicyInfo || selectedGoodsKind !== GoodsKind.REAL}
                  />
                </ListItemWrapper>
                {/* // 묶음 배송 적용 */}

                {/* 배송정책 */}
                <ListItemWrapper
                  listTitleName="배송정책"
                  isRequired
                  toolTip="상품에 설정할 배송정책을 선택해주세요. 배송정책 추가 및 수정은 담당MD에게 문의바랍니다."
                >
                  <>
                    {!!deliveryTmplListsCount ? (
                      <FormControlSelect<StateModel>
                        label="배송정책"
                        name="providerShippingId"
                        options={deliveryTmplOptions}
                        sx={{ width: '300px' }}
                        onChange={handleChangeTmpl}
                      />
                    ) : (
                      '"입점사 정보" 에서 입점사를 우선 선택해주세요.'
                    )}
                  </>
                </ListItemWrapper>

                {/* 배송정책 : table */}
                {selectedPolicyInfo &&
                  !!deliveryTmplListsCount &&
                  (!selectedGoodsKind || selectedGoodsKind === GoodsKind.REAL) && (
                    <ListItemWrapper listTitleName="">
                      <DetailDeliveryPolicy
                        policyInfo={selectedPolicyInfo}
                        isShippingPolicyShop={isShippingPolicyShop}
                      />
                    </ListItemWrapper>
                  )}
                {/* // 배송정책 */}
              </List>
            </Grid>
          </Grid>
        </CardContent>
        <Divider />
        <CardContent>
          <ListItemWrapper listTitleName="배송 출고일 정책" toolTip="아래 출고일 정책에 맞춰 출고를 진행해주세요." />
          <Box sx={{ px: 3, my: 3 }}>
            <DetailDeliveryShipPolicyTable />
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

const ListItemWrapper = ({
  listTitleName,
  isRequired,
  toolTip,
  children,
}: {
  listTitleName?: string;
  isRequired?: boolean;
  toolTip?: string;
  children?: React.ReactNode;
}) => (
  <ListItem sx={{ mt: 1 }}>
    <Box sx={{ width: 18, height: 18, flexShrink: 0 }}>{toolTip && <DetailToolTip message={toolTip} />}</Box>
    {listTitleName && <ListTitle name={listTitleName} isRequired={isRequired} width={listTitleWidth} sx={{ ml: 1 }} />}
    {children}
  </ListItem>
);
