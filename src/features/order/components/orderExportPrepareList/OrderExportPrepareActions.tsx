import styled from '@emotion/styled';
import { OrderActionType } from '@features/order/constants';
import {
  ReturnTypeUseOrderBulkExportService,
  ReturnTypeUseOrderExportPrepareListService,
} from '@features/order/services';
import { Button } from '@material-ui/core';
import Download from '@material-ui/icons/Download';
import Upload from '@material-ui/icons/Upload';

interface Props {
  action: ReturnTypeUseOrderExportPrepareListService['action'];
  isExistSelection: boolean;
  onDownloadExportableItems: ReturnTypeUseOrderBulkExportService['handleDownloadExportableItems'];
}

/**
 * 송장 등록 대기 action component
 */
export const OrderExportPrepareActions = ({
  action: { orderActionTypes, handleOpenOrderExportModel },
  isExistSelection,
  onDownloadExportableItems,
}: Props) => {
  return (
    <>
      {orderActionTypes.includes(OrderActionType.DOWNLOAD) && (
        <ButtonStyled
          type="button"
          variant="outlined"
          disabled={!isExistSelection}
          onClick={onDownloadExportableItems}
          startIcon={<Download />}
        >
          출고 다운로드
        </ButtonStyled>
      )}

      {orderActionTypes.includes(OrderActionType.UPLOAD) && (
        <ButtonStyled type="button" variant="outlined" onClick={handleOpenOrderExportModel} startIcon={<Upload />}>
          출고일괄 업로드
        </ButtonStyled>
      )}
    </>
  );
};

const ButtonStyled = styled(Button)`
  margin-left: 10px;
`;
