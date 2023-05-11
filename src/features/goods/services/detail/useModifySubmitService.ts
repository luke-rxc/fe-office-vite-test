import { useEffect, useState } from 'react';
import { FieldErrors, UseFormReturn } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useMutation } from '@hooks/useMutation';
import useLoading from '@hooks/useLoading';
import { ErrorModel } from '@utils/api/createAxios';
import { usePageType, useLink } from '../../hooks';
import { putGoods, putOption, putPartnerGoods, postPartnerGoodsCheck } from '../../apis';
import {
  toModifySubmitReqParam,
  toPartnerModifySubmitDataReqParam,
  toPartnerModifySubmitReqParam,
  toOptSubmitReqParam,
  StateModel,
} from '../../models';
import { log, getValidationErrorMessage } from '../../utils';
import { PartnerDetailMessage, SaleRequestMessage, DialogFeedbackLabel, CommonDetailMessage } from '../../constants';
import { useSubmitCommonService } from './useSubmitCommonService';
import { usePartnerSaleRequest, useManagerSaleRequest } from '../saleRequest';
import { useDialogService } from '..';

interface Props {
  methods: UseFormReturn<StateModel>;
  requestId: number | null;
}

export const useModifySubmitService = ({ methods, requestId }: Props) => {
  const { navigateGoodsMain } = useLink();
  const { id: goodsId, isPartnerSite } = usePageType();
  const { showLoading, hideLoading } = useLoading();
  const { handleSubmit, getValues } = methods;
  const { submitOptionValidator } = useSubmitCommonService();
  const { successDialog, errorDialog } = useDialogService();

  /** 파트너 : 수정요청 Dialog */
  const [isModifyRequestDialogOpen, setIsModifyRequestDialogOpen] = useState(false);

  /** 매니저 : 반려요청 Dialog */
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);

  /** API : 상품 등록 Submit */
  const { mutateAsync: submitGoodsMutate, isLoading: isSubmitGoodsLoading } = useMutation(putGoods, {
    onError: (error: ErrorModel) => {
      errorDialog({
        label: DialogFeedbackLabel.MODIFY_GOODS,
        message: error?.data?.message,
      });
    },
  });

  /** API : 옵션 등록 Submit */
  const { mutateAsync: submitOptionMutate, isLoading: isSubmitOptionLoading } = useMutation(putOption, {
    onError: (error: ErrorModel) => {
      errorDialog({
        label: DialogFeedbackLabel.MODIFY_OPTION,
        message: error?.data?.message,
      });
    },
  });

  /** 파트너 API : 상품 등록 Submit */
  const { mutateAsync: partnerSubmitGoodsMutate, isLoading: isPartnerSubmitGoodsLoading } = useMutation(
    putPartnerGoods,
    {
      onError: (error: ErrorModel) => {
        errorDialog({
          label: DialogFeedbackLabel.MODIFY_GOODS,
          message: error?.data?.message,
        });
      },
    },
  );

  /**
   * 파트너 API : 승인 요청
   */
  const { handlePartnerSaleRequest: handlePartnerSaleRequestExecute } = usePartnerSaleRequest();

  /**
   * 파트너 API : 상품 수정 Submit 전 체크
   */
  const { mutateAsync: partnerGoodsCheckMutate, isLoading: isPartnerGoodsCheckLoading } = useMutation(
    postPartnerGoodsCheck,
    {
      onError: (error: ErrorModel) => {
        errorDialog({
          label: DialogFeedbackLabel.MODIFY_GOODS,
          message: error?.data?.message,
        });
      },
    },
  );

  /** Api : 승인 & 반려 요청 */
  const { isPutApprovalLoading, handlePutApprovalMutate, isPutRejectLoading, handlePutRejectMutate } =
    useManagerSaleRequest();

  /** 등록 Loading */
  const isSubmitLoading = isSubmitGoodsLoading || isSubmitOptionLoading || isPartnerGoodsCheckLoading;

  /** Action : 파트너 상품 수정 Submit */
  const partnerSaveSubmit = async (memo?: string) => {
    const values = getValues();
    // request param
    const requestParam = toPartnerModifySubmitReqParam(values, memo);

    await partnerSubmitGoodsMutate({
      goodsId,
      params: requestParam,
    });

    successDialog({
      label: DialogFeedbackLabel.MODIFY_GOODS,
      closeCb: () => {
        navigateGoodsMain();
      },
    });
  };

  /**
   * Action : 상품 수정 Submit
   * - Manager Office : 상품 수정 Submit
   * - Partner Office : Memo 가 필요한지 체크 > Memo Dialog or 상품 수정 Submit
   */
  const saveSubmit = async (value: StateModel) => {
    /** @todo 두개의 값이 다른 이유 확인 필요 */
    log('[useDetailService: Modify saveSubmit]', value, getValues());

    const values = getValues();
    const { isSuccess: isOptionValidSuccess, message: optionValidErrorMessage } = submitOptionValidator(values);

    if (!isOptionValidSuccess) {
      errorDialog({
        label: DialogFeedbackLabel.MODIFY_GOODS,
        message: optionValidErrorMessage,
      });
      return;
    }

    if (isPartnerSite) {
      // request param
      const requestParam = toPartnerModifySubmitDataReqParam(values);
      const isRequiredMemo = await partnerGoodsCheckMutate({ goodsId, params: requestParam });

      log('[partnerGoodsCheckMutate] isRequiredMemo', isRequiredMemo);

      if (isRequiredMemo) {
        setIsModifyRequestDialogOpen(true);
      } else {
        partnerSaveSubmit();
      }
      return;
    }

    // submit request param
    const requestSubmitParam = toModifySubmitReqParam(values);

    // option request param
    const requestOptionParam = toOptSubmitReqParam(values);

    log('requestSubmitParam', requestSubmitParam);
    log('requestOptionParam', requestOptionParam);

    // 수정시 1. 상품수정
    await submitGoodsMutate({
      goodsId,
      params: requestSubmitParam,
    });

    // 수정시 2. 옵션등록(상품 ID 반영)
    await submitOptionMutate({
      goodsId,
      params: requestOptionParam,
    });

    successDialog({
      label: DialogFeedbackLabel.MODIFY_GOODS,
      closeCb: () => {
        navigateGoodsMain();
      },
    });
  };

  const saveSubmitValidError = (values: FieldErrors<StateModel>) => {
    errorDialog({
      label: DialogFeedbackLabel.MODIFY_GOODS,
      message: `${CommonDetailMessage.FAIL_VALID}\r\n\r\n${getValidationErrorMessage(values)}`,
      contentAlign: 'left',
    });
    log('[useDetailService] handleSearchSubmit::type', getValues());
    log('saveSubmitValidError', values);
  };

  const handleSaveSubmit = handleSubmit(saveSubmit, saveSubmitValidError);

  const handleDebug = () => {
    log('[react-hook-form values]:::', getValues());
    log('toOptSubmitReqParam(getValues())', toOptSubmitReqParam(getValues()));
  };

  /** 매니저 : 승인 요청 */
  const handleManagerApproval = () => {
    if (!requestId) {
      toast.error(SaleRequestMessage.VALID_REJECT.SYSTEM);
      return;
    }
    handlePutApprovalMutate({
      requestIds: [requestId],
      successCb: () => {
        navigateGoodsMain();
      },
    });
  };

  /** 매니저 : 반려요청 */
  const handleManagerReject = (memo: string) => {
    if (!memo) {
      toast.error(SaleRequestMessage.VALID_REJECT.MEMO);
      return;
    }
    setIsRejectDialogOpen(false);
    handlePutRejectMutate({
      requestIds: [requestId],
      memo,
      successCb: () => {
        navigateGoodsMain();
      },
    });
  };

  /** 매니저 : 반려요청 Dialog Open */
  const handleManagerRejectDialogOpen = () => {
    if (!requestId) {
      toast.error(SaleRequestMessage.VALID_REJECT.SYSTEM);
      return;
    }
    setIsRejectDialogOpen(true);
  };

  const handleManagerRejectDialogClose = () => {
    setIsRejectDialogOpen(false);
  };

  /** 파트너 : 승인 요청 연동 */
  const handlePartnerSaleRequest = () => {
    log('[useDetailService] handlePartnerSaleRequest');
    handlePartnerSaleRequestExecute({
      goodsIds: [goodsId],
      successCb: () => {
        navigateGoodsMain();
      },
    });
  };

  /** 파트너 : 수정 요청 Memo dialog close */
  const handleModifyRequestDialogClose = () => {
    setIsModifyRequestDialogOpen(false);
  };

  /** 파트너 : 수정 요청 Memo 포함하여 상품 수정 진행 */
  const handleModifyRequest = (memo: string) => {
    if (!memo) {
      toast.error(PartnerDetailMessage.VALID_MODIFY.MEMO);
      return;
    }

    partnerSaveSubmit(memo);
  };

  useEffect(() => {
    isSubmitLoading || isPartnerSubmitGoodsLoading || isPutApprovalLoading || isPutRejectLoading
      ? showLoading()
      : hideLoading();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSubmitLoading, isPartnerSubmitGoodsLoading, isPutApprovalLoading, isPutRejectLoading]);

  return {
    handleSaveSubmit,
    handlePartnerSaleRequest,
    handleManagerApproval,
    handleDebug,

    // 파트너 수정 요청
    partnerRequestMemoDialog: {
      isModifyRequestDialogOpen,
      handleModifyRequestDialogClose,
      handleModifyRequest,
    },

    // 매니저 반려 요청
    managerRejectMemoDialog: {
      isRejectDialogOpen,
      handleManagerRejectDialogClose,
      handleManagerRejectDialogOpen,
      handleManagerReject,
    },
  };
};
