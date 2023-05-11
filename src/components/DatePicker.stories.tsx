import { ComponentStory, ComponentMeta } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { DatePicker } from './DatePicker';

export default {
  title: 'Components/DatePicker',
  component: DatePicker,
} as ComponentMeta<typeof DatePicker>;

const Template: ComponentStory<typeof DatePicker> = (args) => <DatePicker {...args} />;

export const 기본 = Template.bind({});
기본.args = { label: '기본 DatePicker' };

export const 날짜와_시간_선택 = Template.bind({});
날짜와_시간_선택.args = {
  dateTime: true,
  label: '날짜 + 시간 DatePicker',
};

export const 표시_포멧_변경 = Template.bind({});
표시_포멧_변경.args = {
  label: '포멧변경 DatePicker',
  inputFormat: 'dd/mm/yy',
  mask: '__/__/__',
};

export const 선택가능_날짜_설정 = Template.bind({});
선택가능_날짜_설정.args = {
  minDate: new Date(),
  maxDate: (() => {
    const date = new Date();
    date.setDate(date.getDate() + 10);
    return date;
  })(),
  label: '선택가능 날짜 설정 DatePicker',
};

export const 툴바사용 = Template.bind({});
툴바사용.args = {
  label: '툴바사용 DatePicker',
  showToolbar: true,
};
