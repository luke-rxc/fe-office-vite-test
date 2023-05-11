import { useForm } from 'react-hook-form';
import { CouponListFormValue } from '../types';
import { SearchForm } from './SearchForm';

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  title: 'Features/Coupon/SearchForm',
  component: SearchForm,
};

const Template = (args) => {
  const {
    control,
    formState: { errors },
  } = useForm<CouponListFormValue>();
  const form = {
    control,
    errors,
    handleSubmit: () => {},
    handleReset: () => {},
  };
  return <SearchForm {...args} form={form} />;
};

export const Primary = Template.bind({});
Primary.args = {};
