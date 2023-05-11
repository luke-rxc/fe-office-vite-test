import { Layout } from '@components/Layout';
import { Button, Tab, Tabs } from '@material-ui/core';
import { FormProvider } from 'react-hook-form';
import { DiscoverKeywordCreateForm, DiscoverKeywordCreateModal, DiscoverKeywordList } from '../components';
import { DiscoverKeywordStatus, DiscoverKeywordStatusLabel } from '../constants/discoverKeyword';
import { useDiscoverKeywordCreateService, useDiscoverKeywordListService } from '../services';

export const DiscoverKeywordListContainer = () => {
  const { discoverKeywordItems, isLoading, pagination, keywordSearchStatus, handleUpdateKeywordSearchStatus } =
    useDiscoverKeywordListService();
  const {
    formMethod,
    formRef,
    isOpenModal,
    handleSubmitCreateKeyword,
    handleClickSubmit,
    handleClickCancel,
    handleOpenModal,
  } = useDiscoverKeywordCreateService();

  return (
    <>
      <Layout
        title="키워드 관리"
        actions={
          <Button variant="contained" onClick={handleOpenModal}>
            신규키워드 생성
          </Button>
        }
      >
        <Tabs
          sx={{ bgcolor: 'background.paper', borderRadius: '4px', marginBottom: '10px' }}
          onChange={(_, value) => handleUpdateKeywordSearchStatus(value)}
          value={keywordSearchStatus}
        >
          {Object.keys(DiscoverKeywordStatus).map((key) => {
            return (
              <Tab
                key={DiscoverKeywordStatus[key]}
                label={DiscoverKeywordStatusLabel[key]}
                value={DiscoverKeywordStatus[key]}
              />
            );
          })}
        </Tabs>
        <DiscoverKeywordList items={discoverKeywordItems} isLoading={isLoading} pagination={pagination} />
      </Layout>
      <DiscoverKeywordCreateModal open={isOpenModal} onConfirm={handleClickSubmit} onCloseModal={handleClickCancel}>
        <FormProvider {...formMethod}>
          <form ref={formRef} onSubmit={handleSubmitCreateKeyword}>
            <DiscoverKeywordCreateForm />
          </form>
        </FormProvider>
      </DiscoverKeywordCreateModal>
    </>
  );
};
