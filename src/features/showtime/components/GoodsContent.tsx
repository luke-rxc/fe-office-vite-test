import styled from '@emotion/styled';
import { GoodsItem } from '../types';
import { ContentImage } from './ContentImage';

interface Props {
  item: GoodsItem;
}

/**
 * 상품 정보 component
 */
export const GoodsContent = ({ item: { id, name, priceText, consumerPriceText, primaryImagePath } }: Props) => {
  return (
    <WrapperStyled>
      {primaryImagePath && <ContentImage path={primaryImagePath} />}
      <div>
        <GoodsInfoStyled>상품 ID: {id}</GoodsInfoStyled>
        <GoodsInfoStyled>{name}</GoodsInfoStyled>
        <GoodsInfoStyled>
          {!!consumerPriceText && <GoodsOriginPriceStyled>{consumerPriceText}</GoodsOriginPriceStyled>}
          {priceText}
        </GoodsInfoStyled>
      </div>
    </WrapperStyled>
  );
};

const WrapperStyled = styled.div`
  display: flex;
  flex-direction: row;
`;

const GoodsInfoStyled = styled.div`
  margin-top: 5px;
  font-size: 0.875rem;
  font-weight: bold;
`;

const GoodsOriginPriceStyled = styled.span`
  margin-right: 8px;
  color: #e8e8e8;
  text-decoration: line-through;
`;
