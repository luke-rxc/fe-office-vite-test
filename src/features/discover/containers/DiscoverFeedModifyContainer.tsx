import { Layout } from '@components/Layout';
import { Button } from '@material-ui/core';
import { FormProvider } from 'react-hook-form';
import {
  Section,
  DiscoverFeedDetail,
  DiscoverFeedOptions,
  DiscoverFeedSectionList,
  DiscoverFeedSelectDisplayGroupModal,
  DiscoverFeedSelectSectionModal,
} from '../components';
import { useDiscoverFeedDisplayGroupService, useDiscoverFeedAddSectionService } from '../services';
import { useDiscoverFeedModifyService } from '../services/useDiscoverFeedModifyService';

interface Props {
  feedId: string;
}

export const DiscoverFeedModifyContainer = (props: Props) => {
  const {
    formMethod,
    sections,
    formRef,
    displayGroupItem,
    disabledEdit,
    rowSelection,
    handleUpdateSections,
    handleDeleteSections,
    handleOrder,
    handleClickSubmit,
    handleCancelModify,
    handleSubmitModifyDisplayGroup,
    handleClickDeleteDisplayGroup,
  } = useDiscoverFeedModifyService(props);
  const registeredDisplayGroupService = useDiscoverFeedDisplayGroupService({ handleUpdateSections });
  const addSectionsService = useDiscoverFeedAddSectionService({ sections, handleUpdateSections });

  return (
    <Layout
      title={`전시그룹 상세 정보`}
      actions={
        <>
          <Button variant="contained" color="inherit" size="large" onClick={handleCancelModify}>
            취소
          </Button>
          <Button
            variant="contained"
            color="secondary"
            size="large"
            sx={{ ml: '10px' }}
            disabled={disabledEdit}
            onClick={handleClickDeleteDisplayGroup}
          >
            삭제
          </Button>
          <Button
            variant="contained"
            size="large"
            onClick={handleClickSubmit}
            sx={{ ml: '10px' }}
            disabled={disabledEdit}
          >
            편집
          </Button>
        </>
      }
    >
      <FormProvider {...formMethod}>
        <form ref={formRef} onSubmit={handleSubmitModifyDisplayGroup}>
          <Section title="기본 정보">
            <DiscoverFeedDetail item={displayGroupItem} disabledEdit={disabledEdit} />
          </Section>
          <Section title="섹션 정보">
            <DiscoverFeedOptions
              disabledListAction={rowSelection.selectedRowKeys.length === 0}
              disabledEdit={disabledEdit}
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
