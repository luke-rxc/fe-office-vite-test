import { Box, Typography } from '@material-ui/core';
import { ReactElement } from 'react';
import { Helmet } from 'react-helmet-async';
import { Breadcrumbs, IBreadcrumbs } from '@components/Breadcrumbs';

interface CategoriesLayoutProps {
  // 타이틀
  title: string;
  // content
  children: ReactElement;
  // breadcrumbs items
  locations?: Array<IBreadcrumbs>;
}

const CategoriesLayout = ({ title, locations, children }: CategoriesLayoutProps) => {
  return (
    <>
      <Helmet>
        <title>{title ?? 'Page Title'}</title>
      </Helmet>
      <Box
        sx={{
          backgroundColor: 'background.default',
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          overflow: 'hidden',
        }}
      >
        <Box sx={{ p: 3 }}>
          <Typography color="textPrimary" variant="h5">
            {title ?? 'Page Title'}
          </Typography>
          {locations && <Breadcrumbs locations={locations} />}
        </Box>
        {children}
      </Box>
    </>
  );
};

export default CategoriesLayout;
