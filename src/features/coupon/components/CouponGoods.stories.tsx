import { ComponentStory, ComponentMeta } from '@storybook/react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toGoodsModelList } from '../models';
import { SearchGoodsFormField } from '../types';
import { goodsSchemaMock } from '../__mocks__/goodsSchemaMock';
import { CouponGoods } from './CouponGoods';

export default {
  title: 'Features/Coupon/CouponGoods',
  component: CouponGoods,
} as ComponentMeta<typeof CouponGoods>;

const Template: ComponentStory<typeof CouponGoods> = (args) => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<Array<number>>([]);
  const items = toGoodsModelList(goodsSchemaMock.content);
  const formMethod = useForm<SearchGoodsFormField>();

  const form = {
    formMethod,
    handleSubmit: async () => {},
    handleReset: () => {},
  };

  const columns = [
    { label: '상품ID', dataKey: 'id', id: 'id' },
    { label: '상품명', dataKey: 'name', id: 'name' },
  ];

  const handleChangeRowSelect = (selectedRowKeys: Array<number>) => {
    setSelectedRowKeys(selectedRowKeys);
  };

  const handleAddSelectItem = () => {
    window.console.log('selected item keys', selectedRowKeys);
  };

  const tableProps = {
    columns,
    items,
    rowSelection: {
      selectedRowKeys,
      onChange: handleChangeRowSelect,
    },
  };

  return <CouponGoods {...args} form={form} tableProps={tableProps} handleAddSelectItem={handleAddSelectItem} />;
};

export const Default = Template.bind({});
Default.args = {};
