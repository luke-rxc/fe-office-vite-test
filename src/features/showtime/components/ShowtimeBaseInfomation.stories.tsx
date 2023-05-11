import { ComponentStory, ComponentMeta } from '@storybook/react';
import { useForm } from 'react-hook-form';
import { FormProvider } from 'react-hook-form';
import { GoodsInfo } from './GoodsInfo';
import { Section } from './Section';
import { ShowtimeBaseInformation } from './ShowtimeBaseInformation';

export default {
  title: 'Features/Showtime/ShowtimeBaseInformation',
  component: ShowtimeBaseInformation,
} as ComponentMeta<typeof ShowtimeBaseInformation>;

const Template: ComponentStory<typeof ShowtimeBaseInformation> = (args) => {
  const formMethod = useForm();

  const onOpenModal = () => {
    window.console.log('openModal');
  };

  const onClickDeleteGoodsItem = (id: number) => {
    window.console.log('delete goods item');
  };

  const onClickChangeOrdering = (id: number) => {
    return () => window.console.log('ordering goods item');
  };

  return (
    <FormProvider {...formMethod}>
      <Section title="라이브 정보">
        <ShowtimeBaseInformation
          {...args}
          showroomOptions={[]}
          keywordOptions={[]}
          goodsStandardTypeComponent={
            <GoodsInfo
              addedGoodsItems={[]}
              onOpenModal={onOpenModal}
              onClickDeleteGoodsItem={onClickDeleteGoodsItem}
              onClickChangeOrdering={onClickChangeOrdering}
            />
          }
        />
      </Section>
    </FormProvider>
  );
};

export const Default = Template.bind({});
Default.args = {};
