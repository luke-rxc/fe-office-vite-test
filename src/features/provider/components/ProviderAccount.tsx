import { useCallback, useEffect, useState } from 'react';
import type { VFC } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import {
  TextField,
  Button,
  RadioGroup,
  FormControlLabel,
  Radio,
  List,
  Box,
  FormHelperText,
  InputAdornment,
} from '@material-ui/core';
import { Autocomplete } from '@components/Autocomplete';
import { FileUploader } from '@components/uploader/FileUploader';
import { UploadMediaWithAction } from '@components/uploader/UploadMediaWithAction';
import { UploadFileInfo } from '@models/UploadModel';
import { useFileUploader, UploadDomainType } from '@services/useFileUploader';
import { BankItemModel, ProviderDetailFormFieldModel } from '../models';
import { FormControlTextField } from './form';
import { ListItemWrapper } from './Styled';

/**
 * 입점사 정산
 */
type ProviderAccountProps = {
  bankList: BankItemModel[];
};
export const ProviderAccount: VFC<ProviderAccountProps> = ({ bankList = [] }) => {
  const { control, setValue, getValues, formState } = useFormContext();
  const accountImage = getValues('accountImage');
  const [bank, setBank] = useState<BankItemModel>(getValues('bank'));

  const {
    fileInfos,
    handleUpdateFileInfo,
    handleUpload,
    handleRemove: onRemoveImage,
  } = useFileUploader({
    domainType: UploadDomainType.PROVIDER,
    initFileInfos: accountImage?.path ? [{ path: accountImage.path, extension: accountImage.extension }] : [],
  });
  const [accountImageError, setAccountImageError] = useState(null);

  /**
   * 파일 변경
   */
  const handleChange = async (uploadFilesInfo: UploadFileInfo[]) => {
    try {
      const uploadedFileInfo = await handleUpload(uploadFilesInfo);
      handleUpdateFileInfo(uploadedFileInfo);
      const [uploadedImage] = uploadedFileInfo;
      if (uploadedImage) {
        const targetId = uploadedImage.id;
        setValue('accountImage', null);
        setValue('accountImageId', targetId);
        setAccountImageError(null);
      }
    } catch (e) {}
  };

  /**
   * 이미지 삭제
   */
  const handleRemove = useCallback(
    (idx) => {
      onRemoveImage(idx);
      setValue('accountImage', null);
      setValue('accountImageId', null);
    },
    [onRemoveImage, setValue],
  );

  useEffect(() => {
    if (bankList.length > 0 && bank) {
      const targetBank = bankList.find((bankItem) => bankItem.code === bank.code);
      if (targetBank) {
        setBank(targetBank);
        setValue('bank', targetBank);
      }
    }
  }, [bankList, bank, setValue]);

  useEffect(() => {
    if (accountImage?.id) {
      setValue('accountImageId', accountImage.id);
    }
  }, [accountImage?.id, setValue]);

  useEffect(() => {
    setAccountImageError(formState.errors?.accountImageId);
  }, [formState.errors]);

  return (
    <>
      <List sx={{ display: 'flex', flexWrap: 'wrap' }}>
        <ListItemWrapper listTitleName="입점사 수수료" isRequired sx={{ width: '50%' }}>
          <Box sx={{ width: '100%' }}>
            <FormControlTextField<ProviderDetailFormFieldModel>
              name="commissionRate"
              label="수수료"
              sx={{ width: '50%' }}
              type="number"
              InputProps={{
                inputMode: 'numeric',
                endAdornment: <InputAdornment position="end">%</InputAdornment>,
              }}
              rules={{
                max: { value: 100, message: '수수료는 값이 100을 넘을수 없습니다.' },
                pattern: { value: /^[0-9]{1,3}$/, message: '숫자만 입력하세요' },
              }}
            />
          </Box>
        </ListItemWrapper>
        <ListItemWrapper listTitleName="정산방식" isRequired sx={{ width: '50%' }}>
          <Box sx={{ width: '100%' }}>
            <Controller
              control={control}
              name="calculateCount"
              render={({ field: { onChange, value } }) => (
                <RadioGroup onChange={onChange} row value={value}>
                  <FormControlLabel control={<Radio />} label="월 1회 정산" value="1" />
                  <FormControlLabel control={<Radio />} label="월 2회 정산" value="2" />
                </RadioGroup>
              )}
            />
          </Box>
        </ListItemWrapper>
        <ListItemWrapper listTitleName="입금은행" isRequired sx={{ width: '50%' }}>
          <Box sx={{ width: '100%' }}>
            <Controller
              control={control}
              defaultValue={bank}
              name="bank"
              render={({ field: { onChange, value }, fieldState: { error } }) => (
                <Autocomplete
                  filterSelectedOptions={false}
                  onChange={(option) => {
                    onChange(option);
                  }}
                  options={bankList}
                  renderInput={(props) => (
                    <TextField error={!!error} helperText={error?.message} label="입금은행" {...props} />
                  )}
                  value={value}
                />
              )}
            />
          </Box>
        </ListItemWrapper>
        <ListItemWrapper listTitleName="세금계산서수령 E-mail" isRequired sx={{ width: '50%' }}>
          <Box sx={{ width: '100%' }}>
            <FormControlTextField<ProviderDetailFormFieldModel>
              name="accountEmail"
              label="세금계산서수령 E-mail"
              sx={{ width: '100%' }}
            />
          </Box>
        </ListItemWrapper>
        <ListItemWrapper listTitleName="예금주명" isRequired sx={{ width: '50%' }}>
          <Box sx={{ width: '100%' }}>
            <FormControlTextField<ProviderDetailFormFieldModel>
              name="depositor"
              label="예금주명"
              sx={{ width: '100%' }}
            />
          </Box>
        </ListItemWrapper>
        <ListItemWrapper listTitleName="계좌번호" isRequired sx={{ width: '50%' }}>
          <Box sx={{ width: '100%' }}>
            <FormControlTextField<ProviderDetailFormFieldModel>
              name="accountNumber"
              label="계좌번호"
              sx={{ width: '100%' }}
            />
          </Box>
        </ListItemWrapper>
        <ListItemWrapper listTitleName="통장 사본" isRequired sx={{ width: '50%' }}>
          <Box sx={{ width: '100%' }}>
            {!fileInfos.length && (
              <FileUploader
                accept="image/*, application/pdf, text/plain"
                width={90}
                height={36}
                fileInfos={fileInfos}
                multiple={false}
                maxFiles={1}
                onChange={handleChange}
                render={() => <Button variant="outlined">UPLOAD</Button>}
                sx={{
                  p: 0,
                  border: 'none',
                  '&:hover': {},
                }}
              />
            )}
            <Box display="flex" flexDirection="row" flexWrap="wrap">
              {fileInfos &&
                fileInfos.map((fileInfo, index) => (
                  <UploadMediaWithAction
                    key={`file-${index}`}
                    fileInfo={fileInfo}
                    onDelete={() => handleRemove(index)}
                    width={fileInfo.fileType === 'ETC' ? 300 : 200}
                    height={fileInfo.fileType === 'ETC' ? 300 : 200}
                  />
                ))}
            </Box>
            {accountImageError && (
              <Box sx={{ mt: 1 }}>
                <FormHelperText error>{accountImageError?.message}</FormHelperText>
              </Box>
            )}
          </Box>
        </ListItemWrapper>
      </List>
    </>
  );
};
