import styled from '@emotion/styled';
import { CardHeader, CardContent } from '@material-ui/core';

export const CardHeaderStyled = styled(CardHeader)`
  .MuiCardHeader-title {
    font-size: 1rem;
  }
`;

export const CardContentStyled = styled(CardContent)<{ color?: string }>`
  & {
    padding-top: 0;
    background-color: ${({ theme }) => theme.palette.background.paper};

    > div {
      > div:not(.chip) {
        background-color: ${({ theme }) => theme.palette.background.paper};
      }

      > span {
        background: linear-gradient(to top, #cccccc 50%, transparent 50%);
      }
    }
  }
`;
