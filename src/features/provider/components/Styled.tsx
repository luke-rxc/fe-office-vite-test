import React from 'react';
import type { ReactNode } from 'react';
import { ListItem } from '@material-ui/core';
import { ListTitle } from '@components/ListTitle';

/**
 * 컨텐츠 폼 리스트 레이아웃
 */
export const ListItemWrapper = ({
  listTitleName,
  isRequired,
  children,
  sx,
}: {
  listTitleName?: ReactNode;
  isRequired?: boolean;
  children: React.ReactNode;
  sx?: any;
}) => (
  <ListItem sx={{ mt: 2, ...sx }}>
    {listTitleName && <ListTitle name={listTitleName} isRequired={isRequired} width={200} />}
    {children}
  </ListItem>
);
