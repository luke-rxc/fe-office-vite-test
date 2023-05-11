import { Layout } from '@components/Layout';
import { Tabs, Tab } from '@material-ui/core';
import { FormProvider } from 'react-hook-form';
import {
  DiscoverEditActions,
  DiscoverKeywordModifyForm,
  Section,
  DiscoverKeywordMappingList,
  DiscoverBannerSelectGoodsModal,
  DiscoverSelectContentsModal,
  DiscoverKeywordRegistBulkModal,
  DiscoverKeywordRegistBulkResult,
} from '../components';
import { DiscoverSelectShowroomModal } from '../components/DiscoverSelectShowroomModal';
import { DiscoverKeywordMappingType } from '../constants';
import { useDiscoverKeywordMappingListTab } from '../hooks';
import {
  useDiscoverAddContentsService,
  useDiscoverAddGoodsService,
  useDiscoverAddShowroomService,
  useDiscoverKeywordBulkMappingService,
  useDiscoverKeywordModifyService,
} from '../services';

interface Props {
  keywordId: string;
}

export const DiscoverKeywordModifyContainer = ({ keywordId }: Props) => {
  const {
    isLoading,
    listItems,
    dataUpdatedAt,
    formMethod,
    isEdit,
    currentTabType,
    handleSubmitKeyword,
    handleEdit,
    handleCancelEdit,
    handleReloadTypeList,
    handleUpdateCurrentTab,
  } = useDiscoverKeywordModifyService({ keywordId });

  const addGoodsService = useDiscoverAddGoodsService({
    addedGoodsList: listItems.goods.list,
    handleUpdateGoodsList: listItems.goods.handleUpdateList,
  });
  const addContentsService = useDiscoverAddContentsService({
    addedContentsList: listItems.contents.list,
    handleUpdateContentsList: listItems.contents.handleUpdateList,
  });
  const addShowroomService = useDiscoverAddShowroomService({
    addedShowroomList: listItems.showroom.list,
    handleUpdateShowroomList: listItems.showroom.handleUpdateList,
  });

  const keywordTabOptions = useDiscoverKeywordMappingListTab({
    goodsCount: listItems.goods.list.length,
    showRoomCount: listItems.showroom.list.length,
    storyCount: listItems.contents.list.length,
  });

  const {
    handleOpenModal: handleOpenBulkMappingServiceModal,
    discoverKeywordBulkSummary,
    ...keywordBulkMappingService
  } = useDiscoverKeywordBulkMappingService({
    mappingType: currentTabType,
    keywordId,
    listItems,
    onReloadTypeList: handleReloadTypeList,
  });

  const handleOpenAddMappingModal = () => {
    switch (currentTabType) {
      case DiscoverKeywordMappingType.GOODS:
        addGoodsService.handleOpenModal();
        return;
      case DiscoverKeywordMappingType.CONTENTS:
        addContentsService.handleOpenModal();
        return;
      case DiscoverKeywordMappingType.SHOWROOM:
        addShowroomService.handleOpenModal();
        return;
    }
  };

  return (
    <>
      <FormProvider {...formMethod}>
        <form onSubmit={handleSubmitKeyword}>
          <Layout
            title="키워드 상세 정보"
            actions={
              <DiscoverEditActions isEdit={isEdit} size="large" onEdit={handleEdit} onCancelEdit={handleCancelEdit} />
            }
          >
            <Section title="키워드 기본 정보">
              <DiscoverKeywordModifyForm isEdit={isEdit} />
            </Section>

            <Tabs
              sx={{ bgcolor: 'background.paper', borderRadius: '4px', marginBottom: '10px' }}
              onChange={(_, value) => handleUpdateCurrentTab(value)}
              value={currentTabType}
            >
              {keywordTabOptions.map(({ label, value }) => {
                return <Tab key={value} label={label} value={value} />;
              })}
            </Tabs>
            <DiscoverKeywordMappingList
              type={currentTabType}
              listItems={listItems}
              dataUpdatedAt={dataUpdatedAt}
              isEdit={isEdit}
              isLoading={isLoading}
              onReloadTypeList={handleReloadTypeList}
              onOpenAddItemModal={handleOpenAddMappingModal}
              onOpenBulkMappingModal={handleOpenBulkMappingServiceModal}
            />
          </Layout>
        </form>
      </FormProvider>
      <DiscoverBannerSelectGoodsModal {...addGoodsService} />
      <DiscoverSelectContentsModal {...addContentsService} />
      <DiscoverSelectShowroomModal {...addShowroomService} />
      <DiscoverKeywordRegistBulkModal mappingType={currentTabType} {...keywordBulkMappingService}>
        <DiscoverKeywordRegistBulkResult
          mappingType={currentTabType}
          discoverKeywordBulkSummary={discoverKeywordBulkSummary}
        />
      </DiscoverKeywordRegistBulkModal>
    </>
  );
};
