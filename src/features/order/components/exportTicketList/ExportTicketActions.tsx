import { ExportTicketActionType } from '@features/order/constants';
import { ReturnTypeUseOrderExportTicketListService } from '@features/order/services';
import { Button } from '@material-ui/core';
import Redo from '@material-ui/icons/Redo';
import Undo from '@material-ui/icons/Undo';
import Download from '@material-ui/icons/Download';
import { Upload } from '@material-ui/icons';

interface Props {
  actions: ReturnTypeUseOrderExportTicketListService['actions'];
  onOpenStatusChangeUploadModal: () => void;
  onOpenBookingDateChangeUploadModal: () => void;
}

/**
 * 출고(티켓) action component
 */
export const ExportTicketActions = ({
  actions: {
    isManager,
    isExistSelection,
    isExistTicketList,
    exportTicketActionTypes,
    handleClickUpdateUsed,
    handleClickUpdateIssued,
    handleClickUpdateAllUsed,
    handleDownloadExportTicketSelectedItems,
    handleDownloadExportTicketAllItems,
  },
  onOpenStatusChangeUploadModal: handleOpenStatusChangeUploadModal,
  onOpenBookingDateChangeUploadModal: handleOpenBookingDateChangeUploadModal,
}: Props) => {
  return (
    <>
      {exportTicketActionTypes.includes(ExportTicketActionType.ENABLE_CHANGE_USED) && (
        <Button
          type="button"
          variant="outlined"
          disabled={!isExistSelection}
          onClick={handleClickUpdateUsed}
          startIcon={<Redo />}
        >
          사용완료로 상태 변경
        </Button>
      )}
      {exportTicketActionTypes.includes(ExportTicketActionType.ENABLE_CHANGE_UNUSED) && (
        <Button
          type="button"
          variant="outlined"
          disabled={!isExistSelection}
          onClick={handleClickUpdateIssued}
          startIcon={<Undo />}
        >
          미사용 상태 변경
        </Button>
      )}
      <Button
        type="button"
        variant="outlined"
        disabled={!isExistSelection}
        onClick={handleDownloadExportTicketSelectedItems}
        startIcon={<Download />}
        sx={{ ml: '10px' }}
      >
        엑셀 다운로드
      </Button>
      {exportTicketActionTypes.includes(ExportTicketActionType.ENABLE_CHANGE_ALL_USED) && isExistTicketList && (
        <Button
          type="button"
          variant="outlined"
          onClick={handleClickUpdateAllUsed}
          startIcon={<Redo />}
          sx={{ ml: '10px' }}
        >
          일괄 사용완료 처리
        </Button>
      )}
      {isManager && (
        <Button
          type="button"
          variant="outlined"
          onClick={handleOpenStatusChangeUploadModal}
          startIcon={<Upload />}
          sx={{ ml: '10px' }}
        >
          일괄 사용완료 엑셀 업로드
        </Button>
      )}
      {isManager && (
        <Button
          type="button"
          variant="outlined"
          onClick={handleOpenBookingDateChangeUploadModal}
          startIcon={<Upload />}
          sx={{ ml: '10px' }}
        >
          일괄 투숙일지정 엑셀 업로드
        </Button>
      )}
      <Button
        type="button"
        variant="outlined"
        onClick={handleDownloadExportTicketAllItems}
        startIcon={<Download />}
        sx={{ ml: '10px' }}
      >
        엑셀 전체 다운로드 (검색결과)
      </Button>
    </>
  );
};
