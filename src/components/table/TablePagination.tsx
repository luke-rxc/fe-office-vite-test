import { MouseEvent } from 'react';

import { Grid, makeStyles, MenuItem, Pagination, Select } from '@material-ui/core';

interface Props {
  page: number;
  total: number;
  limit: number;
  rowsPerPageOptions?: Array<number>;
  onChangePage: (newPage: number, isDispatch?: boolean) => void;
  onChangeLimit: (limit: number) => void;
  showFirstButton: boolean;
  showLastButton: boolean;
}

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
  },
  paginationToolbar: {
    display: 'flex',
    alignItems: 'center',
    padding: '16px 16px',

    '& > .spacer': {
      flex: '1 1 100%',
    },

    '& > :not(.spacer)': {
      marginLeft: '5px',
      display: 'inline-flex',
      flexShrink: '0',
    },

    '& > div > .label': {
      display: 'inline-flex',
      flexShrink: '0',
      margin: '0 10px 0 0',
      alignItems: 'center',
    },

    '& > .MuiSelect-select': {
      width: 80,
      paddingRight: '0 !important',
    },
  },
}));

export const DEFAULT_PAGE_NUMBER = 1;
export const DEFAULT_PAGE_LIMIT = 25;

export const TablePagination = ({
  page,
  total,
  limit,
  rowsPerPageOptions = [10, 25, 50, 100],
  onChangePage,
  onChangeLimit,
  showFirstButton,
  showLastButton,
}: Props) => {
  const classes = useStyles();

  if (page < DEFAULT_PAGE_NUMBER) {
    window.console.warn(`Table pagination page는 ${DEFAULT_PAGE_NUMBER}보다 작을수 없습니다.`);
  }

  if (!rowsPerPageOptions.includes(limit)) {
    window.console.warn(`설정한 Table pagination limit가 rowsPerPageOptions에 포함되지 않았습니다.`);
  }

  const handleChangePage = (event: MouseEvent<HTMLButtonElement> | null, newPage: number): void => {
    onChangePage(newPage);
  };

  const handleChangeLimit = (event: React.ChangeEvent<{ value: number }>): void => {
    onChangePage(1, false);
    onChangeLimit(event.target.value);
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={2}>
        <div className={classes.paper}>전체: {total}</div>
      </Grid>
      <Grid item xs={10}>
        <div className={classes.paginationToolbar}>
          <div className="spacer" />
          <div>
            <p className="label">페이지 수:</p>
            <Select id="demo-simple-select" value={limit} variant="standard" onChange={handleChangeLimit}>
              {rowsPerPageOptions.map((option) => (
                <MenuItem value={option} key={`option-${option}`}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </div>
          <Pagination
            count={Math.ceil(total / limit)}
            page={page}
            onChange={handleChangePage}
            variant="outlined"
            shape="rounded"
            showFirstButton={showFirstButton}
            showLastButton={showLastButton}
          />
        </div>
      </Grid>
    </Grid>
  );
};
