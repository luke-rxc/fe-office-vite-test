import styled from '@emotion/styled';
import { ReturnTypeUseOrderRefundListService } from '@features/order/services';
import { Button } from '@material-ui/core';
import Download from '@material-ui/icons/Download';

interface Props {
  action: ReturnTypeUseOrderRefundListService['action'];
  // TODO: 엑셀 다운로드 기능 임시 차단(추후 오픈시 제거) - @luke
  tempHide?: boolean;
}

/**
 * 환불 action component
 */
export const OrderRefundActions = ({
  action: {
    disabledAllItemsExcelDownload,
    isExistSelection,
    handleDownloadRefundSelectedItems,
    handleDownloadRefundAllItems,
  },
  tempHide = false,
}: Props) => {
  if (!tempHide) {
    return null;
  }

  return (
    <>
      <ButtonStyled
        type="button"
        variant="outlined"
        disabled={!isExistSelection}
        startIcon={<Download />}
        onClick={handleDownloadRefundSelectedItems}
      >
        엑셀 다운로드 (선택항목)
      </ButtonStyled>
      <ButtonStyled
        type="button"
        variant="outlined"
        disabled={disabledAllItemsExcelDownload}
        startIcon={<Download />}
        onClick={handleDownloadRefundAllItems}
      >
        엑셀 전체 다운로드 (검색결과)
      </ButtonStyled>
    </>
  );
};

const ButtonStyled = styled(Button)`
  margin-left: 10px;
`;
