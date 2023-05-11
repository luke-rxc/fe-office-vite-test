import { SiteType } from '@constants/site';
import { useClipboardCopy } from '@hooks/useClipboardCopy';
import { useDialog } from '@hooks/useDialog';
import useLoading from '@hooks/useLoading';
import { useSiteType } from '@hooks/useSiteType';
import { DialogType } from '@models/DialogModel';
import { ErrorModel } from '@utils/api/createAxios';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router';
import { useOrderDetailCommonQuery, useOrderExportDetailQuery } from '../hooks';

interface Props {
  exportId: string;
}

export type ReturnTypeUseOrderExportDetailService = ReturnType<typeof useOrderExportDetailService>;

/**
 * 주문 출고상세 service
 */
export const useOrderExportDetailService = ({ exportId }: Props) => {
  const navigate = useNavigate();
  const dialog = useDialog();
  const { showLoading, hideLoading } = useLoading();
  const copy = useClipboardCopy();
  const currentSiteType = useSiteType();

  const onError = (error: ErrorModel, errorMessage: string) => {
    dialog.open({
      content: `${errorMessage}\r\n(${error.data.message})`,
      type: DialogType.ALERT,
      onClose: () => {
        navigate(-1);
      },
    });
  };

  /**
   * 주문 출고상세 item
   */
  const { data: orderExportDetail, isLoading: isLoadingOrderExportDetail } = useOrderExportDetailQuery(exportId, {
    onError: (error) => onError(error, '출고상세 조회중 문제가 발생하였습니다'),
  });

  const { data: orderDetailCommon, isLoading: isLoadingOrderDetailCommon } = useOrderDetailCommonQuery(
    orderExportDetail?.orderId.toString(),
    {
      enabled: !!orderExportDetail?.orderId,
      onError: (error) => onError(error, '주문공통 조회중 문제가 발생하였습니다'),
    },
  );

  useEffect(() => {
    if (isLoadingOrderDetailCommon || isLoadingOrderExportDetail) {
      showLoading();
    } else {
      hideLoading();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoadingOrderDetailCommon, isLoadingOrderExportDetail]);

  const handleClickCopyClipboard = (value: string) => {
    copy(value, {
      onSuccess: () => {
        toast.success('복사가 완료되었습니다.');
      },
      onError: () => {
        toast.error('복사 도중 문제가 발생하였습니다.');
      },
    });
  };

  return {
    orderDetailCommon,
    orderExportDetail,
    isLoading: isLoadingOrderDetailCommon || isLoadingOrderExportDetail,
    isManager: currentSiteType === SiteType.MANAGER,
    handleClickCopyClipboard,
  };
};
