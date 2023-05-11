import { ComponentStory, ComponentMeta } from '@storybook/react';
import { toShowtimeAnchorPointItemModel } from '../models';
import { showtimeAnchorPointSchemaMock } from '../__mocks__/showtimeAnchorPointSchemaMock';
import { AnchorPointContents } from './AnchorPointContents';

export default {
  title: 'Features/Showtime/AnchorPointContents',
  component: AnchorPointContents,
} as ComponentMeta<typeof AnchorPointContents>;

const Template: ComponentStory<typeof AnchorPointContents> = (args) => {
  const anchorPointItem = toShowtimeAnchorPointItemModel(showtimeAnchorPointSchemaMock[0]);

  return <AnchorPointContents {...args} item={anchorPointItem} />;
};

export const Default = Template.bind({});
Default.args = {};
