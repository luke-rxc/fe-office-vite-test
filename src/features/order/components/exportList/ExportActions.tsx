import { ReturnTypeUseOrderExportListService } from '@features/order/services';
import { Button } from '@material-ui/core';
import Redo from '@material-ui/icons/Redo';
import Download from '@material-ui/icons/Download';

interface Props {
  actions: ReturnTypeUseOrderExportListService['actions'];
  // TODO: 엑셀 다운로드 기능 임시 차단(추후 오픈시 제거) - @luke
  tempHide?: boolean;
}

export const ExportActions = ({
  actions: {
    isExistSelection,
    isManager,
    disabledAllItemsExcelDownload,
    enabledActionShippingComplete,
    enabledActionOrderComplete,
    handleClickShippingComplete,
    handleClickOrderComplete,
    handleDownloadExportSelectedItems,
    handleDownloadExportAllItems,
  },
  tempHide = false,
}: Props) => {
  return (
    <>
      {enabledActionShippingComplete && (
        <Button
          type="button"
          variant="outlined"
          disabled={!isExistSelection}
          onClick={handleClickShippingComplete}
          startIcon={<Redo />}
        >
          배송완료로 상태 변경
        </Button>
      )}

      {enabledActionOrderComplete && isManager && (
        <Button
          type="button"
          variant="outlined"
          disabled={!isExistSelection}
          onClick={handleClickOrderComplete}
          startIcon={<Redo />}
          sx={{ ml: '10px' }}
        >
          구매확정 상태 변경
        </Button>
      )}

      {tempHide && (
        <Button
          type="button"
          variant="outlined"
          disabled={!isExistSelection}
          onClick={handleDownloadExportSelectedItems}
          startIcon={<Download />}
          sx={{ ml: '10px' }}
        >
          엑셀 다운로드 (선택항목)
        </Button>
      )}

      {tempHide && (
        <Button
          type="button"
          variant="outlined"
          disabled={disabledAllItemsExcelDownload}
          onClick={handleDownloadExportAllItems}
          startIcon={<Download />}
          sx={{ ml: '10px' }}
        >
          엑셀 전체 다운로드 (검색결과)
        </Button>
      )}
    </>
  );
};
