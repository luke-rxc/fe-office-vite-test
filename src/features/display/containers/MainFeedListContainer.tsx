import { Layout } from '@components/Layout';
import { Box, Button, Card, CardHeader, Grid } from '@material-ui/core';
import { MainFeedList } from '../components';
import { UnpublishedMainFeedList } from '../components/UnpublishedMainFeedList';
import { useMainFeedListService } from '../services';

export const MainFeedListContainer = () => {
  const {
    mainFeedList,
    isMainFeedListLoading,
    unpublishedMainFeedList,
    isUnpublishedMainFeedListLoading,
    pagination,
    onDeletePublishing,
    onAddPublishing,
    goToCreatePage: handleCreate,
    alertUnableToPublish,
  } = useMainFeedListService();

  return (
    <Layout title="메인 피드 관리">
      <Card>
        <Grid container direction="row" justifyContent="space-between" alignItems="center">
          <CardHeader title="메인 피드 편성 현황" />
        </Grid>

        <MainFeedList items={mainFeedList} isLoading={isMainFeedListLoading} onDeletePublishing={onDeletePublishing} />
      </Card>

      <Card sx={{ mt: 2 }}>
        <Grid container direction="row" justifyContent="space-between" alignItems="center">
          <CardHeader title="미편성 메인 피드 콘텐츠" />

          <Box display="flex" sx={{ pr: 1 }}>
            <Button size="medium" variant="contained" onClick={handleCreate}>
              편성 콘텐츠 생성
            </Button>
          </Box>
        </Grid>

        {!isUnpublishedMainFeedListLoading && (
          <UnpublishedMainFeedList
            items={unpublishedMainFeedList?.content ?? []}
            pagination={pagination}
            isLoading={isUnpublishedMainFeedListLoading}
            onAddPublishing={onAddPublishing}
            alertUnableToPublish={alertUnableToPublish}
          />
        )}
      </Card>
    </Layout>
  );
};
