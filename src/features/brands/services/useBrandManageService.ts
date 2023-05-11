import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { UploadFileInfo } from '@models/UploadModel';
import { useFileUploader, UploadDomainType } from '@services/useFileUploader';
import { ComboType } from '../constants/common';
import type { ComboSchema } from '../schemas';
import type { BrandDetailForm } from '../types';
import { BrandDetailModel } from '../models';
import { useBrandCreateService, useBrandUpdateService, useBrandDetailService, useComboBoxService } from '.';

// 기본 Form Values
const defaultValues = {
  providerItem: null,
  mdItem: null,
  amdItem: null,
  goodsCnt: 0,
  name: '',
  subName: '',
  description: '',
  primaryImageFileId: '',
  commissionRate: null,
};

export const useBrandManageService = (open: boolean, brandId: number) => {
  const { brandInfo, brandInfoRefetch } = useBrandDetailService(brandId);
  const form = useForm<BrandDetailForm>({ defaultValues });

  useEffect(() => {
    open ? resetForm(brandInfo) : resetForm();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, brandInfo]);

  /**
   * Form 초기화
   */
  const resetForm = (data?: BrandDetailModel) => {
    form.reset({
      providerItem: data?.providerItem || null,
      mdItem: data?.mdItem || null,
      amdItem: data?.amdItem || null,
      goodsCnt: data?.goodsCnt || 0,
      name: data?.name || '',
      subName: data?.subName || '',
      description: data?.description || '',
      primaryImageFileId: data?.image?.id || '',
      commissionRate: data?.commissionRate || null,
    });

    data?.image
      ? upload.handleUpdateFileInfo([{ ...data.image, path: data.image.path }], true)
      : upload.handleRemoveAll();
  };

  /**
   * 입점사 콤보 박스
   */
  // const comboBoxProvider = useComboBoxProviderService();
  const comboBoxProvider = useComboBoxService(ComboType.PROVIDER);
  const comboBoxMd = useComboBoxService(ComboType.MD);
  const comboBoxAmd = useComboBoxService(ComboType.GOODS_MANAGER);

  const handleChangeComboProvider = (event: React.SyntheticEvent<Element, Event>, option: ComboSchema) => {
    form.setValue('providerItem', option, { shouldValidate: true });
  };

  const handleChangeComboMd = (event: React.SyntheticEvent<Element, Event>, option: ComboSchema) => {
    form.setValue('mdItem', option, { shouldValidate: true });
  };

  const handleChangeComboAmd = (event: React.SyntheticEvent<Element, Event>, option: ComboSchema) => {
    form.setValue('amdItem', option, { shouldValidate: true });
  };

  /**
   * 파일 업로더
   */
  const upload = useFileUploader({ domainType: UploadDomainType.BRAND });

  /**
   * 브랜드 로고 파일 변경
   */
  const handleChangeLogoFile = async (uploadFilesInfo: UploadFileInfo[]) => {
    try {
      const uploadedFileInfo = await upload.handleUpload(uploadFilesInfo);
      // single mode
      upload.handleUpdateFileInfo(uploadedFileInfo, true);

      const [logoFileInfo] = uploadedFileInfo;
      form.setValue('primaryImageFileId', logoFileInfo.id, { shouldValidate: true, shouldDirty: true });
    } catch (e) {
      toast.error(e.data?.message ?? '이미지 등록 실패');
    }
  };

  /**
   * 브랜드 로고 삭제
   */
  const handleClearLogoFile = () => {
    upload.handleRemoveAll();

    form.setValue('primaryImageFileId', null, { shouldValidate: true, shouldDirty: true });
  };

  /**
   * 브랜드 생성
   */
  const { handleCreateBrand } = useBrandCreateService();

  /**
   * 브랜드 수정
   */
  const { handleUpdateBrand } = useBrandUpdateService(brandId);

  return {
    form: { ...form, resetForm },
    upload: { ...upload, handleChangeLogoFile, handleClearLogoFile },
    comboBoxProvider,
    comboBoxMd,
    comboBoxAmd,
    handleChangeComboProvider,
    handleChangeComboMd,
    handleChangeComboAmd,
    brandInfo,
    brandInfoRefetch,
    handleCreateBrand,
    handleUpdateBrand,
  };
};
