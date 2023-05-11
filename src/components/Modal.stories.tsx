import { ComponentStory, ComponentMeta } from '@storybook/react';
import CloseIcon from '@material-ui/icons/Close';
import { Modal } from './Modal';

export default {
  title: 'Components/Modal',
  component: Modal,
} as ComponentMeta<typeof Modal>;

const Template: ComponentStory<typeof Modal> = (args) => <Modal {...args} />;
export const Default = Template.bind({});
Default.args = {
  open: true,
  title: '타이틀영역',
  children: <div style={{ width: 800, height: 1000, background: 'rgba(255,0,0,0.3)' }}>컨텐츠영역</div>,
  maxWidth: 1000,
  maxHeight: 800,
  cancelText: (
    <>
      <CloseIcon />
      &nbsp;닫기
    </>
  ),
  confirmText: '등록',
  onCancel: () => {
    console.log('cancel');
  },
  onConfirm: () => {
    console.log('confirm');
  },
};

export const Disabled = Template.bind({});
Disabled.args = {
  ...Default.args,
  disabled: true,
};
