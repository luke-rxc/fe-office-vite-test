import { ComponentStory, ComponentMeta } from '@storybook/react';
import { FormProvider, useForm } from 'react-hook-form';
import { Section } from './Section';
import { ShowtimeSettingInformation } from './ShowtimeSettingInformation';

export default {
  title: 'Features/Showtime/ShowtimeSettingInformation',
  component: ShowtimeSettingInformation,
} as ComponentMeta<typeof ShowtimeSettingInformation>;

const Template: ComponentStory<typeof ShowtimeSettingInformation> = (args) => {
  const formMethod = useForm();
  return (
    <FormProvider {...formMethod}>
      <Section title="라이브 설정">
        <ShowtimeSettingInformation />
      </Section>
    </FormProvider>
  );
};

export const Default = Template.bind({});
Default.args = {};
