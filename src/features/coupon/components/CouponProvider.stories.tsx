import { ComponentStory, ComponentMeta } from '@storybook/react';
import { useForm } from 'react-hook-form';
import { toProviderModelList } from '../models';
import { SearchFormField } from '../types';
import { providerSchemaMock } from '../__mocks__/providerSchemaMock';
import { CouponProvider } from './CouponProvider';

export default {
  title: 'Features/Coupon/CouponProvider',
  component: CouponProvider,
} as ComponentMeta<typeof CouponProvider>;

const Template: ComponentStory<typeof CouponProvider> = (args) => {
  const formMethod = useForm<SearchFormField>();

  const form = {
    formMethod,
    handleSubmit: async () => {},
    handleReset: () => {},
  };

  const tableProps = {
    columns: [
      { label: '입점사ID', dataKey: 'id', id: 'id' },
      { label: '입점사명', dataKey: 'name', id: 'name' },
    ],
    rowSelection: {
      selectedRowKeys: [],
      onChange: () => {},
    },
    selectionKeys: [],
    items: toProviderModelList(providerSchemaMock.content),
  };

  const handleAddSelectItem = () => {
    window.console.log('add select Item');
  };

  return <CouponProvider {...args} form={form} tableProps={tableProps} onAddSelectItem={handleAddSelectItem} />;
};

export const Default = Template.bind({});
Default.args = {};
