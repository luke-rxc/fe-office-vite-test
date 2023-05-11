import styled from '@emotion/styled';
import { OrderActionType } from '@features/order/constants';
import { ReturnTypeUseOrderListService } from '@features/order/services';
import { Button } from '@material-ui/core';
import Redo from '@material-ui/icons/Redo';
import Undo from '@material-ui/icons/Undo';
import Download from '@material-ui/icons/Download';

interface Props {
  action: ReturnTypeUseOrderListService['action'];
  isExistSelection: boolean;
  // TODO: 엑셀 다운로드 기능 임시 차단(추후 오픈시 제거) - @luke
  tempHide?: boolean;
}

export const OrderActions = ({
  action: {
    orderActionTypes,
    disabledAllItemsExcelDownload,
    handleClickOrderPaid,
    handleClickOrderPreparingGoods,
    handleDownloadSelectedItems,
    handleDownloadAllItems,
  },
  isExistSelection,
  tempHide = false,
}: Props) => {
  return (
    <>
      {orderActionTypes.includes(OrderActionType.PREPARING_GOODS) && (
        <ButtonStyled
          type="button"
          variant="outlined"
          disabled={!isExistSelection}
          onClick={handleClickOrderPreparingGoods}
          startIcon={<Redo />}
        >
          상품준비 상태로 변경
        </ButtonStyled>
      )}

      {orderActionTypes.includes(OrderActionType.PAID) && (
        <ButtonStyled
          type="button"
          variant="outlined"
          disabled={!isExistSelection}
          onClick={handleClickOrderPaid}
          startIcon={<Undo />}
        >
          결제완료 상태로 변경
        </ButtonStyled>
      )}

      {tempHide && (
        <ButtonStyled
          type="button"
          variant="outlined"
          disabled={!isExistSelection}
          startIcon={<Download />}
          onClick={handleDownloadSelectedItems}
        >
          엑셀 다운로드 (선택항목)
        </ButtonStyled>
      )}

      {tempHide && (
        <ButtonStyled
          type="button"
          variant="outlined"
          disabled={disabledAllItemsExcelDownload}
          startIcon={<Download />}
          onClick={handleDownloadAllItems}
        >
          엑셀 전체 다운로드 (검색결과)
        </ButtonStyled>
      )}
    </>
  );
};

const ButtonStyled = styled(Button)`
  margin-left: 10px;
`;
