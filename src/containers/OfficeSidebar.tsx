import { useEffect } from 'react';
import type { FC } from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Autocomplete, Box, Divider, Drawer, TextField, Typography } from '@material-ui/core';
import type { Theme } from '@material-ui/core';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { env, pathConfig } from '@config';
import useAuth from '@hooks/useAuth';
import { useMenu } from '@hooks/useMenu';
import { SiteType } from '@constants/site';
import Logo from '@components/Logo';
import Scrollbar from '@components/Scrollbar';
import { NavSections } from '@components/NavSections';
import { usePartnerProviderMenuService } from '@services/usePartnerProviderMenuService';
import { ProviderMenuModel } from '@models/userModel';
import NavOfficeBanner from '@components/NavOfficeBanner';
import { getSiteType } from '@utils/getSiteType';

interface OfficeSidebarProps {
  onMobileClose: () => void;
  openMobile: boolean;
}

const OfficeSidebar: FC<OfficeSidebarProps> = (props) => {
  const { onMobileClose, openMobile } = props;
  const location = useLocation();
  const { user, permissions } = useAuth();
  const { getMappedNavSections } = useMenu();
  const lgUp = useMediaQuery((theme: Theme) => theme.breakpoints.up('lg'));
  const sections = getMappedNavSections(permissions);
  const isManagerOffice = getSiteType() === SiteType.MANAGER;
  const { isPartner, currentPartnerProvider, partnerProviderMenus, handleChangePartnerProvider } =
    usePartnerProviderMenuService();

  useEffect(() => {
    if (openMobile && onMobileClose) {
      onMobileClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  const content = (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
      }}
    >
      <Scrollbar options={{ suppressScrollX: true }}>
        <Box
          sx={{
            display: {
              lg: 'none',
              xs: 'flex',
            },
            justifyContent: 'center',
            p: 2,
          }}
        >
          <RouterLink to="/">
            <Logo
              sx={{
                height: 16,
                width: 85,
              }}
            />
          </RouterLink>
        </Box>
        <Box
          sx={{
            borderRadius: 1,
            p: 2,
          }}
        >
          <Box
            sx={{
              alignItems: 'center',
              backgroundColor: 'background.default',
              borderRadius: 1,
              display: 'flex',
              overflow: 'hidden',
              p: 2,
            }}
          >
            <Box sx={{ ml: 2 }}>
              <Typography color="textPrimary" variant="subtitle2">
                {user.name} ({user.email})
              </Typography>
              <Typography color="textSecondary" variant="subtitle2">
                {user.type}
              </Typography>
            </Box>
          </Box>
          <Box sx={{ mt: 2 }}>
            {isPartner && (
              <Autocomplete
                size="small"
                disableClearable
                value={currentPartnerProvider}
                options={partnerProviderMenus}
                getOptionLabel={(option) => option.providerName}
                onChange={(event, option: ProviderMenuModel) => {
                  handleChangePartnerProvider(option);
                }}
                isOptionEqualToValue={(option: ProviderMenuModel, value: ProviderMenuModel) =>
                  option.token === value.token
                }
                renderInput={(props) => <TextField label="입점사 선택" {...props} />}
              />
            )}
          </Box>
        </Box>
        <Divider />
        <NavSections sections={sections} pathname={location.pathname} />
        <Divider />
        <NavOfficeBanner
          title={isManagerOffice ? 'Operation Office' : 'Partner Data'}
          subtitle="정산 조회/관리"
          ssoKey={isManagerOffice ? 'sso_manager' : 'sso_partner'}
          url={isManagerOffice ? pathConfig.operationOfficeUrl : pathConfig.partnerDataUrl}
          secure={!env.isLocally}
        />
      </Scrollbar>
    </Box>
  );

  if (lgUp) {
    return (
      <Drawer
        anchor="left"
        open
        PaperProps={{
          sx: {
            backgroundColor: 'background.paper',
            height: 'calc(100% - 64px) !important',
            top: '64px !Important',
            width: 280,
          },
        }}
        variant="permanent"
      >
        {content}
      </Drawer>
    );
  }

  return (
    <Drawer
      anchor="left"
      onClose={onMobileClose}
      open={openMobile}
      PaperProps={{
        sx: {
          backgroundColor: 'background.paper',
          width: 280,
        },
      }}
      variant="temporary"
    >
      {content}
    </Drawer>
  );
};

OfficeSidebar.propTypes = {
  onMobileClose: PropTypes.func,
  openMobile: PropTypes.bool,
};

export default OfficeSidebar;
