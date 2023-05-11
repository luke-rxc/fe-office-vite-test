import { ComponentMeta } from '@storybook/react';
import { FormProvider, useForm } from 'react-hook-form';
import { SearchField, SearchFilterMore } from '../constants';
import { ShowtimeListFormField } from '../types';
import { SearchForm } from './SearchForm';
import addDays from 'date-fns/addDays';

export default {
  title: 'Features/Showtime/SearchForm',
  component: SearchForm,
} as ComponentMeta<typeof SearchForm>;

const Template = (args) => {
  const formMethod = useForm<ShowtimeListFormField>({
    defaultValues: {
      keyword: '',
      searchField: SearchField.TITLE,
      showRoomIds: [],
      liveStartDate: addDays(new Date(), -1).getTime(),
      liveEndDate: new Date().getTime(),
    },
  });
  const form = {
    formMethod,
    handleSubmit: (values) => {
      window.console.log(values);
    },
    handleReset: () => {},
  };

  const onClickShowMore = () => {};

  return (
    <FormProvider {...formMethod}>
      <SearchForm {...args} form={form} handleClickShowMore={onClickShowMore} />
    </FormProvider>
  );
};

export const DEFAULT = Template.bind({});
DEFAULT.args = {
  more: SearchFilterMore.REQUIRED,
};

export const ALLFILTER = Template.bind({});
ALLFILTER.args = {
  more: SearchFilterMore.ALL,
};
