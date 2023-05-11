import { useDialog } from '@hooks/useDialog';
import { useMutation } from '@hooks/useMutation';
import { useQuery } from '@hooks/useQuery';
import { DialogType } from '@models/DialogModel';
import { UploadFileInfo } from '@models/UploadModel';
import { useFileUploader, UploadDomainType } from '@services/useFileUploader';
import { ErrorModel } from '@utils/api/createAxios';
import { addDays } from 'date-fns';
import _get from 'lodash/get';
import { useEffect, useState } from 'react';
import { FieldError, useForm } from 'react-hook-form';
import { useQueryClient } from 'react-query';
import { useNavigate } from 'react-router-dom';
import { checkExistGoods, getCouponItem, getShowroomCombo, modifyCouponItem, registCouponItem } from '../apis';
import {
  AllowType,
  CouponIssuePeriodType,
  couponItemQueryKey,
  CouponPageType,
  CouponPageTypeLabel,
  DateType,
  CouponTimesArray,
  showroomComboListQueryKey,
} from '../constants';
import {
  couponDefaultValues,
  toCouponFormField,
  toCouponRequestParamsByForm,
  toCouponUseAllowPolicyModel,
  toShowroomComboListModel,
} from '../models';
import { CouponFormField, PolicyInfo, CouponRequestParams } from '../types';
import { setTimes } from '../utils';

interface Props {
  pageType: CouponPageType;
  policyInfo: PolicyInfo;
  couponId: number | null;
}

export type ReturnTypeUseCouponService = ReturnType<typeof useCouponService>;

