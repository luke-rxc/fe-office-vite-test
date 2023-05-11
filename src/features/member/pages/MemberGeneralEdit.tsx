import { useState, useCallback, useEffect } from 'react';
import type { FC } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Box, Breadcrumbs, Container, Grid, Link, Typography } from '@material-ui/core';
import { customerApi } from '../../../__fakeApi__/customerApi';
import { CustomerEditForm } from '@components/customer';
import useMounted from '@hooks/useMounted';
import useSettings from '@hooks/useSettings';
import ChevronRightIcon from '@assets/icons/ChevronRight';
import gtm from '../../../libs/gtm';
import type { Customer } from '../../../schemas/customer';

const CustomerEdit: FC = () => {
  const mounted = useMounted();
  const { settings } = useSettings();
  const [customer, setCustomer] = useState<Customer | null>(null);

  useEffect(() => {
    gtm.push({ event: 'page_view' });
  }, []);

  const getCustomer = useCallback(async () => {
    try {
      const data = await customerApi.getCustomer();

      if (mounted.current) {
        setCustomer(data);
      }
    } catch (err) {
      console.error(err);
    }
  }, [mounted]);

  useEffect(() => {
    getCustomer();
  }, [getCustomer]);

  if (!customer) {
    return null;
  }

  return (
    <>
      <Helmet>
        <title>Dashboard: Customer Edit | Material Kit Pro</title>
      </Helmet>
      <Box
        sx={{
          backgroundColor: 'background.default',
          minHeight: '100%',
          py: 8,
        }}
      >
        <Container maxWidth={settings.compact ? 'xl' : false}>
          <Grid container justifyContent="space-between" spacing={3}>
            <Grid item>
              <Typography color="textPrimary" variant="h5">
                Customer Edit
              </Typography>
              <Breadcrumbs aria-label="breadcrumb" separator={<ChevronRightIcon fontSize="small" />} sx={{ mt: 1 }}>
                <Link color="textPrimary" component={RouterLink} to="/member" variant="subtitle2">
                  일반 유저 관리
                </Link>
                <Typography color="textSecondary" variant="subtitle2">
                  회원 수정
                </Typography>
              </Breadcrumbs>
            </Grid>
          </Grid>
          <Box mt={3}>
            <CustomerEditForm customer={customer} />
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default CustomerEdit;
