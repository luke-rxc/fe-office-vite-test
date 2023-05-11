import { Button } from '@material-ui/core';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { ExportList } from './ExportList';

export default {
  title: 'Features/Order/Export/ExportList',
  component: ExportList,
} as ComponentMeta<typeof ExportList>;

const Template: ComponentStory<typeof ExportList> = (args) => {
  return <ExportList {...args} />;
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
