import useSettings from '@hooks/useSettings';
import { Helmet } from 'react-helmet-async';
import { Box, Container, Grid, Typography } from '@material-ui/core';
import { ReactElement, ReactNode } from 'react';
import { Breadcrumbs, IBreadcrumbs } from './Breadcrumbs';

interface Props {
  // 타이틀
  title: string;
  // 타이틀 헤더 사용 여부
  useTitleHeader?: boolean;
  // action items
  actions?: Array<ReactNode> | React.ReactNode;
  // content
  children: ReactElement | React.ReactNode;
  // breadcrumbs items
  locations?: Array<IBreadcrumbs>;
}

/**
 * CheckBox 컴포넌트
 *
 * @example
 * ```
 * <Layout
 *  title="타이들"
 *  locations={[
 *    { path: '/', text: '홈' }
 *  ]}
 *  actions={[
 *    <Button>버튼</Button>
 *  ]}
 * >
 *  {children}
 * </Layout>
 * ```
 */

export const Layout = ({ title, useTitleHeader = true, locations, actions, children }: Props) => {
  const { settings } = useSettings();
  return (
    <>
      {useTitleHeader && (
        <Helmet>
          <title>{title}</title>
        </Helmet>
      )}
      <Box
        sx={{
          backgroundColor: 'background.default',
          minHeight: '100%',
          py: 3,
        }}
      >
        <Container maxWidth={settings.compact ? 'xl' : false}>
          <Grid container justifyContent="space-between" alignItems="center" height="64px">
            <Grid item>
              <Typography color="textPrimary" variant="h5">
                {title ?? 'Page Title'}
              </Typography>

              {locations && <Breadcrumbs locations={locations} />}
            </Grid>
            <Grid item>
              <Box>
                {/* Action Button area */}
                {actions}
              </Box>
            </Grid>
          </Grid>
          <Box sx={{ mt: 3 }}>
            {/* Content Area */}
            {children}
          </Box>
        </Container>
      </Box>
    </>
  );
};
