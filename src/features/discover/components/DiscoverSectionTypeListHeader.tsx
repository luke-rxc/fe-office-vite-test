import { Grid, Box, Tooltip, Typography, Button } from '@material-ui/core';
import Replay from '@material-ui/icons/Replay';
import HelpIcon from '@material-ui/icons/Help';
import { DiscoverSectionDisplayType } from '../constants';
import { PaginationProps } from '@components/table/Table';
import styled from '@emotion/styled';

interface Props {
  title: string;
  displayType: DiscoverSectionDisplayType;
  dataUpdatedAt: string;
  infoLabel: string;
  infoCurationLabel: string;
  tooltipLabel: string;
  tooltipCurationLabel: string;
  pagination?: PaginationProps;
  onReloadList: () => void;
}

export const DiscoverSectionTypeListHeader = ({
  title,
  displayType,
  dataUpdatedAt,
  infoLabel,
  infoCurationLabel,
  tooltipLabel,
  tooltipCurationLabel,
  pagination,
  onReloadList: handleReloadList,
}: Props) => {
  const isDisplayTypeCuration = displayType === DiscoverSectionDisplayType.CURATION;
  return (
    <Grid container direction="row" justifyContent="space-between" alignItems="center" mb="10px">
      <Grid item display="flex" alignItems="center">
        {title} 전시 리스트 (총 <CountStyled>{(pagination?.total ?? 0).toLocaleString()}</CountStyled>개){' '}
        <Box display="inline-flex" m="0 5px 0 10px" sx={{ color: '#999', fontSize: '14px' }}>
          {isDisplayTypeCuration ? infoCurationLabel : infoLabel}
        </Box>
        <Tooltip
          title={<Typography variant="body2">{isDisplayTypeCuration ? tooltipCurationLabel : tooltipLabel}</Typography>}
          children={<HelpIcon fontSize="small" />}
          placement="top"
        />
      </Grid>
      <Grid item display="flex" alignItems="center">
        <Box display="inline-flex" mr="10px" sx={{ color: '#999' }}>
          {dataUpdatedAt} 기준 데이터
        </Box>
        <Button variant="contained" startIcon={<Replay fontSize="small" />} onClick={handleReloadList}>
          리스트 갱신
        </Button>
      </Grid>
    </Grid>
  );
};

const CountStyled = styled(Box)`
  color: ${({ theme }) => theme.palette.primary.light};
  margin-left: 5px;
`;
