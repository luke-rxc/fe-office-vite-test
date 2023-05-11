import { ComponentStory, ComponentMeta } from '@storybook/react';
import { toShowtimeAnchorPointItemModelList } from '../models';
import { showtimeAnchorPointSchemaMock } from '../__mocks__/showtimeAnchorPointSchemaMock';
import { AnchorPointSummary } from './AnchorPointSummary';

export default {
  title: 'Features/Showtime/AnchorPointSummary',
  component: AnchorPointSummary,
} as ComponentMeta<typeof AnchorPointSummary>;

const Template: ComponentStory<typeof AnchorPointSummary> = (args) => {
  const anchorPointItemList = toShowtimeAnchorPointItemModelList(showtimeAnchorPointSchemaMock);
  return <AnchorPointSummary {...args} items={anchorPointItemList} />;
};

export const Default = Template.bind({});
Default.args = {};
