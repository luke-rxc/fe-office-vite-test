import { useCallback, useEffect, useState, useRef } from 'react';
import { useFormContext } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useDialog } from '@hooks/useDialog';
import { DialogType } from '@models/DialogModel';
import { GoodsShippingPolicy, LimitType as DeliveryCostType, GoodsShippingMethod, GoodsKind } from '@constants/goods';
import { DeliveryType, ProviderDeliveryPolicy } from '../../constants';
import { DetailDeliveryTmplModel } from '../../models';

interface Props {
  deliveryTmplLists: DetailDeliveryTmplModel[];
  initProviderShippingId: number | string;
  selectedGoodsKind?: GoodsKind;
}

const getDeliveryOptions = (lists: DetailDeliveryTmplModel[]) => {
  return lists.map(({ name, id }) => {
    return {
      label: name,
      value: id,
    };
  });
};

export const useDetailDeliveryService = ({ deliveryTmplLists, initProviderShippingId, selectedGoodsKind }: Props) => {
  const { setValue, getValues, watch } = useFormContext();
  const { open: dialogOpen, close: dialogClose } = useDialog();
  const [selectedPolicyInfo, setSelectedPolicyInfo] = useState<DetailDeliveryTmplModel>(null);
  const isInitSelectGoodsKindRef = useRef(false);
  const isInitProviderShippingRef = useRef(false);

  /** 배송유형 체크에 따른 처리 */
  const watchDeliveryType = watch('deliveryType');

  /** 묶음 배송 적용 모드 */
  const watchShippingPolicy = watch('shippingPolicy');

  /** 배송비 설정 항목 */
  const watchGoodsShippingPolicy = watch('goodsShippingPolicy');

  /** 배송 정책 옵션 */
  const deliveryTmplOptions = getDeliveryOptions(deliveryTmplLists);

  /** Template 변경시 form value 변경 */
  const changeTmplValues = useCallback(
    (policyInfo: DetailDeliveryTmplModel) => {
      if (policyInfo) {
        const { shippingPolicy } = policyInfo;
        const { costType, ifpayCost, ifpayFreePrice, payCost } = shippingPolicy;

        const goodsShippingPolicy =
          costType === ProviderDeliveryPolicy.PAY || costType === ProviderDeliveryPolicy.FREE
            ? DeliveryCostType.UNLIMIT
            : DeliveryCostType.IFPAY;

        setValue('goodsShippingPolicy', goodsShippingPolicy);
        setValue('unLimitShippingPrice', payCost);
        setValue('ifpayCost', ifpayCost);
        setValue('ifpayFreePrice', ifpayFreePrice);

        if (
          costType === ProviderDeliveryPolicy.PAY ||
          costType === ProviderDeliveryPolicy.IFPAY ||
          costType === ProviderDeliveryPolicy.FREE
        ) {
          setValue('limitShippingPrice', 0);
          setValue('limitShippingEa', 0);
        }
      }
    },
    [setValue],
  );

  /** 선택한 배송 Info Getting */
  const getSelectedPolicyInfo = useCallback(
    (value: number | string) => deliveryTmplLists.find((list) => list.id === value),
    [deliveryTmplLists],
  );

  /** 배송 정책 Template 변경 (handleChange) */
  const handleChangeTmpl = useCallback(
    (
      evt: React.ChangeEvent<{
        name?: string;
        value: unknown;
        event: Event | React.SyntheticEvent<Element, Event>;
      }>,
    ) => {
      const { value } = evt.target;
      const policyInfo = getSelectedPolicyInfo(value as number);
      changeTmplValues(policyInfo);
      setSelectedPolicyInfo(policyInfo);
    },
    [changeTmplValues, getSelectedPolicyInfo],
  );

  /** 배송 정책 Template Reset */
  const handleResetTmpl = () => {
    setValue('providerShippingId', '');
    /** @issue 220218 배송비 Radio 버튼 이슈로 인한 주석처리, 추후 체크 */
    // setValue('goodsShippingPolicy', null);
    setSelectedPolicyInfo(null);
  };

  /** 배송방법 변경시 */
  const handleShippingMethodChange = useCallback(
    (currentShippingMethod: GoodsShippingMethod) => {
      if (currentShippingMethod === GoodsShippingMethod.DIRECT && watchShippingPolicy === GoodsShippingPolicy.SHOP) {
        dialogOpen({
          title: '배송방법 변경',
          content:
            '직접배송은 "묶음배송적용"에서 개별배송만 선택 가능합니다.\r\n묶음배송적용을 개별배송으로 변경하시겠습니까?',
          type: DialogType.CONFIRM,
          onClose: () => {
            setValue('shippingMethod', GoodsShippingMethod.PARCEL);
            dialogClose();
          },
          onConfirm: () => {
            setValue('shippingPolicy', GoodsShippingPolicy.GOODS);
            setValue('shippingMethod', currentShippingMethod);
            dialogClose();
          },
        });
      } else {
        setValue('shippingMethod', currentShippingMethod);
      }
    },
    [watchShippingPolicy, dialogOpen, dialogClose, setValue],
  );

  /**
   * 상품 수정
   * - 초기 선택한 배송정책(initProviderShippingId)이 있을 경우
   */
  useEffect(() => {
    if (isInitProviderShippingRef.current) {
      return;
    }
    if (initProviderShippingId !== null && !!deliveryTmplLists.length) {
      const policyInfo = getSelectedPolicyInfo(initProviderShippingId);
      if (watchShippingPolicy === GoodsShippingPolicy.SHOP) {
        changeTmplValues(policyInfo);
      }
      setSelectedPolicyInfo(policyInfo);
      setValue('providerShippingId', initProviderShippingId);
      isInitProviderShippingRef.current = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initProviderShippingId, deliveryTmplLists.length]);

  useEffect(() => {
    if (watchDeliveryType !== DeliveryType.TODAY) {
      setValue('deliveryTodayEndTime', '');
    }
    if (watchDeliveryType !== DeliveryType.OTHER) {
      setValue('deliveryTypeOtherDay', 0);
    }
  }, [watchDeliveryType, setValue]);

  useEffect(() => {
    if (watchGoodsShippingPolicy !== DeliveryCostType.UNLIMIT) {
      setValue('unLimitShippingPrice', 0);
    }
    if (watchGoodsShippingPolicy !== DeliveryCostType.IFPAY) {
      setValue('ifpayCost', 0);
      setValue('ifpayFreePrice', 0);
    }
    if (watchGoodsShippingPolicy !== DeliveryCostType.LIMIT) {
      setValue('limitShippingPrice', 0);
      setValue('limitShippingEa', 0);
    }
  }, [watchGoodsShippingPolicy, setValue]);

  useEffect(() => {
    const currentShippingMethod = getValues('shippingMethod');
    if (currentShippingMethod === GoodsShippingMethod.DIRECT && watchShippingPolicy === GoodsShippingPolicy.SHOP) {
      toast.error('직접배송방법은 개별배송만 선택 가능합니다.');
      setValue('shippingPolicy', GoodsShippingPolicy.GOODS);
    }
  }, [watchShippingPolicy, setValue, getValues]);

  useEffect(() => {
    /**
     * 상품 관리 내 배송유형 Display 오류 해결 (#FE-1629)
     * @todo 등록시에만 적용되게 설정
     */
    if (!isInitSelectGoodsKindRef.current) {
      isInitSelectGoodsKindRef.current = true;
      return;
    }
    if (selectedGoodsKind !== GoodsKind.REAL) {
      setValue('shippingMethod', GoodsShippingMethod.MOBILE);
      setValue('deliveryType', DeliveryType.TODAY);
      setValue('shippingPolicy', GoodsShippingPolicy.GOODS);
    } else {
      setValue('shippingMethod', GoodsShippingMethod.PARCEL);
      setValue('deliveryType', DeliveryType.TODAY);
      setValue('shippingPolicy', GoodsShippingPolicy.SHOP);
      setValue('deliveryTodayEndTime', '');
      setValue('deliveryTypeOtherDay', 0);
    }
  }, [selectedGoodsKind, setValue]);

  return {
    selectedPolicyInfo,
    watchDeliveryType,
    deliveryTmplOptions,
    isShippingPolicyShop: watchShippingPolicy === GoodsShippingPolicy.SHOP,
    handleChangeTmpl,
    handleResetTmpl,
    handleShippingMethodChange,
  };
};
