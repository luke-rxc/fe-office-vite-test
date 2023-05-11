import { Layout } from '@components/Layout';
import { Button } from '@material-ui/core';
import { MainShortcutList, Section, MainShortcutUnpublishedList } from '../components';
import { useMainShortcutListService } from '../services';
import PlusIcon from '@assets/icons/Plus';

export const MainShortcutListContainer = () => {
  const {
    mainShortcutPublishedItems,
    isLoadingMainShortcutPublishedItems,
    mainShortcutItems,
    isLoadingMainShortcutItems,
    mainShortcutPagination,
    handleClickAddPublish,
    handleClickRemovePublish,
    handleClickRedirectCreate,
  } = useMainShortcutListService();

  return (
    <Layout title="숏컷 배너 관리">
      <Section title="숏컷 배너 편성 현황">
        <MainShortcutList
          items={mainShortcutPublishedItems}
          loading={isLoadingMainShortcutPublishedItems}
          onClickRemovePublish={handleClickRemovePublish}
        />
      </Section>
      <Section
        title="미편성 숏컷 배너 콘텐츠"
        action={
          <Button variant="contained" startIcon={<PlusIcon />} onClick={handleClickRedirectCreate}>
            편성 콘텐츠 생성
          </Button>
        }
      >
        <MainShortcutUnpublishedList
          items={mainShortcutItems}
          loading={isLoadingMainShortcutItems}
          pagination={mainShortcutPagination}
          onClickAddPublish={handleClickAddPublish}
        />
      </Section>
    </Layout>
  );
};
