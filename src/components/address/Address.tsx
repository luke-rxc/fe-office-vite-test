/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react';
import type { VFC } from 'react';
import DaumPostCode from 'react-daum-postcode'; // TODO: API 로 처리 후 삭제 예정
import { TextField, Button, Grid } from '@material-ui/core';
import { Modal } from '@components/Modal';

export interface AddressModel {
  postCode: string; // 우편번호
  address: string; // 주소
  addressDetail: string; // 상세 주소
}

interface AddressProps {
  address?: string;
  addressDetail?: string;
  postCode?: string;
  error?: {
    postCode: boolean;
    address: boolean;
    addressDetail: boolean;
  };
  onChange: (data: AddressModel) => void;
}
export const Address: VFC<AddressProps> = ({ address, addressDetail, postCode, error, onChange }) => {
  const [showSearchField, setShowSearchField] = useState(false);
  const [addressData, setAddressData] = useState<AddressModel>({
    postCode: postCode || '',
    address: address || '',
    addressDetail: addressDetail || '',
  });

  useEffect(() => {
    onChange(addressData);
  }, [addressData]);

  const handleComplete = (data: any) => {
    // TODO: interface 처리
    setAddressData((prev: AddressModel) => ({
      ...prev,
      postCode: data.zonecode,
      address: data.address,
      addressDetail: '',
    }));
    setShowSearchField(false);
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} display="flex" justifyContent="flex-start" alignItems="center">
        <TextField
          error={error?.postCode}
          helperText={error?.postCode && '우편번호를 입력 해 주세요.'}
          InputProps={{
            readOnly: true,
          }}
          label="우편번호"
          sx={{ maxWidth: 200 }}
          value={addressData.postCode}
        />
        <Button onClick={() => setShowSearchField(true)} sx={{ ml: 2 }} variant="outlined">
          우편번호 검색
        </Button>
      </Grid>
      <Grid item xs={12}>
        <TextField
          error={error?.address}
          helperText={error?.address && '주소를 입력 해 주세요.'}
          InputProps={{
            readOnly: true,
          }}
          label="주소"
          sx={{ width: '100%' }}
          value={addressData.address}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          error={error?.addressDetail}
          helperText={error?.addressDetail && '상세 주소를 입력 해 주세요.'}
          label="상세 주소"
          onChange={(e) => {
            const { value } = e.target;
            setAddressData((prev: AddressModel) => ({
              ...prev,
              addressDetail: value,
            }));
          }}
          sx={{ width: '100%' }}
          value={addressData.addressDetail}
        />
      </Grid>
      {showSearchField && (
        <Modal open={true} width={500} height={500} onClose={() => setShowSearchField(false)}>
          <DaumPostCode onComplete={handleComplete} />
        </Modal>
      )}
    </Grid>
  );
};
