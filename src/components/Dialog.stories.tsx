import { ComponentStory, ComponentMeta } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { Dialog } from './Dialog';
import { DialogType } from '@models/DialogModel';
import ErrorOutlineSharpIcon from '@material-ui/icons/ErrorOutlineSharp';

export default {
  title: 'Components/Dialog',
  component: Dialog,
} as ComponentMeta<typeof Dialog>;

const Template: ComponentStory<typeof Dialog> = (args) => <Dialog {...args} />;

export const Alert = Template.bind({});
Alert.args = {
  isOpen: true,
  title: 'Alert Type Title',
  content: `Alert 형태의 Dialog`,
  type: DialogType.ALERT,
  onClose: action('close'),
};

export const Confirm = Template.bind({});
Confirm.args = {
  isOpen: true,
  title: 'Confirm Type Title',
  content: `Confirm 형태의 Dialog`,
  type: DialogType.CONFIRM,
  onClose: action('close'),
  onConfirm: action('confirm'),
};

export const MultiLine = Template.bind({});
MultiLine.args = {
  isOpen: true,
  title: 'MultiLine',
  content: `${'Rxc Manager Office\r\nReact Material-UI 기반 제작\r\nDialog의 멀티라인 예시입니다.'}`,
  type: DialogType.ALERT,
  onClose: action('close'),
};

export const AlertWithIconTitle = Template.bind({});
AlertWithIconTitle.args = {
  isOpen: true,
  title: 'Alert Type Title',
  iconTitle: <ErrorOutlineSharpIcon />,
  content: `Alert 형태의 Dialog`,
  type: DialogType.ALERT,
  onClose: action('close'),
};

export const AlertWithoutTitle = Template.bind({});
AlertWithoutTitle.args = {
  isOpen: true,
  content: `Title이 없는 형태의 Dialog`,
  type: DialogType.ALERT,
  onClose: action('close'),
};
