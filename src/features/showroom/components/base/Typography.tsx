import styled from '@emotion/styled';
import {
  Typography as MuiTypography,
  TypographyProps as MuiTypographyProps,
  typographyClasses,
  svgIconClasses,
} from '@material-ui/core';

export interface TypographyProps extends Omit<MuiTypographyProps<'div'>, 'prefix'> {
  block?: boolean;
  prefix?: React.ReactNode;
}

/**
 * 좌측에 데코레이션 아이템을 추가할 수 있는 텍스트 컴포넌트
 */
export const Typography = styled(({ block, prefix, children, ...props }: TypographyProps) => {
  return (
    <MuiTypography component="div" {...props}>
      {prefix && <span className="typo-deco">{prefix}</span>}
      <span className="typo-content">{children}</span>
    </MuiTypography>
  );
})`
  .${typographyClasses.root} {
    display: ${({ block }) => (block ? 'block' : 'inline-block')};
  }

  .typo-deco {
    display: block;
    overflow: hidden;
    float: left;

    .${svgIconClasses.root} {
      display: block;
      width: 1em;
      height: 1em;
      margin: 0.3em 5px 0 0;
      font-size: inherit;
    }
  }

  .typo-content {
    display: block;
    overflow: hidden;
  }
`;
