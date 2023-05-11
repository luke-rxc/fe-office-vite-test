import { ComponentStory, ComponentMeta } from '@storybook/react';
import { FormProvider, useForm } from 'react-hook-form';
import { SchedulingStatus } from '../constants';
import { ScheduleModifyForm } from '../types';
import { ScheduleTableContentsStatus } from './ScheduleTableContentsStatus';

export default {
  title: 'Features/ScheduleTable/ScheduleTableContentsStatus',
  component: ScheduleTableContentsStatus,
} as ComponentMeta<typeof ScheduleTableContentsStatus>;

const Template: ComponentStory<typeof ScheduleTableContentsStatus> = (args) => {
  const formMethod = useForm<ScheduleModifyForm>({
    defaultValues: {
      scheduling: SchedulingStatus.OPENED,
    },
  });

  return (
    <FormProvider {...formMethod}>
      <form>
        <ScheduleTableContentsStatus />
      </form>
    </FormProvider>
  );
};

export const Default = Template.bind({});
Default.args = {};
