import { useEffect } from 'react';
import { FieldErrors, UseFormReturn } from 'react-hook-form';
import { useMutation } from '@hooks/useMutation';
import useLoading from '@hooks/useLoading';
import { ErrorModel } from '@utils/api/createAxios';
import { log, getValidationErrorMessage } from '../../utils';
import { toSubmitReqParam, toOptSubmitReqParam, toPartnerSubmitReqParam, StateModel } from '../../models';
import { registerGoods, registerOption, registerPartnerGoods } from '../../apis';
import { useLink, usePageType } from '../../hooks';
import { DialogFeedbackLabel, CommonDetailMessage } from '../../constants';
import { useSubmitCommonService } from './useSubmitCommonService';
import { useDialogService } from '..';

interface Props {
  methods: UseFormReturn<StateModel>;
  partnerProviderId: number | null;
}

export const useCreateSubmitService = ({ methods, partnerProviderId }: Props) => {
  const { isPartnerSite } = usePageType();
  const { navigateGoodsMain } = useLink();
  const { showLoading, hideLoading } = useLoading();
  const { handleSubmit, getValues } = methods;
  const { submitOptionValidator } = useSubmitCommonService();
  const { successDialog, errorDialog } = useDialogService();

  /** API : 상품 등록 Submit */
  const { mutateAsync: submitGoodsMutate, isLoading: isSubmitGoodsLoading } = useMutation(registerGoods, {
    onError: (error: ErrorModel) => {
      errorDialog({
        label: DialogFeedbackLabel.CREATE_GOODS,
        message: error?.data?.message,
      });
    },
  });

  /** API : 파트너 상품 등록 Submit */
  const { mutateAsync: submitPartnerGoodsMutate, isLoading: isSubmitPartnerGoodsLoading } = useMutation(
    registerPartnerGoods,
    {
      onError: (error: ErrorModel) => {
        errorDialog({
          label: DialogFeedbackLabel.CREATE_GOODS,
          message: error?.data?.message,
        });
      },
    },
  );

  /** API : 옵션 등록 Submit */
  const { mutateAsync: submitOptionMutate, isLoading: isSubmitOptionLoading } = useMutation(registerOption, {
    onError: (error: ErrorModel) => {
      errorDialog({
        label: DialogFeedbackLabel.CREATE_OPTION,
        message: error?.data?.message,
      });
    },
  });

  /** 등록 Loading */
  const isSubmitLoading = isSubmitGoodsLoading || isSubmitOptionLoading;

  // 저장
  const saveSubmit = async (value: StateModel) => {
    /** @todo 두개의 값이 다른 이유 확인 필요 */
    // console.log('[useDetailService: Create saveSubmit]', value, getValues());
    const values = getValues();
    const { isSuccess: isOptionValidSuccess, message: optionValidErrorMessage } = submitOptionValidator(values);

    if (!isOptionValidSuccess) {
      errorDialog({
        label: DialogFeedbackLabel.CREATE_OPTION,
        message: optionValidErrorMessage,
      });
      return;
    }

    if (isPartnerSite) {
      // submit request param
      const requestSubmitParam = toPartnerSubmitReqParam(values, partnerProviderId);

      // 상품 등록
      await submitPartnerGoodsMutate(requestSubmitParam);
    } else {
      // option request param
      const requestOptionParam = toOptSubmitReqParam(values);

      // submit request param
      const requestSubmitParam = toSubmitReqParam(values);

      // 등록시 1. 상품등록 -> 상품 ID 추출
      const submitGoods = await submitGoodsMutate(requestSubmitParam);

      // 등록시 2. 옵션등록(상품 ID 반영)
      await submitOptionMutate({
        goodsId: submitGoods['id'],
        params: requestOptionParam,
      });
    }

    successDialog({
      label: DialogFeedbackLabel.CREATE_GOODS,
      closeCb: () => {
        navigateGoodsMain();
      },
    });
  };

  const saveSubmitValidError = (values: FieldErrors<StateModel>) => {
    errorDialog({
      label: DialogFeedbackLabel.CREATE_GOODS,
      message: `${CommonDetailMessage.FAIL_VALID}\r\n\r\n${getValidationErrorMessage(values)}`,
      contentAlign: 'left',
    });

    log('[useDetailService error] handleSearchSubmit::type', getValues());
    log('saveSubmitValidError', values);
  };

  const handleSaveSubmit = handleSubmit(saveSubmit, saveSubmitValidError);

  const handleDebug = () => {
    log('[react-hook-form values]:::', getValues());

    log('toOptSubmitReqParam(getValues())', toOptSubmitReqParam(getValues()));
  };

  useEffect(() => {
    isSubmitLoading || isSubmitPartnerGoodsLoading ? showLoading() : hideLoading();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSubmitLoading, isSubmitPartnerGoodsLoading]);

  return {
    handleSaveSubmit,
    handleDebug,
  };
};
