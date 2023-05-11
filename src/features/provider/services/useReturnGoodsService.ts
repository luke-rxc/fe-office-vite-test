import toast from 'react-hot-toast';
import useLoading from '@hooks/useLoading';
import { useMutation } from '@hooks/useMutation';
import { ErrorModel, ErrorDataModel } from '@utils/api/createAxios';
import { getLinkForReturnGoods } from '../apis';
import { ReturnGoodsFlowLinkModel } from '../models';

/**
 * 자동반품 등록 서비스
 */
export const useReturnGoodsService = (): {
  returnGoodsLinkData: ReturnGoodsFlowLinkModel;
  isSuccess: boolean;
  isError: boolean;
  handleGetLinkForReturnGoods: (providerId: number, shippingId: number) => void;
} => {
  const { showLoading, hideLoading } = useLoading();
  const { isSuccess, isError, mutate, data } = useMutation(
    ({ providerId, shippingId }: { providerId: number; shippingId: number }) =>
      getLinkForReturnGoods(providerId, shippingId),
    {
      onSuccess: () => {
        hideLoading();
      },
      onError: (error: ErrorModel<ErrorDataModel>) => {
        const msg = error.data.message;
        toast.error(msg);
        hideLoading();
      },
    },
  );
  /**
   * 굿스플로우 자동반품등록 링크 조회
   * @param formData
   */
  const handleGetLinkForReturnGoods = (providerId: number, shippingId: number) => {
    showLoading();
    mutate({
      providerId,
      shippingId,
    });
  };

  return {
    handleGetLinkForReturnGoods,
    returnGoodsLinkData: data,
    isSuccess,
    isError,
  };
};
