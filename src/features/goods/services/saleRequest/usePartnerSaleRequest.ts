/**
 * 승인요청 Service
 * @description 사용 : 파트너 상품수정, 파트너 상품 리스트
 */

import { useMutation } from 'react-query';
import { ErrorModel } from '@utils/api/createAxios';
import { DialogFeedbackLabel, SaleRequestMessage } from '../../constants';
import { postPartnerSaleRequest } from '../../apis';
import { useDialogService } from '..';

interface HandlePartnerSaleRequestParams {
  goodsIds: number[];
  successCb?: () => void;
}

export const usePartnerSaleRequest = () => {
  const { successDialog, errorDialog, confirmDialog } = useDialogService();
  /**
   * API : 승인 요청
   */
  const { mutateAsync: postPartnerSaleRequestMutate } = useMutation((goodsIds: number[]) =>
    postPartnerSaleRequest({
      goodsIds,
    }),
  );

  const handlePartnerSaleRequest = ({ goodsIds, successCb }: HandlePartnerSaleRequestParams) => {
    confirmDialog({
      title: SaleRequestMessage.CONFIRM_SALE_REQUEST.title,
      message: SaleRequestMessage.CONFIRM_SALE_REQUEST.message,
      confirmCb: () => {
        postPartnerSaleRequestMutate(goodsIds, {
          onSuccess: () => {
            successDialog({
              label: DialogFeedbackLabel.SALE,
              closeCb: () => {
                successCb?.();
              },
            });
          },
          onError: (error: ErrorModel) => {
            errorDialog({
              label: DialogFeedbackLabel.SALE,
              message: error?.data?.message,
            });
          },
        });
      },
    });
  };

  return {
    handlePartnerSaleRequest,
  };
};
