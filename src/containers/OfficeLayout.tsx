import { useState } from 'react';
import type { FC, ReactNode } from 'react';
import { Outlet } from 'react-router-dom';
import { experimentalStyled } from '@material-ui/core/styles';
import OfficeNavbar from './OfficeNavbar';
import OfficeSidebar from './OfficeSidebar';

interface OfficeLayoutProps {
  children?: ReactNode;
  isSidebarHide?: boolean;
  isNavbarHide?: boolean;
}

const OfficeLayoutRoot = experimentalStyled('div')(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  display: 'flex',
  height: '100%',
  overflow: 'hidden',
  width: '100%',
}));

const OfficeLayoutWrapper = experimentalStyled('div')<{ styleProps: Omit<OfficeLayoutProps, 'children'> }>(
  ({ theme, styleProps }) => ({
    display: 'flex',
    flex: '1 1 auto',
    overflow: 'hidden',
    paddingTop: styleProps.isNavbarHide ? 0 : '64px',
    [theme.breakpoints.up('lg')]: {
      paddingLeft: styleProps.isSidebarHide ? 'inherit' : '280px',
    },
  }),
);

const OfficeLayoutContainer = experimentalStyled('div')({
  display: 'flex',
  flex: '1 1 auto',
  overflow: 'hidden',
});

const OfficeLayoutContent = experimentalStyled('div')({
  flex: '1 1 auto',
  height: '100%',
  overflow: 'auto',
  position: 'relative',
  WebkitOverflowScrolling: 'touch',
});

const OfficeLayout: FC<OfficeLayoutProps> = ({ isNavbarHide = false, isSidebarHide = false }) => {
  const [isSidebarMobileOpen, setIsSidebarMobileOpen] = useState<boolean>(false);

  return (
    <OfficeLayoutRoot>
      {isNavbarHide === false && <OfficeNavbar onSidebarMobileOpen={(): void => setIsSidebarMobileOpen(true)} />}
      {isSidebarHide === false && (
        <OfficeSidebar onMobileClose={(): void => setIsSidebarMobileOpen(false)} openMobile={isSidebarMobileOpen} />
      )}
      <OfficeLayoutWrapper
        styleProps={{
          isNavbarHide,
          isSidebarHide,
        }}
      >
        <OfficeLayoutContainer>
          <OfficeLayoutContent>
            <Outlet />
          </OfficeLayoutContent>
        </OfficeLayoutContainer>
      </OfficeLayoutWrapper>
    </OfficeLayoutRoot>
  );
};

export default OfficeLayout;
