import type { ReactNode } from 'react';
import { ListItem } from '@material-ui/core';
import { ListTitle } from '@components/ListTitle';

/**
 * 폼 리스트 레이아웃
 * @param param0
 * @returns
 */
export const ListItemWrapper = ({
  listTitleName,
  listTitleWidth = 200,
  isRequired,
  children,
}: {
  listTitleName?: ReactNode;
  listTitleWidth?: number;
  isRequired?: boolean;
  children: ReactNode;
}) => (
  <ListItem sx={{ mt: 2 }}>
    {listTitleName && (
      <ListTitle
        name={listTitleName}
        isRequired={isRequired}
        width={listTitleWidth}
        sx={{ display: 'flex', alignItems: 'center' }}
      />
    )}
    {children}
  </ListItem>
);
