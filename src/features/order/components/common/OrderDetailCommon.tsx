import {
  OrderInfo,
  OrderRefundInfo,
  OrderExchangeOrderInfo,
  OrderExportInfo,
  OrderGoodsInfo,
  OrderReturnInfo,
  OrderSummary,
} from '@features/order/components/common';
import { UsedServiceType } from '@features/order/constants';
import { ReturnTypeUseLandingPage } from '@features/order/hooks';
import { ReturnTypeUseOrderDetailActionService, ReturnTypeUseOrderDetailService } from '@features/order/services';
import { Box } from '@material-ui/core';

interface Props {
  commonItem: ReturnTypeUseOrderDetailService['orderDetailCommon'];
  isManager: ReturnTypeUseOrderDetailService['isManager'];
  isFold?: boolean;
  usedServiceType: UsedServiceType;
  usedServiceId: string;
  onClickCopyClipboard: ReturnTypeUseOrderDetailService['handleClickCopyClipboard'];
  onClickOpenService: ReturnTypeUseLandingPage['handleClickOpenService'];
  onClickChangeDirectShippingMethod?: ReturnTypeUseOrderDetailActionService['actions']['handleClickChangeDirectShippingMethod'];
}

export const OrderDetailCommon = ({
  commonItem,
  isManager,
  isFold = false,
  usedServiceType,
  usedServiceId,
  onClickCopyClipboard: handleClickCopyClipboard,
  onClickOpenService: handleClickOpenService,
  onClickChangeDirectShippingMethod: handleClickChangeDirectShippingMethod,
}: Props) => {
  if (!commonItem) {
    return null;
  }

  return (
    <>
      <OrderExchangeOrderInfo item={commonItem.order} />
      <OrderInfo
        item={commonItem.order}
        isManager={isManager}
        isOrderDetail={usedServiceType === UsedServiceType.ORDER}
        onClickCopyClipboard={handleClickCopyClipboard}
        onClickOpenService={handleClickOpenService}
      />
      {!isFold && (
        <>
          <OrderExportInfo
            item={commonItem.exportItem}
            targetServiceId={usedServiceType === UsedServiceType.EXPORT ? usedServiceId : null}
            onClickCopyClipboard={handleClickCopyClipboard}
            onClickOpenService={handleClickOpenService}
          />
          <OrderReturnInfo
            items={commonItem.returnList}
            targetServiceId={usedServiceType === UsedServiceType.RETURN ? usedServiceId : null}
            onClickCopyClipboard={handleClickCopyClipboard}
            onClickOpenService={handleClickOpenService}
          />
          <OrderRefundInfo
            items={commonItem.refundList}
            targetServiceId={usedServiceType === UsedServiceType.REFUND ? usedServiceId : null}
            onClickOpenService={handleClickOpenService}
          />
          <OrderGoodsInfo
            items={commonItem.itemOption.itemOptionList}
            onClickOpenService={handleClickOpenService}
            onClickChangeDirectShippingMethod={handleClickChangeDirectShippingMethod}
            isManager={isManager}
            isOrderDetail={usedServiceType === UsedServiceType.ORDER}
          />
          <OrderSummary item={commonItem.itemOption} isManager={isManager} />
          <Box p="10px 0" />
        </>
      )}
    </>
  );
};
