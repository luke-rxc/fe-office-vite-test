import type { FC, ReactNode } from 'react';
import { Typography } from '@material-ui/core';
import type { TypographyProps } from '@material-ui/core';
import AcUnit from '@material-ui/icons/AcUnit';
import { makeStyles } from '@material-ui/core/styles';
import { red } from '@material-ui/core/colors';

export interface ListTitleProps extends TypographyProps {
  name?: ReactNode;
  isRequired?: boolean;
  width?: number | string;
}

const useStyles = makeStyles((theme) => {
  return {
    icon: {
      marginLeft: theme.spacing(0.5),
      width: 10,
      height: 10,
      color: red[500],
    },
  };
});

export const ListTitle: FC<ListTitleProps> = ({ name, isRequired, width, sx }) => {
  const classes = useStyles();
  return (
    <Typography
      color="textPrimary"
      variant="subtitle2"
      paragraph={true}
      sx={{ m: 0, width: width ? width : 100, ...sx }}
    >
      <span>{name || ''}</span>
      {isRequired && <AcUnit className={classes.icon} />}
    </Typography>
  );
};
