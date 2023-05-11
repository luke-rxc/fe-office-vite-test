import React, { ReactNode } from 'react';
import { ListItem, Typography } from '@material-ui/core';
import { ListTitle } from '@components/ListTitle';

/**
 * 콘텐츠 폼 리스트 레이아웃
 * @param param0
 * @returns
 */
export const ListItemWrapper = ({
  listTitleName,
  isRequired,
  children,
}: {
  listTitleName?: ReactNode;
  isRequired?: boolean;
  children: React.ReactNode;
}) => (
  <ListItem sx={{ mt: 2 }}>
    {listTitleName && <ListTitle name={listTitleName} isRequired={isRequired} width={200} />}
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
