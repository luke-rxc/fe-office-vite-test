import type { VFC } from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { List, Box, TextField, Divider, Grid, RadioGroup, FormControlLabel, Radio } from '@material-ui/core';
import { Autocomplete } from '@components/Autocomplete';
import { Address, AddressModel } from '@components/address/Address';
import { ShippingCostType, ShippingType } from '../constants';
import { SelectTypeModel, ShippingDetailFieldModel } from '../models';
import { FormControlTextField } from './form';
import { ListItemWrapper } from './Styled';

/**
 * 배송지 상세 폼
 */
type ProviderShippingDetailFormProps = {
  deliveryCompanyList: SelectTypeModel[];
};
export const ProviderShippingDetailForm: VFC<ProviderShippingDetailFormProps> = ({ deliveryCompanyList }) => {
  const { control, setValue, getValues, watch } = useFormContext();
  const sendingAddress = getValues('sendingAddress');
  const returnAddress = getValues('returnAddress');
  const [shippingCostType, useExtraAddCosts, shippingType] = watch([
    'shippingCostType',
    'useExtraAddCosts',
    'shippingType',
  ]);

  return (
    <List sx={{ display: 'flex', flexWrap: 'wrap' }}>
      <ListItemWrapper listTitleName="배송정책명" isRequired sx={{ width: '100%', alignItems: 'flex-start' }}>
        <Box sx={{ width: '100%' }}>
          <FormControlTextField<ShippingDetailFieldModel>
            name="shippingName"
            label="배송정책명"
            sx={{ width: '100%' }}
          />
        </Box>
      </ListItemWrapper>
      <Divider sx={{ width: '100%', mt: 3, mb: 3 }} />
      <ListItemWrapper listTitleName="배송방법" isRequired sx={{ width: '100%', alignItems: 'flex-start' }}>
        <Box sx={{ width: '100%' }}>
          <Grid container>
            <Grid item xs={3}>
              <Controller
                control={control}
                name="shippingType"
                render={({ field: { onChange, value } }) => (
                  <RadioGroup
                    onChange={(_, value: string) => {
                      if (value === ShippingType.DIRECT) {
                        // 직접배송으로 변경되는 경우, 배송비 무료로 설정
                        setValue('shippingCostType', ShippingCostType.FREE);
                        setValue('payCost', 0);
                        setValue('ifpayCost', 0);
                        setValue('ifpayFreePrice', 0);
                      }
                      onChange(value);
                    }}
                    row
                    value={value}
                    sx={{ flexDirection: 'column' }}
                  >
                    <FormControlLabel control={<Radio />} label="택배" value={ShippingType.COMPANY} sx={{ mb: 3 }} />
                    <FormControlLabel control={<Radio />} label="직접배송" value={ShippingType.DIRECT} sx={{ mb: 3 }} />
                  </RadioGroup>
                )}
              />
            </Grid>
            <Grid container item xs={9}>
              <Grid item xs={12}>
                <Controller
                  control={control}
                  name="shippingCompany"
                  render={({ field: { onChange, value }, fieldState: { error } }) => (
                    <Autocomplete
                      filterSelectedOptions={false}
                      disabled={shippingType !== ShippingType.COMPANY}
                      onChange={(option) => {
                        onChange(option);
                      }}
                      options={deliveryCompanyList}
                      renderInput={(props) => (
                        <TextField error={!!error} helperText={error?.message} label="택배사" {...props} />
                      )}
                      value={value}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sx={{ minHeight: 70 }}></Grid>
            </Grid>
          </Grid>
        </Box>
      </ListItemWrapper>
      <Divider sx={{ width: '100%', mt: 3, mb: 3 }} />
      <ListItemWrapper listTitleName="배송비설정" isRequired sx={{ width: '100%', alignItems: 'flex-start' }}>
        <Box sx={{ width: '100%' }}>
          <Grid container>
            <Grid item xs={3}>
              <Controller
                control={control}
                name="shippingCostType"
                render={({ field: { onChange, value } }) => (
                  <RadioGroup
                    onChange={(_, value: string) => {
                      setValue('payCost', 0);
                      setValue('ifpayCost', 0);
                      setValue('ifpayFreePrice', 0);
                      onChange(value);
                    }}
                    row
                    value={value}
                    sx={{ flexDirection: 'column' }}
                  >
                    <FormControlLabel control={<Radio />} label="유료" value={ShippingCostType.PAY} sx={{ mb: 3 }} />
                    <FormControlLabel control={<Radio />} label="무료" value={ShippingCostType.FREE} sx={{ mb: 3 }} />
                    <FormControlLabel
                      control={<Radio />}
                      label="조건부무료"
                      value={ShippingCostType.IFPAY}
                      sx={{ mb: 3 }}
                    />
                  </RadioGroup>
                )}
              />
            </Grid>
            <Grid container item xs={9}>
              <Grid
                item
                xs={12}
                sx={{
                  minHeight: 70,
                  color: `${shippingCostType !== ShippingCostType.PAY ? '#d4d4d4' : ''}`,
                  alignItems: 'center',
                  display: 'flex',
                }}
              >
                <FormControlTextField<ShippingDetailFieldModel>
                  name="payCost"
                  label="유료 배송비"
                  sx={{ width: '50%' }}
                  disabled={shippingCostType !== ShippingCostType.PAY}
                  type="number"
                  inputProps={{
                    inputMode: 'numeric',
                    step: '1',
                  }}
                  rules={{
                    pattern: { value: /^[0-9]{1,3}$/, message: '숫자만 입력하세요' },
                  }}
                />
                <Box component="span" sx={{ ml: 1 }}>
                  원
                </Box>
              </Grid>
              <Grid item xs={12} sx={{ minHeight: 70 }}></Grid>
              <Grid
                item
                xs={12}
                sx={{ minHeight: 70, color: `${shippingCostType !== ShippingCostType.IFPAY ? '#d4d4d4' : ''}` }}
              >
                <Grid item xs={12} sx={{ alignItems: 'center', display: 'flex' }}>
                  <span style={{ display: 'inline-block', width: 80 }}>기본배송비</span>
                  <FormControlTextField<ShippingDetailFieldModel>
                    name="ifpayCost"
                    label="기본 배송비"
                    disabled={shippingCostType !== ShippingCostType.IFPAY}
                    sx={{ width: '50%' }}
                    type="number"
                    inputProps={{
                      inputMode: 'numeric',
                      step: '1',
                    }}
                    rules={{
                      pattern: { value: /^[0-9]{1,3}$/, message: '숫자만 입력하세요' },
                    }}
                  />
                  <Box component="span" sx={{ ml: 1 }}>
                    원
                  </Box>
                </Grid>
                <Grid item xs={12} sx={{ mt: 3, alignItems: 'center', display: 'flex' }}>
                  <span style={{ display: 'inline-block', width: 80 }}>조건 금액</span>
                  <FormControlTextField<ShippingDetailFieldModel>
                    name="ifpayFreePrice"
                    label="조건 금액"
                    disabled={shippingCostType !== ShippingCostType.IFPAY}
                    sx={{ width: '50%' }}
                    type="number"
                    inputProps={{
                      inputMode: 'numeric',
                      step: '1',
                    }}
                    rules={{
                      pattern: { value: /^[0-9]{1,3}$/, message: '숫자만 입력하세요' },
                    }}
                  />
                  <Box component="span" sx={{ ml: 1 }}>
                    원 이상 구매시 무료
                  </Box>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </ListItemWrapper>
      <Divider sx={{ width: '100%', mt: 3, mb: 3 }} />
      <ListItemWrapper
        listTitleName={
          <>
            제주/도서산간배송비 설정
            <br />
            <Link to="/provider/shipCountry" target="_blank" style={{ color: '#676767', fontSize: 12 }}>
              (제주/도서산간 지역보기)
            </Link>
          </>
        }
        isRequired
        sx={{ width: '100%', alignItems: 'flex-start' }}
      >
        <Box sx={{ width: '100%' }}>
          <Grid item xs={12}>
            <Controller
              control={control}
              name="useExtraAddCosts"
              render={({ field: { onChange, value } }) => (
                <RadioGroup
                  onChange={(_, value: string) => {
                    if (value === 'F') {
                      setValue('jejuAddCost', 0);
                      setValue('etcAddCost', 0);
                    }
                    onChange(value);
                  }}
                  row
                  value={value}
                >
                  <FormControlLabel control={<Radio />} label="사용" value="T" />
                  <FormControlLabel control={<Radio />} label="미사용" value="F" />
                </RadioGroup>
              )}
            />
          </Grid>
          <Grid item xs={12} sx={{ color: `${useExtraAddCosts !== 'T' ? '#d4d4d4' : ''}` }}>
            <Grid item xs={12} sx={{ mt: 3, alignItems: 'center', display: 'flex' }}>
              <span style={{ display: 'inline-block', width: 130 }}>제주도</span>
              <FormControlTextField<ShippingDetailFieldModel>
                name="jejuAddCost"
                label="제주도"
                disabled={useExtraAddCosts !== 'T'}
                sx={{ width: '50%' }}
                type="number"
                inputProps={{
                  inputMode: 'numeric',
                  step: '1',
                }}
                rules={{
                  pattern: { value: /^[0-9]{1,3}$/, message: '숫자만 입력하세요' },
                }}
              />
              <Box component="span" sx={{ ml: 1 }}>
                원
              </Box>
            </Grid>
            <Grid item xs={12} sx={{ mt: 3, alignItems: 'center', display: 'flex' }}>
              <span style={{ display: 'inline-block', width: 130 }}>그외 도서산간</span>
              <FormControlTextField<ShippingDetailFieldModel>
                name="etcAddCost"
                label="그외 도서산간"
                disabled={useExtraAddCosts !== 'T'}
                sx={{ width: '50%' }}
                type="number"
                inputProps={{
                  inputMode: 'numeric',
                  step: '1',
                }}
                rules={{
                  pattern: { value: /^[0-9]{1,3}$/, message: '숫자만 입력하세요' },
                }}
              />
              <Box component="span" sx={{ ml: 1 }}>
                원
              </Box>
            </Grid>
          </Grid>
        </Box>
      </ListItemWrapper>
      <Divider sx={{ width: '100%', mt: 3, mb: 3 }} />
      <ListItemWrapper listTitleName="반품/교환 배송비(편도)" isRequired sx={{ width: '100%' }}>
        <Box sx={{ width: '100%', alignItems: 'center', display: 'flex' }}>
          <FormControlTextField<ShippingDetailFieldModel>
            name="returnCost"
            label="반품/교환 배송비(편도)"
            sx={{ width: '50%' }}
            type="number"
            inputProps={{
              inputMode: 'numeric',
              step: '1',
            }}
            rules={{
              pattern: { value: /^[0-9]{1,3}$/, message: '숫자만 입력하세요' },
            }}
          />
          <Box component="span" sx={{ ml: 1 }}>
            원
          </Box>
        </Box>
      </ListItemWrapper>
      <Divider sx={{ width: '100%', mt: 3, mb: 3 }} />
      <ListItemWrapper listTitleName="출고지 주소" isRequired sx={{ width: '100%', alignItems: 'flex-start' }}>
        <Box sx={{ width: '100%' }}>
          <Controller
            name="sendingAddress"
            control={control}
            render={({ field: { onChange }, formState: { errors } }) => {
              const { sendingAddress: addr } = errors;
              return (
                <>
                  <Address
                    address={sendingAddress?.address}
                    addressDetail={sendingAddress?.addressDetail}
                    postCode={sendingAddress?.postCode}
                    error={{
                      postCode: !!addr?.postCode,
                      address: !!addr?.address,
                      addressDetail: !!addr?.addressDetail,
                    }}
                    onChange={(address: AddressModel) => {
                      onChange({ ...address });
                    }}
                  />
                </>
              );
            }}
          />
        </Box>
      </ListItemWrapper>
      <Divider sx={{ width: '100%', mt: 3, mb: 3 }} />
      <ListItemWrapper listTitleName="반품/교환지 주소" isRequired sx={{ width: '100%', alignItems: 'flex-start' }}>
        <Box sx={{ width: '100%' }}>
          <Controller
            name="returnAddress"
            control={control}
            render={({ field: { onChange }, formState: { errors } }) => {
              const { returnAddress: addr } = errors;
              return (
                <>
                  <Address
                    address={returnAddress?.address}
                    addressDetail={returnAddress?.addressDetail}
                    postCode={returnAddress?.postCode}
                    error={{
                      postCode: !!addr?.postCode,
                      address: !!addr?.address,
                      addressDetail: !!addr?.addressDetail,
                    }}
                    onChange={(address: AddressModel) => {
                      onChange({ ...address });
                    }}
                  />
                </>
              );
            }}
          />
        </Box>
      </ListItemWrapper>
      <ListItemWrapper listTitleName="반품/교환 연락처" isRequired sx={{ width: '100%', alignItems: 'flex-start' }}>
        <Box sx={{ width: '100%' }}>
          <FormControlTextField<ShippingDetailFieldModel>
            name="returnPhone"
            label="반품/교환 연락처"
            placeholder="000-0000-0000"
            sx={{ width: '100%' }}
          />
        </Box>
      </ListItemWrapper>
    </List>
  );
};
