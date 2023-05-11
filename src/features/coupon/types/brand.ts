import { BaseSyntheticEvent } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { BrandFormField } from './coupon';

export interface BrandFormProps {
  formMethod: UseFormReturn<BrandFormField>;
  handleSubmit: (e?: BaseSyntheticEvent<object, unknown, unknown>) => Promise<void>;
}
