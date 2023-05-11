import { TextField, Grid, List, ListItem } from '@material-ui/core';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { ListTitle } from './ListTitle';

export default {
  title: 'Components/ListTitle',
  component: ListTitle,
} as ComponentMeta<typeof ListTitle>;

const Template: ComponentStory<typeof ListTitle> = (args) => (
  <Grid container spacing={2}>
    <Grid item xs={9}>
      <List>
        {/* 상품명 */}
        <ListItem sx={{ mt: 2 }}>
          <ListTitle {...args} />
          <TextField name="name" variant="outlined" placeholder="placeholder" fullWidth />
        </ListItem>
      </List>
    </Grid>
  </Grid>
);

export const Default = Template.bind({});
Default.args = {
  name: '리스트 타이틀',
  isRequired: true,
  width: 120,
};
