import React from 'react';
import type { ReactNode } from 'react';
import { ListTitle } from '@components/ListTitle';
import { ListItem, Typography } from '@material-ui/core';

/**
 * 컨텐츠 폼 리스트 레이아웃
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
  children: React.ReactNode;
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

export const GuideText = ({ title = '', desc = [] }: { title?: string; desc?: ReactNode[] }) => {
  return (
    <>
      <Typography color="primary" variant="subtitle2">
        {title}
      </Typography>
      {desc.map((description, index) => (
        <React.Fragment key={index}>
          <Typography sx={{ ml: 1 }} variant="caption">
            {description}
          </Typography>
          {index !== desc.length - 1 && <br />}
        </React.Fragment>
      ))}
    </>
  );
};
