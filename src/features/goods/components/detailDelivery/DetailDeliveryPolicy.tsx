import React from 'react';
import keyBy from 'lodash/keyBy';
import { Typography, Card, List, ListItem, Grid, Divider, Paper } from '@material-ui/core';
import { ListTitle } from '@components/ListTitle';
import { FormControlTextField } from '@components/form';
import { LimitType as DeliveryCostType } from '@constants/goods';
import { DetailListTitleWidth, ProviderDeliveryPolicy } from '../../constants';
import { Radio } from '../form';
import { DetailDeliveryTmplModel, AddressModel, ShippingPolicyType, StateModel } from '../../models';

interface Props {
  policyInfo: DetailDeliveryTmplModel;
  isShippingPolicyShop: boolean;
}

const SummaryType = {
  [ProviderDeliveryPolicy.FREE]: '[무료]',
  [ProviderDeliveryPolicy.PAY]: '[유료]',
  [ProviderDeliveryPolicy.IFPAY]: '[조건부 무료]',
};

const getAddress = (addressInfo: AddressModel): string => {
  // 정보가 없을시 빈값 처리
  if (!addressInfo) {
    return '';
  }

  const { postCode, address, addressDetail, phoneNumber } = addressInfo;
  const phone = phoneNumber ? `(Tel: ${phoneNumber})` : '';
  return `(${postCode}) ${address} ${addressDetail} ${phone}`;
};

const getSummary = (shippingPolicy: ShippingPolicyType) => {
  const { costType, ifpayCost, ifpayFreePrice, payCost } = shippingPolicy;

  const type = SummaryType[costType] ?? null;
  const description =
    costType === ProviderDeliveryPolicy.PAY
      ? `${payCost}원`
      : costType === ProviderDeliveryPolicy.IFPAY
      ? `기본 배송비 ${ifpayCost}원, ${ifpayFreePrice}원 이상 구매시 무료`
      : '';

  return type ? `${type} ${description}` : description;
};

const { deliveryPolicy: listTitleWidth } = DetailListTitleWidth;

