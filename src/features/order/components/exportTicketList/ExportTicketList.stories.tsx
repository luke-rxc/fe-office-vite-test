import { Button } from '@material-ui/core';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { ExportTicketList } from './ExportTicketList';

export default {
  title: 'Features/Order/ExportTicket/ExportTicketList',
  component: ExportTicketList,
} as ComponentMeta<typeof ExportTicketList>;

const Template: ComponentStory<typeof ExportTicketList> = (args) => {
  return <ExportTicketList {...args} />;
};

export const Default = Template.bind({});
Default.args = {
  actions: (
    <>
      <Button variant="contained" size="small" sx={{ marginLeft: '10px' }}>
        엑셀다운로드
      </Button>
    </>
  ),
  items: [],
  isLoading: false,
};
