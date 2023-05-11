import { useMutation } from '@hooks/useMutation';
import useLoading from '@hooks/useLoading';
import { ErrorModel, ErrorDataModel } from '@utils/api/createAxios';
import { postContentCreator } from '../apis';
import { ContentCreatorFieldModel, ContentCreatorRequestParams, toCreatorParams } from '../models';

/**
 * 콘텐츠 생성
 * @returns
 */
export const useContentCreatorService = (): {
  isSuccess: boolean;
  isError: boolean;
  error: ErrorModel<ErrorDataModel>;
  isLoading: boolean;
  handleContentCreator: (formData: ContentCreatorFieldModel) => void;
} => {
  const { showLoading, hideLoading } = useLoading();
  const { isSuccess, isError, error, mutate, isLoading } = useMutation(
    (value: ContentCreatorRequestParams) => postContentCreator(value),
    {
      onSuccess: () => {
        hideLoading();
      },
      onError: (error: ErrorModel<ErrorDataModel>) => {
        hideLoading();
      },
    },
  );

  const handleContentCreator = (value: ContentCreatorFieldModel) => {
    showLoading();
    const params = toCreatorParams(value);
    mutate(params);
  };

  return {
    isSuccess,
    isError,
    isLoading,
    error,
    handleContentCreator,
  };
};
