import { useState } from 'react';
import toast from 'react-hot-toast';
import { ErrorDataModel, ErrorModel } from '@utils/api/createAxios';
import { useMutation } from '@hooks/useMutation';
import { getContentValidate } from '../apis';
import {
  CONTENT_CODE_LENGTH,
  CONTENT_CODE_REGEX,
  CONTENT_NAME_LENGTH,
  CONTENT_NAME_REGEX,
  CONTENT_VALID_TYPE,
} from '../constants';

/**
 * 컨텐츠명, 컨텐츠 코드 중복체크
 */
export const useContentValidateOverlapping = ({
  type,
  formMethod,
  contentId = null,
}: {
  type: CONTENT_VALID_TYPE;
  formMethod: any;
  contentId?: number;
}) => {
  const { setError, setValue, clearErrors } = formMethod;
  const [textValue, setTextValue] = useState('');

  const { isLoading, mutateAsync } = useMutation(
    (values: { value: string; contentId: number }) => getContentValidate(type, values),
    {
      onError: (error: ErrorModel<ErrorDataModel>) => {
        const msg = error.data.message;
        toast.error(msg);
      },
    },
  );

  const handleValidateText = async (value: string, contentId: number = null) => {
    const isValid = await mutateAsync({ value, contentId });
    return isValid;
  };

  const handleChangeText = async (value: string) => {
    if (!value) {
      clearErrors(type);
      return;
    }

    const valueReg = type === CONTENT_VALID_TYPE.NAME ? CONTENT_NAME_REGEX : CONTENT_CODE_REGEX;
    const valueLimit = type === CONTENT_VALID_TYPE.NAME ? CONTENT_NAME_LENGTH : CONTENT_CODE_LENGTH;
    const validFormName = type === CONTENT_VALID_TYPE.NAME ? 'isValidName' : 'isValidCode';

    if (!value.match(valueReg.REGEX)) {
      setError(type, { type: 'required', message: valueReg.MESSAGE });
      setValue(validFormName, false);
      return;
    }
    if (value.length > valueLimit) {
      setError(type, { type: '', message: `최대 ${valueLimit}자 이내 입력해 주세요.` });
      setValue(validFormName, false);
      return;
    }

    const isValid = await handleValidateText(value, contentId);
    if (!isValid) {
      setError(type, {
        type: 'required',
        message: `이미 사용중인 콘텐츠 ${type === CONTENT_VALID_TYPE.NAME ? '명' : 'ID'}입니다.`,
      });
      setValue(validFormName, false);
      return;
    }
    clearErrors(type);
    setValue(validFormName, true);
    if (type === CONTENT_VALID_TYPE.CODE) {
      setTextValue(value);
    }
  };

  const handleSubmitError = (error) => {
    if (error) {
      setError(type, {
        type: 'required',
        message: `유효한 콘텐츠 ${type === CONTENT_VALID_TYPE.NAME ? '명' : 'ID'}을 입력해 주세요.`,
      });
    }
  };

  return {
    isLoading,
    textValue,
    handleValidateText,
    handleChangeText,
    handleSubmitError,
  };
};
