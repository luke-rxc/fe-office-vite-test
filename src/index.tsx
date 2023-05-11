import 'react-perfect-scrollbar/dist/css/styles.css';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import 'react-quill/dist/quill.snow.css';
import 'nprogress/nprogress.css';
import { StrictMode } from 'react';
import ReactDOM from 'react-dom';
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter } from 'react-router-dom';
import StyledEngineProvider from '@material-ui/core/StyledEngineProvider';
import LocalizationProvider from '@material-ui/lab/LocalizationProvider';
import AdapterDateFns from '@material-ui/lab/AdapterDateFns';
import App from './App';
import { SettingsProvider } from './contexts/SettingsContext';
import { AuthProvider } from './contexts/JWTContext';
import { LoadingProvider } from './contexts/LoadingContext';
import { QueryClient, QueryClientProvider } from 'react-query';
import { SiteTypeProvider } from '@contexts/SiteTypeContext';

const client = new QueryClient();

ReactDOM.render(
  <StrictMode>
    <HelmetProvider>
      <StyledEngineProvider injectFirst>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <QueryClientProvider client={client}>
            <SettingsProvider>
              <BrowserRouter>
                <SiteTypeProvider>
                  <AuthProvider>
                    <LoadingProvider>
                      <App />
                    </LoadingProvider>
                  </AuthProvider>
                </SiteTypeProvider>
              </BrowserRouter>
            </SettingsProvider>
          </QueryClientProvider>
        </LocalizationProvider>
      </StyledEngineProvider>
    </HelmetProvider>
  </StrictMode>,
  document.getElementById('root'),
);
