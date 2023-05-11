import { Layout } from '@components/Layout';
import styled from '@emotion/styled';
import { Box, Skeleton } from '@material-ui/core';
import { ShowtimeTabs } from '../components';
import { ManagePageType } from '../constants';
import { useShowtimeManageDashboardService } from '../services';

interface Props {
  showTimeId: number;
  pageType: string;
}

export const ShowtimeManageDashboardContainer = ({ showTimeId, pageType }: Props) => {
  const {
    tabItems,
    selectedTab,
    isLoadingCreateChatChannel,
    isLoadingShowtimeContentsItem,
    isLoadingChatChannelItem,
    isErrorCreateChatChannel,
    isErrorShowtimeContentsItem,
    isErrorChatChannelItem,
    handleChangeTab,
  } = useShowtimeManageDashboardService({ showTimeId, pageType });

  if (isLoadingCreateChatChannel || isLoadingShowtimeContentsItem || isLoadingChatChannelItem) {
    return (
      <Layout title="라이브 운영 대시보드">
        <>
          <SkeletonStyled variant="rectangular" width="100%" height={40} />
          <SkeletonStyled variant="rectangular" width="100%" height={500} />
        </>
      </Layout>
    );
  }

  if (isErrorCreateChatChannel || isErrorShowtimeContentsItem || isErrorChatChannelItem) {
    return (
      <Layout title="라이브 운영 대시보드">
        <Box display="flex" alignItems="center" justifyContent="center" width="100%" height="650px" p={1}>
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            width="300px"
            height="300px"
            border="1px solid #d2d2d2"
            borderRadius="4px"
            sx={{ backgroundColor: '#d2d2d2' }}
          >
            <Box>정보를 불러올수 없습니다.</Box>
            <Box>다시 시도해주세요</Box>
          </Box>
        </Box>
      </Layout>
    );
  }

  return (
    <Layout title="라이브 운영 대시보드">
      <ShowtimeTabs<ManagePageType>
        tabName="showtime-manage-tab"
        tabItems={tabItems}
        selectedTab={selectedTab}
        onChangeTab={handleChangeTab}
      />
    </Layout>
  );
};

const SkeletonStyled = styled(Skeleton)`
  margin: 10px 0;
`;
