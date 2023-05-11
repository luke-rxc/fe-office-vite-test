import styled from '@emotion/styled';
import { Grid, Card, CardHeader, CardContent } from '@material-ui/core';
import { CouponSummary } from '.';
import { AllowType, AllowItemType } from '../constants';
import { AllowAllInfo, PolicyInfo } from '../types';
import { FormLayout } from './FormLayout';

interface Props {
  allowAllInfo: AllowAllInfo;
  policyInfo: PolicyInfo;
}

/**
 * 쿠폰 정책 정보 component
 */
export const CouponPolicyInformation = ({
  allowAllInfo: { isAllowAll },
  policyInfo: { allowCategories, allowProviders, allowGoods, allowBrands, denyGoods, handleRemoteAllowItem },
}: Props) => {
  const allowTotalCount = allowCategories.length + allowProviders.length + allowGoods.length + allowBrands.length;
  return (
    <>
      <FormLayout label="쿠폰 전체적용">{isAllowAll === AllowType.ALL ? '전체적용' : '조건별적용'}</FormLayout>
      <Grid container spacing={2} sx={{ mt: '10px' }}>
        {isAllowAll === AllowType.CASE && (
          <Grid item xs={6}>
            <Card variant="outlined">
              <CardHeader title={<CardLabelStyled>쿠폰적용</CardLabelStyled>} />
              <CardContent>
                {allowCategories.length > 0 && (
                  <CouponSummary
                    title="카테고리"
                    items={allowCategories}
                    type={AllowItemType.ALLOW_CATEGORY}
                    onClickDelete={handleRemoteAllowItem}
                  />
                )}
                {allowProviders.length > 0 && (
                  <CouponSummary
                    title="입점사"
                    items={allowProviders}
                    type={AllowItemType.ALLOW_PROVIDER}
                    onClickDelete={handleRemoteAllowItem}
                  />
                )}
                {allowGoods.length > 0 && (
                  <CouponSummary
                    title="상품"
                    items={allowGoods}
                    type={AllowItemType.ALLOW_GOODS}
                    onClickDelete={handleRemoteAllowItem}
                  />
                )}
                {allowBrands.length > 0 && (
                  <CouponSummary
                    title="브랜드"
                    items={allowBrands}
                    type={AllowItemType.ALLOW_BRAND}
                    onClickDelete={handleRemoteAllowItem}
                  />
                )}
                {allowTotalCount === 0 && <>등록된 조건이 없습니다.</>}
              </CardContent>
            </Card>
          </Grid>
        )}
        {denyGoods.length > 0 && (
          <Grid item xs={6}>
            <Card variant="outlined">
              <CardHeader title={<CardLabelStyled>쿠폰제외</CardLabelStyled>} />
              <CardContent>
                <CouponSummary
                  title="상품"
                  items={denyGoods}
                  type={AllowItemType.DENY_GOODS}
                  onClickDelete={handleRemoteAllowItem}
                />
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>
    </>
  );
};

const CardLabelStyled = styled.span`
  font-size: 1rem;
`;
