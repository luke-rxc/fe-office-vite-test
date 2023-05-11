import { MemoryRouter } from 'react-router';
import { addDecorator } from '@storybook/react';
import { CssBaseline, ThemeProvider } from '@material-ui/core';
import { createCustomTheme } from '@styles/theme';

const theme = createCustomTheme({
  direction: 'ltr',
  responsiveFontSizes: true,
  roundedCorners: true,
  theme: 'LIGHT',
});

addDecorator((story) => (
  <ThemeProvider theme={theme}>
    <MemoryRouter initialEntries={['/']}>{story()}</MemoryRouter>
  </ThemeProvider>
));

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
};
