import isString from 'lodash/isString';
import { Fragment } from 'react';
import { styled } from '@material-ui/styles';
import { Tooltip as MuiTooltip, tooltipClasses } from '@material-ui/core';

/**
 * 스타일링된 Tooltip 컴포넌트
 */
export const Tooltip = styled(({ title, className, ...props }) => {
  return (
    <MuiTooltip arrow classes={{ popper: className }} title={isString(title) ? lineBreak(title) : title} {...props} />
  );
})(() => ({
  [`& .${tooltipClasses.tooltip}`]: {
    fontSize: 12,
    borderRadius: 5,
    wordBreak: 'keep-all',
    overflowWrap: 'anywhere',
  },
}));

/**
 * 줄바꿈처리
 */
const lineBreak = (text: string) => {
  const newLineRegExp = /(\\n)/g;
  const splitText = text.trim().split(newLineRegExp);

  return splitText.map((text, index) => {
    const key = `${text}+${index}`;

    // 줄바꿈 요소
    if (newLineRegExp.test(text)) {
      return <br key={key} />;
    }

    // 택스트
    return <Fragment key={key}>{text}</Fragment>;
  });
};
