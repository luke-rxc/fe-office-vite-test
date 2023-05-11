import { useEffect } from 'react';
import type { FC } from 'react';
import { useRoutes } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { CssBaseline, ThemeProvider } from '@material-ui/core';
import './i18n';
import RTL from './components/RTL';
// import SettingsDrawer from './components/SettingsDrawer';
import SplashScreen from './components/SplashScreen';
import { gtmConfig } from './config';
import useAuth from './hooks/useAuth';
import useScrollReset from './hooks/useScrollReset';
import useSettings from './hooks/useSettings';
import gtm from './libs/gtm';
import * as datadog from './libs/datadogRum';
import routes from './routes';
import { createCustomTheme } from './styles/theme';
import { DialogProvider } from '@contexts/DialogContext';

const App: FC = () => {
  const content = useRoutes(routes);
  const { settings } = useSettings();
  const auth = useAuth();

  useScrollReset();

  useEffect(() => {
    gtm.initialize(gtmConfig);

    // Datadog RUM
    datadog.init();
  }, []);

  const theme = createCustomTheme({
    direction: settings.direction,
    responsiveFontSizes: settings.responsiveFontSizes,
    roundedCorners: settings.roundedCorners,
    theme: settings.theme,
  });

  return (
    <ThemeProvider theme={theme}>
      <DialogProvider>
        <RTL direction={settings.direction}>
          <CssBaseline />
          <Toaster position="top-center" />
          {/** @todo 220207 차후 디자인 반영요소에 대해 대응이 가능할때 오픈  */}
          {/* <SettingsDrawer /> */}
          {auth.isInitialized ? content : <SplashScreen />}
        </RTL>
      </DialogProvider>
    </ThemeProvider>
  );
};

export default App;