export const DetailDeliveryPolicy: React.FC<Props> = React.memo(({ policyInfo, isShippingPolicyShop }) => {
  const { deliveryName, extraAddCosts, sendingAddress, returnAddress, returnCost, shippingPolicy } = policyInfo;
  const displayShopSummary = isShippingPolicyShop ? getSummary(shippingPolicy) : null;
  const displaySendingAddress = getAddress(sendingAddress);
  const displayReturningAddress = getAddress(returnAddress);
  const { JEJU: extraAddCostJeju, ETC: extraAddCostEtc } = keyBy(extraAddCosts, 'region');

  return (
    <Card sx={{ width: '100%', p: 2 }}>
      <List>
        <ListItemWrapper listTitleName="택배사" isRequired>
          <Typography variant="body2">{deliveryName}</Typography>
        </ListItemWrapper>

        <ListItemWrapper listTitleName="배송비설정" isRequired>
          {
            // 묶음 배송(Summary), 개별 배송(Template)
            isShippingPolicyShop ? (
              <Paper sx={{ width: '100%', ml: 2, p: 2 }}>
                <Typography variant="subtitle2">{displayShopSummary}</Typography>
              </Paper>
            ) : (
              <Paper sx={{ width: '100%' }}>
                <List>
                  <ListItemWrapper>
                    <GridRowRadio />
                    <GridRowTitle>
                      <TypoWrapper value="배송조건" />
                    </GridRowTitle>
                    <GridRowContent>
                      <TypoWrapper value="배송비" />
                    </GridRowContent>
                  </ListItemWrapper>

                  <Divider sx={{ my: 1 }} />

                  {/* 상품수량에 관계 없음 */}
                  <ListItemWrapper>
                    <GridRowRadio>
                      <Radio name="goodsShippingPolicy" value={DeliveryCostType.UNLIMIT} />
                    </GridRowRadio>
                    <GridRowTitle>
                      <TypoWrapper value="상품수량에 관계 없음" />
                    </GridRowTitle>
                    <GridRowContent>
                      <FormControlTextField<StateModel> name="unLimitShippingPrice" sx={{ mr: 1 }} />원
                    </GridRowContent>
                  </ListItemWrapper>

                  <Divider sx={{ my: 1 }} />

                  {/* 조건부무료 */}
                  <ListItemWrapper>
                    <GridRowRadio>
                      <Radio name="goodsShippingPolicy" value={DeliveryCostType.IFPAY} />
                    </GridRowRadio>
                    <GridRowTitle>
                      <TypoWrapper value="조건부무료" />
                    </GridRowTitle>
                    <GridRowContent>
                      기본배송비
                      <FormControlTextField<StateModel> name="ifpayCost" variant="outlined" sx={{ mx: 1 }} />
                      원
                      <FormControlTextField<StateModel>
                        name="ifpayFreePrice"
                        variant="outlined"
                        sx={{ ml: 3, mr: 1 }}
                      />
                      원 이상구매시무료
                    </GridRowContent>
                  </ListItemWrapper>

                  <Divider sx={{ my: 1 }} />

                  {/* 상품수량별 유료 */}
                  <ListItemWrapper>
                    <GridRowRadio>
                      <Radio name="goodsShippingPolicy" value={DeliveryCostType.LIMIT} />
                    </GridRowRadio>
                    <GridRowTitle>
                      <TypoWrapper value="상품수량별 유료" />
                    </GridRowTitle>
                    <GridRowContent>
                      기본배송비
                      <FormControlTextField<StateModel> name="limitShippingPrice" sx={{ mx: 1 }} />원
                      <FormControlTextField<StateModel> name="limitShippingEa" sx={{ ml: 3, mr: 1 }} />
                      개마다 기본배송비 반복부과
                    </GridRowContent>
                  </ListItemWrapper>
                </List>
              </Paper>
            )
          }
        </ListItemWrapper>

        {/* 제주/도서산간배송비 설정 */}
        <ListItemWrapper listTitleName="제주/도서산간배송비 설정" isRequired>
          <Paper sx={{ width: '100%', ml: 2 }}>
            <List>
              <ListItemWrapper listTitleName="">
                <Typography variant="subtitle2" sx={{ width: '150px' }}>
                  제주도/도서산간
                </Typography>
                {`${extraAddCostJeju?.price ?? 0}원`}
              </ListItemWrapper>
              <ListItemWrapper listTitleName="">
                <Typography variant="subtitle2" sx={{ width: '150px' }}>
                  그외 추가지역
                </Typography>
                {`${extraAddCostEtc?.price ?? 0}원`}
              </ListItemWrapper>
            </List>
          </Paper>
        </ListItemWrapper>
        {/* // table 영역 */}

        {/* 반품/교환배송비 */}
        <ListItemWrapper listTitleName="반품/교환배송비" isRequired>
          {`${returnCost ?? 0}원`}
        </ListItemWrapper>
        {/* // 반품/교환배송비 */}

        {/* 출고지 주소 */}
        <ListItemWrapper listTitleName="출고지 주소" isRequired>
          <Typography variant="body2">{displaySendingAddress}</Typography>
        </ListItemWrapper>
        {/* // 출고지 주소 */}

        {/* 반품/교환 주소 */}
        <ListItemWrapper listTitleName="반품/교환 주소" isRequired>
          <Typography variant="body2">{displayReturningAddress}</Typography>
        </ListItemWrapper>
        {/* // 반품/교환 주소 */}
      </List>
    </Card>
  );
});

const TypoWrapper = ({ value }) => {
  return (
    <Typography variant="subtitle2" sx={{ textAlign: 'center' }}>
      {value}
    </Typography>
  );
};

const GridRowRadio = ({ children }: { children?: React.ReactNode }) => {
  return (
    <Grid item md={1} xs={12}>
      {children}
    </Grid>
  );
};
const GridRowTitle = ({ children }: { children?: React.ReactNode }) => {
  return (
    <Grid item md={3} xs={12}>
      {children}
    </Grid>
  );
};
const GridRowContent = ({ children }: { children?: React.ReactNode }) => {
  return (
    <Grid item md={8} xs={12} display="flex" alignItems="center">
      {children}
    </Grid>
  );
};

const ListItemWrapper = ({
  listTitleName,
  isRequired,
  children,
  width,
}: {
  listTitleName?: string;
  isRequired?: boolean;
  children?: React.ReactNode;
  width?: number | string;
}) => (
  <ListItem sx={{ mt: 1, width: width ?? 'auto' }}>
    {listTitleName && <ListTitle name={listTitleName} isRequired={isRequired} width={listTitleWidth} />}
    {children}
  </ListItem>
);
