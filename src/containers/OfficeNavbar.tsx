import type { FC } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import { AppBar, Box, IconButton, Toolbar } from '@material-ui/core';
import { experimentalStyled } from '@material-ui/core/styles';
import type { AppBarProps } from '@material-ui/core';
import MenuIcon from '../assets/icons/Menu';
import AccountPopover from '../components/AccountPopover';
import Logo from '../components/Logo';
import styled from '@emotion/styled';
import { env } from '@config';

interface OfficeNavbarProps extends AppBarProps {
  onSidebarMobileOpen?: () => void;
}

const OfficeNavbarRoot = experimentalStyled(AppBar)(({ theme }) => ({
  ...(theme.palette.mode === 'light' && {
    backgroundColor: theme.palette.primary.main,
    boxShadow: 'none',
    color: theme.palette.primary.contrastText,
  }),
  ...(theme.palette.mode === 'dark' && {
    backgroundColor: theme.palette.background.paper,
    borderBottom: `1px solid ${theme.palette.divider}`,
    boxShadow: 'none',
  }),
  zIndex: theme.zIndex.drawer + 100,
}));

const OfficeNavbar: FC<OfficeNavbarProps> = (props) => {
  const { onSidebarMobileOpen, ...other } = props;
  const toolbarColor = !env.isProduction ? '#f35958' : undefined;

  return (
    <OfficeNavbarRoot {...other}>
      <ToolbarStyled color={toolbarColor}>
        <IconButton
          color="inherit"
          onClick={onSidebarMobileOpen}
          sx={{
            display: {
              lg: 'none',
            },
          }}
        >
          <MenuIcon fontSize="small" />
        </IconButton>
        <RouterLink to="/">
          <Logo
            sx={{
              display: {
                lg: 'inline',
                xs: 'none',
              },
              height: 20,
              width: 107,
            }}
          />
        </RouterLink>
        <Box
          sx={{
            flexGrow: 1,
            ml: 2,
          }}
        />
        <Box sx={{ ml: 2 }}>
          <AccountPopover />
        </Box>
      </ToolbarStyled>
    </OfficeNavbarRoot>
  );
};

OfficeNavbar.propTypes = {
  onSidebarMobileOpen: PropTypes.func,
};

const ToolbarStyled = styled(Toolbar)<{ color: string }>`
  min-height: 64px;
  background-color: ${({ color }) => color || '#5664d2'};
`;

export default OfficeNavbar;
