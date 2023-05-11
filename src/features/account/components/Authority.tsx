import React from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { Card, CardHeader, CardContent, Divider, Chip } from '@material-ui/core';
import { Switch } from '@components/Switch';
import { AuthorityModel } from '../models';

const useStyles = makeStyles((theme: Theme) => ({
  role: {
    margin: '2px',
  },
  roleNothing: {
    margin: '1px',
  },
}));

interface Props {
  authority: AuthorityModel;
}

export const Authority: React.FC<Props> = ({ authority }) => {
  const styles = useStyles();
  const { isRoot, roleList } = authority;
  const isRoleListView = roleList && roleList.length > 0;

  return (
    <Card>
      <CardHeader title="권한 정보" />
      <Divider />
      <CardContent>
        <Switch label="최고 관리자 권한" disabled checked={isRoot} />
      </CardContent>
      <CardContent>
        {isRoleListView ? (
          roleList.map(({ label }) => <Chip key={label} label={label} variant="outlined" className={styles.role} />)
        ) : (
          <Chip className={styles.roleNothing} label="부여된 권한 리스트가 없습니다" />
        )}
      </CardContent>
    </Card>
  );
};
