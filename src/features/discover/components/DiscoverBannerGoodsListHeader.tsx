import { Box, Tooltip, Typography } from '@material-ui/core';
import HelpIcon from '@material-ui/icons/Help';
import styled from '@emotion/styled';

interface Props {
  title: string;
  infoLabel: string;
  tooltipLabel: string;
  totalCount: number;
}

/**
 * 디스커버 배너 상품 리스트 헤더 component
 */
export const DiscoverBannerGoodsListHeader = ({ title, infoLabel, tooltipLabel, totalCount = 0 }: Props) => {
  return (
    <Box display="flex" alignItems="center" sx={{ lineHeight: '36px' }}>
      {title} 리스트 (총 <CountStyled>{totalCount.toLocaleString()}</CountStyled>개)
      <Box display="inline-flex" m="0 5px 0 10px" sx={{ color: '#999', fontSize: '14px' }}>
        {infoLabel}
      </Box>
      <Tooltip
        title={<Typography variant="body2">{tooltipLabel}</Typography>}
        children={<HelpIcon fontSize="small" />}
        placement="top"
      />
    </Box>
  );
};

const CountStyled = styled(Box)`
  display: inline-block;
  color: ${({ theme }) => theme.palette.primary.light};
  margin-left: 5px;
`;
