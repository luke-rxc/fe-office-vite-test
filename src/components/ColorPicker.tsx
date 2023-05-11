import React from 'react';
import { SketchPicker, ColorResult } from 'react-color';
import { Box, TextField, InputAdornment, TextFieldProps, Popover, PopoverProps } from '@material-ui/core';

export interface IColorPickerProps
  extends Omit<TextFieldProps, 'onChange' | 'value' | 'defaultValue'>,
    Pick<PopoverProps, 'anchorOrigin'> {
  value?: string;
  defaultValue?: string;
  onChange?: (color: Partial<ValueOf<ColorResult>>, event?: React.ChangeEvent) => any;
}

/**
 * ColorPicker 컴포넌트
 *
 * @todo 현재는 color picker에서 사용할 수 있는 값은 hex만 가능하기 때문에 rgb등의 다른 색상포멧도 활용가능하도록 수정필요
 * @todo icon을 변경할 수 있도록 옵션 추가
 * @example
 * ```
 * <ColorPicker
 *   label="color picker"
 *   onChange={(color: Partial<ValueOf<ColorResult>>, event?: React.ChangeEvent) => {}}
 * />
 * ```
 */
export const ColorPicker = React.forwardRef<any, IColorPickerProps>(
  ({ anchorOrigin, value, InputProps, defaultValue, size, disabled, onChange, ...props }, ref) => {
    const anchorEl = React.useRef(null);
    const [color, setColor] = React.useState<string>(value ?? defaultValue ?? '');
    const [isOpen, setOpenState] = React.useState(false);

    /**
     * ColorPicker popup show
     */
    const handleShowClosePicker = () => {
      !disabled && setOpenState(true);
    };

    /**
     * ColorPicker popup hide
     */
    const handleHideClosePicker = () => {
      setOpenState(false);
    };

    /**
     * color값 변경
     */
    const handleChangeColorPicker = (color: ColorResult) => {
      setColor(color?.hex);
    };

    /**
     * onChange props의 실행은 마지막 변경시에만 발생하도록 onChangeComplete를 활용
     */
    const handleChangeComplete = (color: ColorResult, event: React.ChangeEvent<HTMLInputElement>) => {
      setColor(color?.hex);
      onChange && onChange(color?.hex, event);
    };

    /**
     * input에 직접 입력시 색상 변경
     */
    const handleChangeColor = (event: React.ChangeEvent<HTMLInputElement>) => {
      const color = event?.target?.value;

      setColor(color);
      onChange && onChange(color, event);
    };

    React.useEffect(() => {
      setColor(value);
    }, [value]);

    return (
      <>
        <TextField
          ref={anchorEl}
          variant="outlined"
          value={color}
          size={size}
          disabled={disabled}
          onChange={handleChangeColor}
          onClick={handleShowClosePicker}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Box
                  sx={{
                    height: '20px',
                    width: '20px',
                    border: '1px solid black',
                    borderRadius: '50%',
                    background: color,
                    opacity: disabled ? 0.5 : 1,
                  }}
                />
              </InputAdornment>
            ),
            ...InputProps,
          }}
          {...props}
        />
        <Popover
          open={isOpen}
          anchorOrigin={anchorOrigin || { vertical: 'bottom', horizontal: 'left' }}
          anchorEl={anchorEl.current}
          onClose={handleHideClosePicker}
        >
          <SketchPicker
            ref={ref}
            color={color}
            onChange={handleChangeColorPicker}
            onChangeComplete={handleChangeComplete}
          />
        </Popover>
      </>
    );
  },
);
