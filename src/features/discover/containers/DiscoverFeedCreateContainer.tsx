import { Layout } from '@components/Layout';
import { Button } from '@material-ui/core';
import { FormProvider } from 'react-hook-form';
import {
  DiscoverFeedDetail,
  DiscoverFeedOptions,
  DiscoverFeedSectionList,
  DiscoverFeedSelectDisplayGroupModal,
  DiscoverFeedSelectSectionModal,
  Section,
} from '../components';
import {
  useDiscoverFeedCreateService,
  useDiscoverFeedDisplayGroupService,
  useDiscoverFeedAddSectionService,
} from '../services';

export const DiscoverFeedCreateContainer = () => {
  const {
    formMethod,
    sections,
    formRef,
    rowSelection,
    handleUpdateSections,
    handleDeleteSections,
    handleOrder,
    handleClickSubmit,
    handleCancelCreate,
    handleSubmitCreateDisplayGroup,
  } = useDiscoverFeedCreateService();
  const registeredDisplayGroupService = useDiscoverFeedDisplayGroupService({ handleUpdateSections });
  const addSectionsService = useDiscoverFeedAddSectionService({ sections, handleUpdateSections });

  return (
    <Layout
      title="전시 그룹 생성"
      actions={
        <>
          <Button variant="contained" color="inherit" size="large" onClick={handleCancelCreate}>
            취소
          </Button>
          <Button variant="contained" size="large" onClick={handleClickSubmit} sx={{ ml: '10px' }}>
            신규 생성하기
          </Button>
        </>
      }
    >
      <FormProvider {...formMethod}>
        <form ref={formRef} onSubmit={handleSubmitCreateDisplayGroup}>
          <Section title="기본 정보">
            <DiscoverFeedDetail />
          </Section>
          <Section title="섹션 정보">
            <DiscoverFeedOptions
              disabledListAction={rowSelection.selectedRowKeys.length === 0}
              hideLoadDisplayGroup={registeredDisplayGroupService.displayGroupOptions.length === 0}
              onClickOpenLoadDisplayGroup={registeredDisplayGroupService.handleOpenModal}
              onClickOpenAddSections={addSectionsService.handleOpenModal}
              onOrder={handleOrder}
              onDeleteSections={handleDeleteSections}
            />
            <DiscoverFeedSectionList
              discoverSectionItems={sections}
              isLoading={false}
              pagination={false}
              rowSelection={rowSelection}
            />
          </Section>
        </form>
      </FormProvider>
      <DiscoverFeedSelectDisplayGroupModal {...registeredDisplayGroupService} />
      <DiscoverFeedSelectSectionModal {...addSectionsService} />
    </Layout>
  );
};
