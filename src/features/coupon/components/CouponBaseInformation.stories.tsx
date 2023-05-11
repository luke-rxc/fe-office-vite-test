import { ComponentMeta } from '@storybook/react';
import { useForm } from 'react-hook-form';
import { CouponFormField } from '../types';
import { CouponBaseInformation } from './CouponBaseInformation';

export default {
  title: 'Features/Coupon/CouponBaseInformation',
  component: CouponBaseInformation,
} as ComponentMeta<typeof CouponBaseInformation>;

const Template = (args) => {
  const {
    control,
    watch,
    formState: { errors },
  } = useForm<CouponFormField>();

  const form = {
    control,
    watch,
    errors,
    handleSubmit: () => {},
  };

  return <CouponBaseInformation {...args} form={form} />;
};

export const Primary = Template.bind({});
Primary.args = {};
