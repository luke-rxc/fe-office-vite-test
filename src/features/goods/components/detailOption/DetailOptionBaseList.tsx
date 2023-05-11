import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, Fab } from '@material-ui/core';
import MinusIcon from '@assets/icons/Minus';
import { TextField } from '../form';

interface Props {
  items: Record<'id', string>[];
  onRemove: (index: number | number[]) => void;
}

const useStyles = makeStyles(() => ({
  grid: {
    display: 'flex',
    alignItems: 'center',
  },
}));

export const DetailOptionBaseList: React.FC<Props> = ({ items, onRemove }) => {
  const classes = useStyles();
  if (!(items && items.length)) {
    return null;
  }

  return (
    <Grid container spacing={1} justifyContent="center">
      {items.map(({ id }, index) => {
        const handleRemove = () => onRemove(index);
        return (
          <React.Fragment key={id}>
            <Grid item md={5} xs={12} className={classes.grid}>
              <TextField
                label="옵션명"
                name={`optionBases[${index}].title`}
                variant="outlined"
                placeholder="예시) 색상"
                fullWidth
              />
            </Grid>
            <Grid item md={5} xs={12} className={classes.grid}>
              <TextField
                label="옵션값"
                name={`optionBases[${index}].value`}
                variant="outlined"
                placeholder="예시) 화이트, 블랙"
                fullWidth
              />
            </Grid>
            <Grid item md={1} xs={12} className={classes.grid}>
              <Fab aria-label="add" size="small" onClick={handleRemove}>
                <MinusIcon />
              </Fab>
            </Grid>
          </React.Fragment>
        );
      })}
    </Grid>
  );
};
