import styled from '@emotion/styled';
import { Box } from '@material-ui/core';
import { ScheduleTableDetailBannerGoodsModel } from '../models';
import { ContentImage } from './ContentImage';

interface Props {
  item: ScheduleTableDetailBannerGoodsModel;
}

/**
 * 배너 상품 정보 component
 */
export const BannerGoodsContent = ({
  item: {
    id,
    name,
    priceText,
    consumerPriceText,
    primaryImage: { fullPath: primaryImagePath },
  },
}: Props) => {
  return (
    <WrapperStyled>
      {primaryImagePath && <ContentImage path={primaryImagePath} />}
      <GoodsInfoWrapperStyled>
        <GoodsInfoStyled>상품 ID: {id}</GoodsInfoStyled>
        <GoodsInfoStyled>{name}</GoodsInfoStyled>
        <GoodsInfoStyled>
          {!!consumerPriceText && <GoodsOriginPriceStyled>{consumerPriceText}</GoodsOriginPriceStyled>}
          {priceText}
        </GoodsInfoStyled>
      </GoodsInfoWrapperStyled>
    </WrapperStyled>
  );
};

const WrapperStyled = styled(Box)`
  display: flex;
  flex-direction: row;
  border: 1px solid #e8e8e8;
  border-radius: 8px;
`;

const GoodsInfoWrapperStyled = styled(Box)`
  align-items: start;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const GoodsInfoStyled = styled(Box)`
  margin-top: 5px;
  font-size: 0.875rem;
  font-weight: bold;

  &:first-of-type {
    margin-top: 0;
  }
`;

const GoodsOriginPriceStyled = styled.span`
  margin-right: 8px;
  color: #e8e8e8;
  text-decoration: line-through;
`;
