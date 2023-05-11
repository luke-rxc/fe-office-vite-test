import { Modal } from '@components/Modal';
import { Box, Chip, Grid } from '@material-ui/core';
import { FormProvider } from 'react-hook-form';
import { ReturnTypeUseDiscoverAddShowroomService } from '../services';
import { DiscoverShowroomSearchList } from './DiscoverShowroomSearchList';
import { ShowroomSearchForm } from './ShowroomSearchForm';

interface Props extends ReturnTypeUseDiscoverAddShowroomService {}

export const DiscoverSelectShowroomModal = ({
  isOpenModal,
  isLoading,
  showroomList,
  selectedShowroomList,
  brandList,
  providerList,
  rowSelection,
  pagination,
  form,
  handleCloseModal,
  handleClickRegistShowroomList,
  handleDeleteSelectShowroom,
}: Props) => {
  return (
    <Modal
      title="쇼룸 검색/추가"
      minWidth="96%"
      maxHeight="96vh"
      open={isOpenModal}
      confirmText="추가하기"
      cancelText="닫기"
      disabled={selectedShowroomList.length === 0}
      onClose={handleCloseModal}
      onCancel={handleCloseModal}
      onConfirm={handleClickRegistShowroomList}
    >
      <FormProvider {...form.formMethod}>
        <ShowroomSearchForm form={form} brandCombo={brandList} providerCombo={providerList} />
      </FormProvider>
      {(selectedShowroomList ?? []).length > 0 && (
        <Box m="0 20px" sx={{ border: '1px solid #e8e8e8' }}>
          <Grid container spacing={1} p="10px">
            {selectedShowroomList.map((showroom) => {
              return (
                <Grid item key={showroom.id}>
                  <Chip
                    label={`${showroom.name} (${showroom.id})`}
                    onDelete={handleDeleteSelectShowroom(showroom.rowKey)}
                  />
                </Grid>
              );
            })}
          </Grid>
        </Box>
      )}
      <DiscoverShowroomSearchList
        items={showroomList}
        isLoading={isLoading}
        pagination={pagination}
        rowSelection={rowSelection}
      />
    </Modal>
  );
};
