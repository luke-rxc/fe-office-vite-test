import { Layout } from '@components/Layout';
import { Button } from '@material-ui/core';
import { FormProvider } from 'react-hook-form';
import { DiscoverSectionCreateForm, DiscoverSectionCreateModal, DiscoverSectionList } from '../components';
import { useDiscoverSectionCreateService, useDiscoverSectionListService } from '../services';

export const DiscoverSectionListContainer = () => {
  const listServiceProps = useDiscoverSectionListService();
  const {
    formMethod,
    formRef,
    isOpenModal,
    keywordComboList,
    sectionCreatableTypeList,
    handleSubmitCreateSection,
    handleClickSubmit,
    handleClickCancel,
    handleOpenModal,
  } = useDiscoverSectionCreateService();
  return (
    <>
      <Layout
        title="디스커버 섹션 조회/관리"
        actions={
          <Button variant="contained" size="large" onClick={handleOpenModal}>
            신규 섹션 생성
          </Button>
        }
      >
        <DiscoverSectionList {...listServiceProps} />
      </Layout>
      <DiscoverSectionCreateModal open={isOpenModal} onConfirm={handleClickSubmit} onCloseModal={handleClickCancel}>
        <FormProvider {...formMethod}>
          <form ref={formRef} onSubmit={handleSubmitCreateSection}>
            <DiscoverSectionCreateForm
              keywordCombo={keywordComboList}
              sectionCreatableTypeList={sectionCreatableTypeList}
            />
          </form>
        </FormProvider>
      </DiscoverSectionCreateModal>
    </>
  );
};
