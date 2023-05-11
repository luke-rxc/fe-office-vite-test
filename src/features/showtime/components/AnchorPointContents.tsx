import styled from '@emotion/styled';
import { Box } from '@material-ui/core';
import { ShowtimeAnchorPointItemModel } from '../models';
import { ContentImage } from './ContentImage';

interface Props {
  item: ShowtimeAnchorPointItemModel;
  indexingName: string | null;
}

/**
 * 앵커포인트 content component
 */
export const AnchorPointContents = ({ item, indexingName }: Props) => {
  return (
    <WrapperContentStyled>
      {indexingName && <ContentIndexStyled>{indexingName}</ContentIndexStyled>}
      {item.imagePath && <ContentImage path={item.imagePath} size={40} />}
      <Box m="10px 0">
        <GoodsInfoStyled>{item.name}</GoodsInfoStyled>
        <TimeInfoStyled>{item.seekingPositionSecondsText}</TimeInfoStyled>
      </Box>
    </WrapperContentStyled>
  );
};

const WrapperContentStyled = styled(Box)`
  display: flex;
  flex-direction: row;
`;

const ContentIndexStyled = styled(Box)`
  display: flex;
  align-items: center;
`;

const GoodsInfoStyled = styled(Box)`
  font-size: 0.875rem;
`;

const TimeInfoStyled = styled(GoodsInfoStyled)`
  margin-top: 5px;
`;