export const useCouponService = ({ pageType, policyInfo, couponId }: Props) => {
  const navigate = useNavigate();
  const client = useQueryClient();
  const dialog = useDialog();
  /**
   * 다운로드 가능한 쿠폰여부
   */
  const [isDownloadableCoupon, setIsDownloadableCoupon] = useState<boolean>(false);

  // 이미지 업로드 관련
  const { fileInfos, handleUpdateFileInfo, handleUpload, handleRemove } = useFileUploader({
    domainType: UploadDomainType.COUPON,
    initFileInfos: [],
  });

  /**
   * 쿠폰 상세 조회
   * page type이 수정일 경우에만 조회
   */
  const { data: couponItem } = useQuery([couponItemQueryKey, couponId], () => getCouponItem(couponId), {
    enabled: pageType === CouponPageType.MODIFY,
    onError: (error) => {
      dialog.open({
        type: DialogType.ALERT,
        content: `쿠폰 조회시 문제가 발생하였습니다\r\n(${error.data.message})`,
        onClose: () => {
          navigate('/coupon/list');
          dialog.close();
        },
      });
    },
  });

  /**
   * 쇼룸 콤보리스트 조회
   */
  const { data: showroomComboList } = useQuery(showroomComboListQueryKey, getShowroomCombo, {
    select: (data) => {
      return toShowroomComboListModel(data.items);
    },
  });

  const formMethod = useForm<CouponFormField>({
    defaultValues: couponDefaultValues,
  });

  /**
   * 쿠폰 등록, 수정, 적용대상 상품 유무 확인 api error 처리
   */
  const onError = (error: ErrorModel) => {
    dialog.open({
      content: `${CouponPageTypeLabel[pageType]} 처리중 문제가 발생하였습니다.\r\n(${error.data.message})`,
      type: DialogType.ALERT,
    });
  };

  /**
   * 쿠폰 등록
   */
  const { mutateAsync: registCoupon } = useMutation(
    (item: CouponRequestParams) => {
      return registCouponItem(item);
    },
    {
      onError,
    },
  );

  /**
   * 쿠폰 수정
   */
  const { mutateAsync: modifyCoupon } = useMutation(
    (item: CouponRequestParams) => {
      return modifyCouponItem(couponId, item);
    },
    {
      onError,
    },
  );

  /**
   * 쿠폰 적용대상 상품 유무 확인
   */
  const { mutateAsync: checkCouponExistGoods } = useMutation(
    (item: CouponRequestParams['usePolicyRequest']) => {
      return checkExistGoods(item);
    },
    {
      onError,
    },
  );

  const {
    watch,
    handleSubmit,
    // register,
    setValue,
    getValues,
    trigger,
    reset,
    formState: { errors },
  } = formMethod;

  const imageError = _get(errors, 'display.imageId') as FieldError;
  const isAllowAll = watch('usePolicyRequest.isAllowAll') as AllowType;

  // 쿠폰 썸네일 validation 해제
  // useEffect(() => {
  //   register('display.imageId', { required: '쿠폰썸네일을 선택해주세요' });
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  useEffect(() => {
    if (couponItem) {
      const couponFormValues = toCouponFormField(couponItem, showroomComboList);
      reset(couponFormValues);
      couponItem.display.image && handleUpdateFileInfo([couponItem.display.image]);
      policyInfo.handleUpdateAllAllowItem(toCouponUseAllowPolicyModel(couponItem.useAllowPolicy));
      if (couponFormValues.downloadPolicy.startDateTime <= new Date()) {
        setIsDownloadableCoupon(true);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [couponItem]);

  useEffect(() => {
    const subscription = watch((value, { name }) => {
      // 쿠폰 다운로드 시작일 변경시 쿠폰사용 시작일 동기화 처리
      if (name === 'downloadPolicy.startDateTime') {
        setValue('issuePeriod.startDateTime', value.downloadPolicy.startDateTime);

        if (
          value.downloadPolicy.endDateTime &&
          new Date(value.downloadPolicy.startDateTime) > new Date(value.downloadPolicy.endDateTime)
        ) {
          setValue('downloadPolicy.endDateTime', null);
        }

        if (
          value.issuePeriod.expiredDateTime &&
          new Date(value.downloadPolicy.startDateTime) > new Date(value.issuePeriod.expiredDateTime)
        ) {
          setValue('issuePeriod.expiredDateTime', null);
        }
      }

      /**
       * 쿠폰적용타입을 장바구니 쿠폰으로 변경시 쿠폰 적용 대상을 전체적용으로 변경 및 쿠폰 발급방법 '웰컴'으로 수정
       *
       * 요청으로 인한 해당 로직 주석처리
       */
      /*if (name === 'useType' && value.useType === CouponUseType.CART) {
        setValue('downloadPolicy.issueType', CouponIssueType.WELCOME);
        setValue('usePolicyRequest.isAllowAll', AllowType.ALL);
        policyInfo && policyInfo.handleRemoveAllAllowItem();
      }*/

      // 쿠폰 유효기간 기준을 기간으로 변경시 시작일을 다운로드 시작일로 동기화
      if (
        name === 'issuePeriod.issuePeriodType' &&
        value.issuePeriod.issuePeriodType === CouponIssuePeriodType.PERIOD &&
        value.downloadPolicy.startDateTime
      ) {
        setValue('issuePeriod.startDateTime', value.downloadPolicy.startDateTime);
      }
    });
    return () => subscription.unsubscribe();
  }, [policyInfo, setValue, watch]);

  const onSubmit = handleSubmit((values) => {
    dialog.open({
      title: '확인',
      content: `${CouponPageTypeLabel[pageType]}하시겠습니까?`,
      type: DialogType.CONFIRM,
      onConfirm: async () => {
        dialog.open({
          content: '진행중입니다. 잠시만 기다려주세요.',
          type: DialogType.ALERT,
        });

        const registParams = toCouponRequestParamsByForm(values, policyInfo);

        if (await checkCouponExistGoods(registParams.usePolicyRequest)) {
          if (pageType === CouponPageType.CREATE) {
            await registCoupon(registParams);
          } else if (pageType === CouponPageType.MODIFY) {
            await modifyCoupon(registParams);
          }

          dialog.open({
            title: '알림',
            content: `${CouponPageTypeLabel[pageType]}이 완료되었습니다.`,
            type: DialogType.ALERT,
            onClose: () => {
              if (pageType === CouponPageType.MODIFY) {
                client.invalidateQueries([couponItemQueryKey, couponId]);
              }
              dialog.close();
              navigate('/coupon/list');
            },
          });
        } else {
          dialog.open({
            title: '알림',
            content: '쿠폰 적용대상에 해당되는 상품이 없습니다.',
            type: DialogType.ALERT,
          });
        }
      },
      onClose: dialog.close,
    });
  });

  /**
   * 쿠폰 전체적용 여부 업데이트
   */
  const handleUpdateAllowAll = (allowType: AllowType) => {
    setValue('usePolicyRequest.isAllowAll', allowType);
  };

  /**
   * 기간 range 설정
   */
  const handleChangeRange = (type: 'issuePeriod' | 'downloadPolicy', range: number) => {
    if (type === 'issuePeriod') {
      const fromDate = Number.isInteger(range) ? getValues('downloadPolicy.startDateTime') : null;
      const toDate = Number.isInteger(range)
        ? addDays(setTimes(getValues('downloadPolicy.startDateTime'), CouponTimesArray[DateType.END]), range)
        : null;

      setValue('issuePeriod.startDateTime', fromDate);
      setValue('issuePeriod.expiredDateTime', toDate);
    } else {
      const startDateTime = setTimes(new Date(), CouponTimesArray[DateType.START]);
      const fromDate = Number.isInteger(range) ? startDateTime : null;
      const toDate = Number.isInteger(range)
        ? addDays(setTimes(startDateTime, CouponTimesArray[DateType.END]), range)
        : null;

      setValue('downloadPolicy.startDateTime', fromDate);
      setValue('downloadPolicy.endDateTime', toDate);
    }
  };

  /**
   * 파일 업로드 change
   */
  const handleChangeUploadFile = async (fileInfos: Array<UploadFileInfo>) => {
    try {
      const uploadFiles = await handleUpload(fileInfos);
      handleUpdateFileInfo(uploadFiles, true);
      setValue('display.imageId', uploadFiles[0].id.toString());
      trigger('display.imageId');
    } catch (e) {
      dialog.open({
        content: '대표이미지 업로드에 문제가 발생하였습니다. 다시 확인해주세요.',
        type: DialogType.ALERT,
      });
    }
  };

  /**
   * 업로드 파일 제거
   */
  const handleRemoveUploadFile = (index: number) => {
    handleRemove(index);
    setValue('display.imageId', '');
    trigger('display.imageId');
  };

  const handleRedirectCouponList = () => {
    dialog.open({
      title: '확인',
      content: `${CouponPageTypeLabel[pageType]}을 중단 하시겠습니까?\r\n저장되지 않은 내용은 삭제됩니다.`,
      type: DialogType.CONFIRM,
      onConfirm: () => {
        dialog.close();
        navigate('/coupon/list');
      },
      onClose: dialog.close,
    });
  };

  return {
    form: { formMethod, handleSubmit: onSubmit },
    allowAllInfo: {
      isAllowAll,
      handleUpdateAllowAll,
    },
    showCouponPolicyButton: true, //useType !== CouponUseType.CART,
    isDownloadableCoupon,
    handleChangeRange,
    handleRedirectCouponList,
    uploader: {
      fileInfos,
      imageError,
      handleChangeUploadFile,
      handleRemoveUploadFile,
    },
    showroomComboList,
  };
};
