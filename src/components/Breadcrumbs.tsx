import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Breadcrumbs as BreadcrumbsMaterial, Link, Typography } from '@material-ui/core';
import ChevronRightIcon from '@assets/icons/ChevronRight';

export interface IBreadcrumbs {
  path?: string;
  text: string;
}

/** interface for Breadcrumbs */
export interface IBreadcrumbsProps {
  /** 로케이션 데이터 */
  locations?: Array<IBreadcrumbs>;
}

/**
 * 페이지 로케이션을 표시하는 컴포넌트
 *
 * @example
 * ```
 * import { Breadcrumbs } from '../components/Breadcrumbs';
 *
 * const locations = React.useMemo(() => ([{path: '/path', text: 'location'}]), []);
 * <Breadcrumbs locations={locations} />
 * ```
 */
export const Breadcrumbs = ({ locations }: IBreadcrumbsProps) => (
  <BreadcrumbsMaterial aria-label="breadcrumb" separator={<ChevronRightIcon fontSize="small" />} sx={{ mt: 1 }}>
    {locations.map(({ path, text }) =>
      path ? (
        <Link key={text} color="textPrimary" component={RouterLink} to={path} variant="subtitle2">
          {text}
        </Link>
      ) : (
        <Typography key={text} color="textSecondary" variant="subtitle2">
          {text}
        </Typography>
      ),
    )}
  </BreadcrumbsMaterial>
);
