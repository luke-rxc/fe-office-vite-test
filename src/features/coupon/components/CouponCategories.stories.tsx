import { ComponentStory, ComponentMeta } from '@storybook/react';
import { useForm } from 'react-hook-form';
import { CategoriesFormField } from '../types';
import { CouponCategories } from './CouponCategories';

export default {
  title: 'Features/Coupon/CouponCategories',
  component: CouponCategories,
} as ComponentMeta<typeof CouponCategories>;

const Template: ComponentStory<typeof CouponCategories> = (args) => {
  const formMethod = useForm<CategoriesFormField>();
  const onSubmit = formMethod.handleSubmit((values) => {
    window.console.log(values);
  });

  const form = {
    formMethod,
    handleSubmit: onSubmit,
    handleChangeCategory: () => {},
  };

  const categoryData = {
    rootCategories: [],
    subCategories: [],
    lastCategories: [],
  };

  return <CouponCategories {...args} form={form} categoryData={categoryData} />;
};

export const Default = Template.bind({});
Default.args = {};
