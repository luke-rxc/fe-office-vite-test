import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { useForm, Controller } from 'react-hook-form';
import { Button } from '@material-ui/core';
import { ColorPicker } from './ColorPicker';

export default {
  title: 'Components/ColorPicker',
  component: ColorPicker,
} as ComponentMeta<typeof ColorPicker>;

const Template: ComponentStory<typeof ColorPicker> = (args) => <ColorPicker {...args} />;
const TemplateWithController: ComponentStory<typeof ColorPicker> = (args) => {
  const { control, watch, handleSubmit } = useForm({ defaultValues: { color: '#ff0000' } });
  const color = watch('color');

  React.useEffect(() => {
    console.log('color: ', color);
  }, [color]);

  return (
    <div>
      <Controller name="color" control={control} render={({ field }) => <ColorPicker {...args} {...field} />} />
      <Button onClick={handleSubmit((values) => alert(JSON.stringify(values)))}>Submit</Button>
    </div>
  );
};

export const 기본 = Template.bind({});
기본.args = {
  label: '기본 칼라',
  placeholder: '색상을 입력해주세요',
  onChange: (color) => console.log(color),
};

export const 컨트롤러 = TemplateWithController.bind({});
컨트롤러.args = {
  size: 'small',
  label: 'color',
  disabled: true,
  placeholder: '색상을 입력해주세요',
};
