import { useEffect, useCallback, useState } from 'react';
import type { VFC } from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { Typography, Button, List, Box, FormHelperText } from '@material-ui/core';
import { Address, AddressModel } from '@components/address/Address';
import { FileUploader } from '@components/uploader/FileUploader';
import { UploadMediaWithAction } from '@components/uploader/UploadMediaWithAction';
import { UploadFileInfo } from '@models/UploadModel';
import { useFileUploader, UploadDomainType } from '@services/useFileUploader';
import { ProviderDetailFormFieldModel } from '../models';
import { BUSINESS_TYPE_LABEL } from '../constants';
import { FormControlTextField } from './form';
import { ListItemWrapper } from './Styled';

/**
 * 입점사 기본정보
 */
type ProviderDefaultProps = {};
export const ProviderDefault: VFC<ProviderDefaultProps> = () => {
  const { control, setValue, getValues, formState } = useFormContext();
  const businessNumberImage = getValues('businessNumberImage');
  // const name = getValues('name');
  const businessType = getValues('businessType');
  const businessNumber = getValues('businessNumber');
  const companyAddress = getValues('companyAddress');
  const {
    fileInfos,
    handleUpdateFileInfo,
    handleUpload,
    handleRemove: onRemoveImage,
  } = useFileUploader({
    domainType: UploadDomainType.PROVIDER,
    initFileInfos: businessNumberImage?.path
      ? [{ path: businessNumberImage.path, extension: businessNumberImage.extension }]
      : [],
  });
  const [businessNumberImageError, setBusinessNumberImageError] = useState(null);

  const handleChange = async (uploadFilesInfo: UploadFileInfo[]) => {
    try {
      const uploadedFileInfo = await handleUpload(uploadFilesInfo);
      handleUpdateFileInfo(uploadedFileInfo);
      const [uploadedImage] = uploadedFileInfo;
      if (uploadedImage) {
        const targetId = uploadedImage.id;
        setValue('businessNumberImage', null);
        setValue('businessNumberImageId', targetId);
        setBusinessNumberImageError(null);
      }
    } catch (e) {}
  };

  /**
   * 이미지 삭제
   */
  const handleRemove = useCallback(
    (idx) => {
      onRemoveImage(idx);
      setValue('businessNumberImage', null);
      setValue('businessNumberImageId', null);
    },
    [onRemoveImage, setValue],
  );

  useEffect(() => {
    if (businessNumberImage?.id) {
      setValue('businessNumberImageId', businessNumberImage.id);
    }
  }, [businessNumberImage?.id, setValue]);

  useEffect(() => {
    setBusinessNumberImageError(formState.errors?.businessNumberImageId);
  }, [formState.errors]);

  return (
    <>
      <List sx={{ display: 'flex', flexWrap: 'wrap' }}>
        <ListItemWrapper listTitleName="입점사명" isRequired sx={{ width: '50%' }}>
          <Box sx={{ width: '100%' }}>
            <FormControlTextField<ProviderDetailFormFieldModel> name="name" label="입점사명" sx={{ width: '100%' }} />
          </Box>
        </ListItemWrapper>
        <ListItemWrapper listTitleName="사업자유형" isRequired sx={{ width: '50%' }}>
          <Box sx={{ width: '100%' }}>
            <Typography>{BUSINESS_TYPE_LABEL[businessType]}</Typography>
          </Box>
        </ListItemWrapper>
        <ListItemWrapper listTitleName="사업자번호" isRequired sx={{ width: '50%' }}>
          <Box sx={{ width: '100%' }}>
            <Typography>{businessNumber}</Typography>
          </Box>
        </ListItemWrapper>
        <ListItemWrapper listTitleName="업태/종목" isRequired sx={{ width: '50%' }}>
          <Box sx={{ width: '100%', display: 'flex', alignItems: 'center' }}>
            <FormControlTextField<ProviderDetailFormFieldModel>
              name="businessCondition"
              label="업태"
              sx={{ width: '46%' }}
            />
            <Box component="div" sx={{ ml: 1, mr: 1 }}>
              /
            </Box>
            <FormControlTextField<ProviderDetailFormFieldModel>
              name="businessCategory"
              label="종목"
              sx={{ width: '46%' }}
            />
          </Box>
        </ListItemWrapper>
        <ListItemWrapper listTitleName="사업자 소재지" isRequired sx={{ width: '50%', alignItems: 'flex-start' }}>
          <Box sx={{ width: '100%' }}>
            <Controller
              name="companyAddress"
              control={control}
              render={({ field: { onChange }, formState: { errors } }) => {
                const { companyAddress: addr } = errors;
                return (
                  <>
                    <Address
                      address={companyAddress?.address}
                      addressDetail={companyAddress?.addressDetail}
                      postCode={companyAddress?.postCode}
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
        <ListItemWrapper listTitleName="통신판매업 신고번호" isRequired sx={{ width: '50%', alignItems: 'flex-start' }}>
          <Box sx={{ width: '100%' }}>
            <FormControlTextField<ProviderDetailFormFieldModel>
              name="mailOrderSalesNumber"
              label="통신판매업 신고번호"
              sx={{ width: '100%' }}
            />
          </Box>
        </ListItemWrapper>
        <ListItemWrapper listTitleName="대표자명" isRequired sx={{ width: '50%' }}>
          <Box sx={{ width: '100%' }}>
            <FormControlTextField<ProviderDetailFormFieldModel>
              name="presidentName"
              label="대표자명"
              sx={{ width: '100%' }}
            />
          </Box>
        </ListItemWrapper>
        <ListItemWrapper listTitleName="대표번호" sx={{ width: '50%' }}>
          <Box sx={{ width: '100%' }}>
            <FormControlTextField<ProviderDetailFormFieldModel>
              name="phoneNumber"
              label="대표번호"
              sx={{ width: '100%' }}
            />
          </Box>
        </ListItemWrapper>
        <ListItemWrapper listTitleName="대표이메일" isRequired sx={{ width: '50%' }}>
          <Box sx={{ width: '100%' }}>
            <FormControlTextField<ProviderDetailFormFieldModel>
              name="companyEmail"
              label="대표이메일"
              sx={{ width: '100%' }}
            />
          </Box>
        </ListItemWrapper>
        <ListItemWrapper listTitleName="홈페이지 URL" sx={{ width: '50%' }}>
          <Box sx={{ width: '100%' }}>
            <FormControlTextField<ProviderDetailFormFieldModel>
              name="homepageUrl"
              label="홈페이지 URL"
              sx={{ width: '100%' }}
            />
          </Box>
        </ListItemWrapper>
        <ListItemWrapper listTitleName="사업자 사본" isRequired sx={{ width: '50%' }}>
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
            {businessNumberImageError && (
              <Box sx={{ mt: 1 }}>
                <FormHelperText error>{businessNumberImageError?.message}</FormHelperText>
              </Box>
            )}
          </Box>
        </ListItemWrapper>
      </List>
    </>
  );
};
