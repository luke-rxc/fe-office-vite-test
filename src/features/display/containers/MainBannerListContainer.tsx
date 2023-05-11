import { Layout } from '@components/Layout';
import { Box, Button, Card, CardHeader, Grid } from '@material-ui/core';
import { MainBannerList, UnpublishedMainBannerList } from '../components';
import { useMainBannerListService } from '../services';

export const MainBannerListContainer = () => {
  const {
    mainBannerList,
    isMainBannerListLoading,
    unpublishedMainBannerList,
    isUnpublishedMainBannerListLoading,
    pagination,
    onDeletePublishing,
    onAddPublishing,
    goToCreatePage: handleCreate,
    alertUnableToPublish,
  } = useMainBannerListService();

  return (
    <Layout title="메인 배너 관리">
      <Card>
        <Grid container direction="row" justifyContent="space-between" alignItems="center">
          <CardHeader title="메인 배너 편성 현황" />
        </Grid>

        <MainBannerList
          items={mainBannerList}
          isLoading={isMainBannerListLoading}
          onDeletePublishing={onDeletePublishing}
        />
      </Card>

      <Card sx={{ mt: 2 }}>
        <Grid container direction="row" justifyContent="space-between" alignItems="center">
          <CardHeader title="미편성 메인 배너 콘텐츠" />

          <Box display="flex" sx={{ pr: 1 }}>
            <Button size="medium" variant="contained" onClick={handleCreate}>
              편성 콘텐츠 생성
            </Button>
          </Box>
        </Grid>

        {!isUnpublishedMainBannerListLoading && (
          <UnpublishedMainBannerList
            items={unpublishedMainBannerList?.content ?? []}
            pagination={pagination}
            isLoading={isUnpublishedMainBannerListLoading}
            onAddPublishing={onAddPublishing}
            alertUnableToPublish={alertUnableToPublish}
          />
        )}
      </Card>
    </Layout>
  );
};
