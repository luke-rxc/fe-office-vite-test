import { BaseSyntheticEvent } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { CategoriesFormField } from './coupon';

export interface CategoryFormProps {
  formMethod: UseFormReturn<CategoriesFormField>;
  handleSubmit: (e?: BaseSyntheticEvent<object, unknown, unknown>) => Promise<void>;
  handleChangeCategory: (categoryName: string, value?: string) => void;
}
