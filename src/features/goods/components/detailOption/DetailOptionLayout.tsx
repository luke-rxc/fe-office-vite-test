import React from 'react';
import styled from '@emotion/styled';
import { Card, CardContent, CardHeader, Divider, Link } from '@material-ui/core';

export const DetailOptionLayout: React.FC = ({ children }) => {
  return (
    <Card>
      <CardHeaderStyled
        title="옵션정보"
        action={
          <Link
            href="https://rxc.notion.site/968269a718fb46c4969c96f4d13c536f"
            target="_blank"
            sx={{ fontSize: '0.875rem', fontWeight: 500, ml: '8px' }}
          >
            옵션명 가이드
          </Link>
        }
      />
      <Divider />
      <CardContent>{children}</CardContent>
    </Card>
  );
};

const CardHeaderStyled = styled(CardHeader)`
  display: inline-block;
  & > div {
    display: inline-block;
  }
`;
