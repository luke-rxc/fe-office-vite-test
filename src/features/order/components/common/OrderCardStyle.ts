import styled from '@emotion/styled';
import { Card } from '@material-ui/core';

export const CardStyled = styled(Card)<{ targetid: string }>`
  border: none;

  .MuiCardContent-root {
    padding: '0 16px 24px';
  }

  ${({ targetid }) =>
    targetid &&
    `
    tr[class*='row_${targetid}'] {
      background: #deebff;
    }
  `}
`;
