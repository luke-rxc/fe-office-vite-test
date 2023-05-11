import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Button } from '@material-ui/core';
import { Layout } from '@components/Layout';
import PlusIcon from '@assets/icons/Plus';
import { GoodsLink } from '../../constants';

interface Props {
  children: React.ReactNode;
}

export const ListLayout: React.FC<Props> = ({ children }) => {
  return (
    <Layout
      title="상품 조회"
      locations={[{ path: '/', text: '홈' }, { text: '상품 관리' }, { text: '상품 조회' }]}
      actions={[
        <Button
          key="actionsButton"
          component={RouterLink}
          startIcon={<PlusIcon fontSize="small" />}
          sx={{ m: 1 }}
          to={GoodsLink.New}
          variant="contained"
        >
          상품 등록
        </Button>,
      ]}
    >
      {children}
    </Layout>
  );
};
