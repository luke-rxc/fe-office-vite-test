import { Layout } from '@components/Layout';
import { Button } from '@material-ui/core';
import { DiscoverFeedList, DiscoverFeedListHeader } from '../components';
import { useDiscoverFeedListService } from '../services';

/**
 * 디스커버 피드 리스트 container
 */
export const DiscoverFeedListContainer = () => {
  const {
    discoverFeedDisplayGroupItems,
    discoverFeedDisplayGroupPagination,
    displayGroupType,
    handleClickCreateDisplayGroup,
    handleClickDisplayGroupItem,
  } = useDiscoverFeedListService();

  const onClickAddDisplayGroup = handleClickCreateDisplayGroup();

  return (
    <Layout
      title="디스커버 피드 전시/관리"
      actions={
        discoverFeedDisplayGroupItems.length === 0 ? (
          <Button variant="contained" size="large" onClick={onClickAddDisplayGroup}>
            전시그룹 추가
          </Button>
        ) : null
      }
    >
      <DiscoverFeedListHeader
        show={discoverFeedDisplayGroupItems.length > 0}
        pagination={discoverFeedDisplayGroupPagination}
      />
      <DiscoverFeedList
        displayGroupType={displayGroupType}
        items={discoverFeedDisplayGroupItems}
        pagination={discoverFeedDisplayGroupPagination}
        onClickCreateDisplayGroup={handleClickCreateDisplayGroup}
        onClickDisplayGroupItem={handleClickDisplayGroupItem}
      />
    </Layout>
  );
};
