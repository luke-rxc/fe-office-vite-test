import { ComponentStory, ComponentMeta } from '@storybook/react';
import { FormProvider, useForm } from 'react-hook-form';
import { ScheduleBannerType } from '../constants';
import { toScheduleTableDetailItemModel } from '../models';
import { ScheduleModifyForm } from '../types';
import { scheduleTableDetailItemSchemaMock } from '../__mocks__/scheduleTableDetailItemSchemaMock';
import { ScheduleTableContentsBanner } from './ScheduleTableContentsBanner';

export default {
  title: 'Features/ScheduleTable/ScheduleTableContentsBanner',
  component: ScheduleTableContentsBanner,
} as ComponentMeta<typeof ScheduleTableContentsBanner>;

const Template: ComponentStory<typeof ScheduleTableContentsBanner> = (args) => {
  const formMethod = useForm<ScheduleModifyForm>({
    defaultValues: {
      bannerType: ScheduleBannerType.NONE,
    },
  });

  const item = toScheduleTableDetailItemModel(scheduleTableDetailItemSchemaMock);
  window.console.log(item);
  return (
    <FormProvider {...formMethod}>
      <form>
        <ScheduleTableContentsBanner items={item.bannerGoodsList} bannerImagesComponent={<div />} />
      </form>
    </FormProvider>
  );
};

export const Default = Template.bind({});
Default.args = {};
