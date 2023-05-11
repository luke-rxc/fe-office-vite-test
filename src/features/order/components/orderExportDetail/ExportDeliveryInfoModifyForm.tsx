import { FormControlAutoComplete, FormControlTextField } from '@components/form';
import { ComboDeliveryCompanyModel } from '@features/order/models';
import { ReturnTypeUseOrderDeliveryModifyService } from '@features/order/services';
import { OrderExportDeliveryInfoFormField } from '@features/order/types';
import { FormLayout } from './FormLayout';

interface Props {
  deliveryCompanies: ReturnTypeUseOrderDeliveryModifyService['deliveryCompanies'];
}

/**
 * 래플 이벤트 생성 form component
 */
export const ExportDeliveryInfoModifyForm = ({ deliveryCompanies }: Props) => {
  return (
    <>
      <FormLayout label="택배사선택" required>
        <FormControlAutoComplete<OrderExportDeliveryInfoFormField>
          name="deliveryCompany"
          options={deliveryCompanies}
          getOptionLabel={({ label, value }: ComboDeliveryCompanyModel) => `${label} (${value})`}
          isOptionEqualToValue={(v: ComboDeliveryCompanyModel, o: ComboDeliveryCompanyModel) => v?.value === o?.value}
          placeholder="택배사 선택"
          rules={{ required: '택배사를 선택하세요.' }}
          sx={{ width: '340px' }}
        />
      </FormLayout>
      <FormLayout label="운송장번호" required>
        <FormControlTextField<OrderExportDeliveryInfoFormField>
          name="deliveryNumber"
          maxLength={20}
          showLength
          rules={{
            required: '운송장번호를 입력하세요',
            maxLength: { message: '최대 20자까지 가능합니다.', value: 20 },
          }}
          sx={{ width: '340px' }}
        />
      </FormLayout>
    </>
  );
};
