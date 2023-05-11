import { useRef } from 'react';
import type { VFC } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { yupResolver } from '@hookform/resolvers/yup';
import { Paper } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import SaveIcon from '@material-ui/icons/Save';
import { Modal } from '@components/Modal';
import { ShippingCostType, ShippingType, ShippingDirect } from '../constants';
import { SelectTypeModel, ShippingDetailFieldModel, ShippingDetailModel } from '../models';
import { getActiveSelect, validationShippingRegisterForm } from '../utils';
import { ProviderShippingDetailForm } from './ProviderShippingDetailForm';

/**
 * 배송지 상세 등록/수정
 */
type ProviderShippingDetailProps = {
  onSubmit: (formData: ShippingDetailFieldModel) => void;
  onCancel: () => void;
  shippingData?: ShippingDetailModel;
  deliveryCompanyList: SelectTypeModel[];
};
export const ProviderShippingDetail: VFC<ProviderShippingDetailProps> = ({
  shippingData,
  deliveryCompanyList,
  onSubmit,
  onCancel,
}) => {
  const delivery: SelectTypeModel = getActiveSelect(shippingData?.deliveryName, deliveryCompanyList, 'label');
  const { name, extraAddCosts, shippingPolicy, returnAddress, sendingAddress, returnCost } = shippingData ?? {
    name: '',
    extraAddCosts: [],
    shippingPolicy: {
      costType: ShippingCostType.PAY,
      payCost: 0,
      ifpayFreePrice: 0,
      ifpayCost: 0,
    },
    returnAddress: {
      postCode: '',
      address: '',
      addressDetail: '',
      phoneNumber: '',
    },
    sendingAddress: {
      postCode: '',
      address: '',
      addressDetail: '',
    },
    returnCost: 0,
  };

  const formDefaultValue: ShippingDetailFieldModel = {
    shippingId: shippingData?.id,
    shippingName: name,
    shippingCompany: delivery ?? null,
    shippingType: shippingData?.deliveryName === ShippingDirect.label ? ShippingType.DIRECT : ShippingType.COMPANY,
    shippingCostType: shippingPolicy?.costType ?? null,
    payCost: shippingPolicy.payCost,
    ifpayCost: shippingPolicy.ifpayCost,
    ifpayFreePrice: shippingPolicy.ifpayFreePrice,
    useExtraAddCosts: extraAddCosts.filter((item) => item.price !== 0).length > 0 ? 'T' : 'F',
    jejuAddCost: extraAddCosts.find((item) => item.region.toUpperCase() === 'JEJU')?.price ?? 0,
    etcAddCost: extraAddCosts.find((item) => item.region.toUpperCase() === 'ETC')?.price ?? 0,
    returnCost,
    sendingAddress: sendingAddress ?? null,
    returnAddress: returnAddress ?? null,
    returnPhone: returnAddress.phoneNumber ?? '',
  };

  const formMethods = useForm<ShippingDetailFieldModel>({
    resolver: yupResolver(validationShippingRegisterForm),
    defaultValues: formDefaultValue,
  });
  const { handleSubmit } = formMethods;
  const formEl = useRef(null);
  const handleFormValid = (e) => {
    e.preventDefault();
    handleSubmit(onSubmit, () => {
      toast.error('배송정보 입력 항목을 확인해 주세요.');
    })();
  };

  return (
    <>
      <Modal
        title={`배송 정보 ${shippingData ? '수정' : '등록'}`}
        open={true}
        width={1000}
        maxWidth="initial"
        cancelText={
          <>
            <CloseIcon />
            &nbsp;취소
          </>
        }
        confirmText={
          <>
            <SaveIcon />
            &nbsp;저장
          </>
        }
        onConfirm={(e) => {
          e.preventDefault();
          e.stopPropagation();
          formEl.current.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
        }}
        onCancel={onCancel}
        onClose={onCancel}
      >
        <FormProvider {...formMethods}>
          <form ref={formEl} onSubmit={handleFormValid}>
            <Paper elevation={0}>
              <ProviderShippingDetailForm deliveryCompanyList={deliveryCompanyList} />
            </Paper>
          </form>
        </FormProvider>
      </Modal>
    </>
  );
};
