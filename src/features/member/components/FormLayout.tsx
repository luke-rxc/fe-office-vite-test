import styled from '@emotion/styled';
import { ReactNode } from 'react';

interface Props {
  label: string;
  children: ReactNode;
  required?: boolean;
}

export const FormLayout = ({ children, label, required = false }: Props) => {
  return (
    <WrapperStyled>
      <LabelWrapperStyled>
        <LabelItemStyled>
          {label}
          {required && <LegendStyled>*</LegendStyled>}
        </LabelItemStyled>
      </LabelWrapperStyled>
      <ContentStyled>{children}</ContentStyled>
    </WrapperStyled>
  );
};

const WrapperStyled = styled.div`
  display: flex;
  flex: 1;
  flex-direction: row;
  width: 100%;
  height: 100%;
  min-height: 40px;
`;

const LabelWrapperStyled = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 160px;
  margin-right: 20px;
  border-radius: 4px;
`;
const LabelItemStyled = styled.span`
  position: relative;
  font-weight: bold;
  font-size: 0.875rem;
  text-align: center;
  background: linear-gradient(to top, ${({ theme }) => theme.palette.divider} 50%, transparent 50%);
`;
const ContentStyled = styled.div`
  flex: 1;
  padding: 10px;
  font-size: 0.875rem;
  background-color: ${({ theme }) => theme.palette.background.paper};
`;

const LegendStyled = styled.span`
  position: absolute;
  top: 0;
  right: -12px;
  color: #ff0000;
  font-size: 18px;
`;
