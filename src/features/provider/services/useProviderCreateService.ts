import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation } from '@hooks/useMutation';
import useLoading from '@hooks/useLoading';
import { ErrorModel, ErrorDataModel } from '@utils/api/createAxios';
import { postProvider } from '../apis';
import { CreateProviderFiledModel } from '../models';
import { BUSINESS_TYPE } from '../constants';
import { validationProviderCreate } from '../utils';

/**
 * 입점사 등록
 * @returns
 */
export const useProviderCreateService = (): {
  isSuccess: boolean;
  handleProviderCreate: (formData: CreateProviderFiledModel) => void;
  formMethod: any;
} => {
  const formMethod = useForm<CreateProviderFiledModel>({
    defaultValues: {
      businessType: BUSINESS_TYPE.INDIVIDUAL,
      businessNumber: '',
      name: '',
    },
    resolver: yupResolver(validationProviderCreate),
  });

  const { showLoading, hideLoading } = useLoading();
  const { isSuccess, mutate } = useMutation((value: CreateProviderFiledModel) => postProvider(value), {
    onSuccess: () => {
      hideLoading();
    },
    onError: (error: ErrorModel<ErrorDataModel>) => {
      const msg = error.data.message;
      toast.error(msg);
      hideLoading();
    },
  });

  /**
   * 입점사 생성처리
   * @param formData
   */
  const handleProviderCreate = (formData: CreateProviderFiledModel) => {
    showLoading();
    mutate(formData);
  };

  return {
    isSuccess,
    formMethod,
    handleProviderCreate,
  };
};
