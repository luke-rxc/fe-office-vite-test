import { Modal } from '@components/Modal';
import { Box, Chip, Grid } from '@material-ui/core';
import { FormProvider } from 'react-hook-form';
import { ReturnTypeUseDiscoverAddContentsService } from '../services';
import { DiscoverContentsList } from './DiscoverContentsList';
import { ContentsSearchForm } from './ContentsSearchForm';

interface Props extends ReturnTypeUseDiscoverAddContentsService {}

export const DiscoverSelectContentsModal = ({
  isOpenModal,
  isLoading,
  contentsList,
  selectedContentsList,
  showroomList,
  providerList,
  rowSelection,
  pagination,
  form,
  handleCloseModal,
  handleClickRegistContentsList,
  handleDeleteSelectContents,
}: Props) => {
  return (
    <Modal
      title="콘텐츠 검색/추가"
      minWidth="96%"
      maxHeight="96vh"
      open={isOpenModal}
      confirmText="추가하기"
      cancelText="닫기"
      disabled={selectedContentsList.length === 0}
      onClose={handleCloseModal}
      onCancel={handleCloseModal}
      onConfirm={handleClickRegistContentsList}
    >
      <FormProvider {...form.formMethod}>
        <ContentsSearchForm form={form} showroomCombo={showroomList} providerCombo={providerList} />
      </FormProvider>
      {(selectedContentsList ?? []).length > 0 && (
        <Box m="0 20px" sx={{ border: '1px solid #e8e8e8' }}>
          <Grid container spacing={1} p="10px">
            {selectedContentsList.map((contents) => {
              return (
                <Grid item key={contents.id}>
                  <Chip
                    label={`${contents.name} (${contents.id})`}
                    onDelete={handleDeleteSelectContents(contents.rowKey)}
                  />
                </Grid>
              );
            })}
          </Grid>
        </Box>
      )}
      <DiscoverContentsList
        hideSortNum
        items={contentsList}
        isLoading={isLoading}
        pagination={pagination}
        rowSelection={rowSelection}
        hideAllSelect
      />
    </Modal>
  );
};
