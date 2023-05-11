import React from 'react';
import {
  Tooltip,
  TooltipProps,
  IconButton as IconButtonMaterial,
  IconButtonProps,
  IconProps,
  SvgIconProps,
} from '@material-ui/core';

/** interface for IconButton */
export interface IIconButtonProps extends Omit<IconButtonProps, 'title'> {
  icon: React.ReactElement<SvgIconProps>;
  title?: TooltipProps['title'];
  placement?: TooltipProps['placement'];
  fontSize?: IconProps['fontSize'];
}

/**
 * Tooltip 기능이 있는 아이콘 버튼 컴포넌트
 *
 * @example
 * ```
 *  <IconButton icon={<AcUnitTwoTone />} title="tooltip text" />
 * ```
 */
export const IconButton = React.forwardRef<HTMLButtonElement, IIconButtonProps>(
  ({ title = '', placement, icon, fontSize, ...props }, ref) => {
    return (
      <Tooltip title={title} placement={placement}>
        <span>
          <IconButtonMaterial {...props} ref={ref} children={icon} />
        </span>
      </Tooltip>
    );
  },
);
