import { Layout } from '@components/Layout';
import { Button } from '@material-ui/core';
import { DiscoverBannerList, Section, UnpublishedDiscoverBannerList } from '../components';
import { useDiscoverBannerListService } from '../services';

export const DiscoverBannerListContainer = () => {
  const {
    discoverBannerPublishedItems,
    isLoadingDiscoverBannerPublishedItems,
    discoverBannerItems,
    isLoadingDiscoverBannerItems,
    discoverBannerPagination,
    handleClickAddPublish,
    handleClickRemovePublish,
    handleClickRedirectCreate,
  } = useDiscoverBannerListService();
  return (
    <Layout title="디스커버 배너 편성 관리">
      <Section title="디스커버 배너 편성 현황">
        <DiscoverBannerList
          items={discoverBannerPublishedItems}
          loading={isLoadingDiscoverBannerPublishedItems}
          onClickRemovePublish={handleClickRemovePublish}
        />
      </Section>
      <Section
        title="미편성 디스커버 배너"
        action={
          <Button variant="contained" onClick={handleClickRedirectCreate}>
            신규 배너 생성
          </Button>
        }
      >
        <UnpublishedDiscoverBannerList
          items={discoverBannerItems}
          loading={isLoadingDiscoverBannerItems}
          pagination={discoverBannerPagination}
          onClickAddPublish={handleClickAddPublish}
        />
      </Section>
    </Layout>
  );
};
