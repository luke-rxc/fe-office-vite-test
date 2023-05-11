import { ComponentStory, ComponentMeta } from '@storybook/react';
import { FormProvider, useForm } from 'react-hook-form';
import { LandingType } from '../constants';
import { ScheduleModifyForm } from '../types';
import { ScheduleTableContentsLanding } from './ScheduleTableContentsLanding';

export default {
  title: 'Features/ScheduleTable/ScheduleTableContentsLanding',
  component: ScheduleTableContentsLanding,
} as ComponentMeta<typeof ScheduleTableContentsLanding>;

const Template: ComponentStory<typeof ScheduleTableContentsLanding> = (args) => {
  const formMethod = useForm<ScheduleModifyForm>({
    defaultValues: {
      landingType: LandingType.MODAL,
    },
  });

  return (
    <FormProvider {...formMethod}>
      <form>
        <ScheduleTableContentsLanding />
      </form>
    </FormProvider>
  );
};

export const Default = Template.bind({});
Default.args = {};
