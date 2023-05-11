import { FormControlSelect } from '@components/form';
import { Modal } from '@components/Modal';
import { Box, Tooltip, Typography } from '@material-ui/core';
import { FormProvider } from 'react-hook-form';
import { ReturnTypeUseDiscoverFeedDisplayGroupService } from '../services';
import { DiscoverFeedDisplayGroupFormField } from '../types';
import { DiscoverFeedSectionList } from './DiscoverFeedSectionList';
import { FormLayout } from './FormLayout';
import HelpIcon from '@material-ui/icons/Help';

interface Props extends ReturnTypeUseDiscoverFeedDisplayGroupService {}

export const DiscoverFeedSelectDisplayGroupModal = ({
  isOpenModal,
  isLoading,
  formMethod,
  selectedDisplayGroup,
  displayGroupOptions,
  handleCloseModal,
  handleClickRegistSections,
}: Props) => {
  return (
    <Modal
      title="섹션 추가하기"
      minWidth="800px"
      maxHeight="96vh"
      open={isOpenModal}
      onClose={handleCloseModal}
      onCancel={handleCloseModal}
      confirmText="추가하기"
      cancelText="닫기"
      onConfirm={handleClickRegistSections}
    >
      <FormProvider {...formMethod}>
        <Box p="10px" display="flex" alignItems="center">
          <Typography variant="h6" component="span" sx={{ mr: '5px' }}>
            기존 전시 그룹 불러오기
          </Typography>
          <Tooltip
            title={<Typography variant="body2">기존 등록된 전시 그룹의 색션 리스트 조회 및 등록</Typography>}
            children={<HelpIcon fontSize="small" />}
            placement="top"
          />
        </Box>
        <FormLayout label="그룹선택" required>
          <FormControlSelect<DiscoverFeedDisplayGroupFormField>
            name="displayGroup"
            options={displayGroupOptions}
            sx={{ width: '300px' }}
          />
        </FormLayout>
        <DiscoverFeedSectionList
          hideSortNum
          discoverSectionItems={selectedDisplayGroup?.sections ?? []}
          isLoading={isLoading}
          pagination={false}
          linked={false}
        />
      </FormProvider>
    </Modal>
  );
};
