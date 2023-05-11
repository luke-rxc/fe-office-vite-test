import styled from '@emotion/styled';
import { Card, Box, Grid } from '@material-ui/core';
import { Link } from 'react-router-dom';

/**
 * 디스커버 섹션 라이브 리스트 component
 */
const DiscoverSectionLiveList = () => {
  return (
    <Card
      sx={{
        backgroundColor: 'background.paper',
        minHeight: '100%',
        padding: '10px 20px',
      }}
    >
      <Grid container direction="row" justifyContent="space-between" alignItems="center" mb="10px">
        <Grid item>예정된 라이브 리스트</Grid>
      </Grid>
      <InfoStyled>
        예정된 라이브는{' '}
        <Link to="/schedule-table" target="_blank" rel="noopener">
          라이브 편성표
        </Link>{' '}
        페이지에서 확인 가능합니다
      </InfoStyled>
    </Card>
  );
};

const InfoStyled = styled(Box)`
  margin-left: 20px;
  font-size: 14px;
`;

export default DiscoverSectionLiveList;
