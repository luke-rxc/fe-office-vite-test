import { ComponentStory, ComponentMeta } from '@storybook/react';
import { Box, Button, Container, Grid } from '@material-ui/core';
import { Layout } from './Layout';

export default {
  title: 'Components/Layout',
  component: Layout,
} as ComponentMeta<typeof Layout>;

const Template: ComponentStory<typeof Layout> = (args) => (
  <div {...args}>
    <Box
      sx={{
        backgroundColor: 'background.default',
        minHeight: '100%',
      }}
    >
      <Container maxWidth={false}>
        <Layout {...args}>
          <Box
            sx={{
              backgroundColor: '#d8d8d8',
              minHeight: '300px',
              display: 'flex',
              justifyItems: 'center',
            }}
          >
            <Grid container direction="row" justifyContent="center" alignItems="center">
              Children (컨텐츠 영역)
            </Grid>
          </Box>
        </Layout>
      </Container>
    </Box>
  </div>
);

export const Default = Template.bind({});
Default.args = {
  title: '타이틀 / breadcrumbs',
  locations: [
    {
      path: '/',
      text: 'Home',
      key: 'Parent',
    },
    {
      path: '/category1',
      text: '대카테고리',
      key: 'category1',
    },
    {
      path: '/category2',
      text: '중카테고리',
      key: 'category2',
    },
    {
      path: '/category3',
      text: '소카테고리',
      key: 'category3',
    },
  ],
};

export const Addon = Template.bind({});
Addon.args = {
  title: '타이틀 / breadcrumbs / actions',
  locations: [
    {
      path: '/',
      text: 'Home',
      key: 'Parent',
    },
    {
      path: '/category0',
      text: '대카테고리',
      key: 'category0',
    },
  ],
  actions: [
    <Button key="action1" color="primary" sx={{ m: 1 }} variant="contained">
      상품생성
    </Button>,
  ],
};
