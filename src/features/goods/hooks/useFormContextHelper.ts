import { useFormContext } from 'react-hook-form';

export const useFormContextHelper = () => {
  const {
    clearErrors,
    formState: { errors },
  } = useFormContext();

  const clearError = (key: string) => {
    if (!!errors[key]) {
      clearErrors(key);
    }
  };

  return {
    clearError,
  };
};
