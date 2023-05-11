import { Modal } from '@components/Modal';
import { Box, Tooltip, Typography } from '@material-ui/core';
import { ReturnTypeUseDiscoverFeedAddSectionService } from '../services';
import { DiscoverFeedSectionList } from './DiscoverFeedSectionList';
import HelpIcon from '@material-ui/icons/Help';

interface Props extends ReturnTypeUseDiscoverFeedAddSectionService {}

export const DiscoverFeedSelectSectionModal = ({
  isOpenModal,
  isLoading,
  sectionList,
  rowSelection,
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
      <Box p="10px" display="flex" alignItems="center">
        <Typography variant="h6" component="span" sx={{ mr: '5px' }}>
          등록 가능한 섹션 리스트
        </Typography>
        <Tooltip
          title={
            <Typography variant="body2">
              현재 공개중 상태 섹션중, 등록 가능한 섹션 리스트 (현재 그룹에 등록된 섹션은 제외)
            </Typography>
          }
          children={<HelpIcon fontSize="small" />}
          placement="top"
        />
      </Box>

      <DiscoverFeedSectionList
        hideSortNum
        discoverSectionItems={sectionList}
        isLoading={isLoading}
        pagination={false}
        rowSelection={rowSelection}
        linked={false}
      />
    </Modal>
  );
};
