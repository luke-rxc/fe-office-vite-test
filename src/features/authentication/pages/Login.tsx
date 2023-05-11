import { useEffect } from 'react';
import type { FC } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Box, Card, CardContent, Container, Divider, Typography } from '@material-ui/core';
import { LoginJWT } from '../components/login';
import Logo from '@components/Logo';
import gtm from '@libs/gtm';
import { useSiteType } from '@hooks/useSiteType';
import { SiteTypeKoreanMap } from '@constants/site';

const Login: FC = () => {
  const siteType = useSiteType();

  useEffect(() => {
    gtm.push({ event: 'page_view' });
  }, []);

  return (
    <>
      <Helmet>
        <title>RXC {SiteTypeKoreanMap[siteType] ?? ''} office</title>
      </Helmet>
      <Box
        sx={{
          backgroundColor: 'background.default',
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
        }}
      >
        <Container maxWidth="sm" sx={{ py: '80px' }}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              mb: 8,
            }}
          >
            <RouterLink to="/">
              <Logo
                sx={{
                  height: 24,
                  width: 128,
                }}
              />
            </RouterLink>
          </Box>
          <Card>
            <CardContent
              sx={{
                display: 'flex',
                flexDirection: 'column',
                p: 4,
              }}
            >
              <Box
                sx={{
                  alignItems: 'center',
                  display: 'flex',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <Typography color="textPrimary" gutterBottom variant="h4">
                    로그인
                  </Typography>
                  <Typography color="textSecondary" variant="body2">
                    RXC {SiteTypeKoreanMap[siteType] ?? ''} office
                  </Typography>
                </div>
              </Box>
              <Box
                sx={{
                  flexGrow: 1,
                  mt: 3,
                }}
              >
                <LoginJWT />
              </Box>
              <Divider sx={{ my: 3 }} />
            </CardContent>
          </Card>
        </Container>
      </Box>
    </>
  );
};

export default Login;
