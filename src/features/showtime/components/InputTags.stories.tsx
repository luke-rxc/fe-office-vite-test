import { ComponentMeta } from '@storybook/react';
import { useForm } from 'react-hook-form';
import { InputTags } from './InputTags';

export default {
  title: 'Features/Showtime/InputTags',
  component: InputTags,
} as ComponentMeta<typeof InputTags>;

const Template = (args) => {
  const { watch, setValue } = useForm<{ tags: Array<string> }>({ defaultValues: { tags: [] } });
  const { tags } = watch();

  const onUpdateTags = (updateTags: Array<string>) => {
    window.console.log('onUpdateTags', updateTags);
    setValue('tags', updateTags);
  };

  const onDeleteTags = (updateTags: Array<string>) => {
    window.console.log('onDeleteTags', updateTags);
    setValue('tags', updateTags);
  };

  return <InputTags {...args} tags={tags} onUpdateTags={onUpdateTags} onDeleteTags={onDeleteTags} />;
};

export const DEFAULT = Template.bind({});
DEFAULT.args = {};
