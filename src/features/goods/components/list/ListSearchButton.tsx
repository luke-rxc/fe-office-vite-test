import React from 'react';
import { Button } from '@material-ui/core';
import SearchIcon from '@assets/icons/Search';
import RefreshIcon from '@assets/icons/Refresh';

export const ListSearchButton: React.FC = () => {
  return (
    <>
      <Button
        color="primary"
        startIcon={<SearchIcon fontSize="small" />}
        size="large"
        variant="contained"
        type="submit"
        fullWidth
      >
        검색
      </Button>
      <Button
        color="secondary"
        startIcon={<RefreshIcon fontSize="small" />}
        size="large"
        variant="contained"
        type="reset"
        fullWidth
        sx={{ mt: 2 }}
      >
        초기화
      </Button>
    </>
  );
};
