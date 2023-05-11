import type { FC, ReactNode } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

interface PermissionGuardProps {
  pairKey: string;
  children?: ReactNode;
}

const PermissionGuard: FC<PermissionGuardProps> = (props) => {
  const { pairKey, children } = props;
  const { permissions } = useAuth();

  if (!permissions.includes(pairKey)) {
    return <Navigate to={'/401'} />;
  }

  return children ? <>{children}</> : <Outlet />;
};

export default PermissionGuard;
