import React from 'react';
import { TextField, TextFieldProps } from '@material-ui/core';
import {
  LocalizationProvider,
  DatePicker as DatePickerMaterial,
  DateTimePicker as DateTimePickerMaterial,
  DatePickerProps,
} from '@material-ui/lab';
import AdapterDateFns from '@material-ui/lab/AdapterDateFns';
import koLocale from 'date-fns/locale/ko';

export interface IDatePickerProps<D = unknown> extends Omit<DatePickerProps, 'value' | 'renderInput' | 'onChange'> {
  /** 입력 폼 name id */
  id?: TextFieldProps['id'];
  /** 입력 폼 name attribute */
  name?: TextFieldProps['name'];
  /** 데이터 에러 유무 */
  error?: TextFieldProps['error'];
  /** 화면에 표시할 helper text */
  helperText?: TextFieldProps['helperText'];
  /** 날짜 */
  value?: DatePickerProps['value'];
  /** 초기 값 */
  defaultValue?: DatePickerProps['value'];
  /** 시간까지 선택이 필요한가? */
  dateTime?: boolean;
  /** FieldText 컴포넌트에 적용될 Props */
  fieldProps?: Omit<TextFieldProps, 'id' | 'name'>;
  /** FieldText FullField 여부 */
  fullWidth?: boolean;
  /** onChange로 반환되는 파라미터를 가공해야하는 경우 사용 */
  callbackDateConverter?: (date: Date) => D;
  /** 화면에 표시될 Input 정의 */
  renderInput?: DatePickerProps['renderInput'];
  /** change event handler */
  onChange?: DatePickerProps<D>['onChange'];
}

/**
 * DatePiker 컴포넌트 날짜(혹은 시간까지)를 선택할수 있는 dialogs를 제공
 *
 * @link https://next.material-ui.com/components/date-picker/
 * @example
 * ```
 *  <DatePicker
 *    dateTime
 *    label="Text"
 *    format="yy/MM/dd HH:mm"
 *    mask="__/__/__ __:__"
 *  />
 * ```
 */
export const DatePicker = React.forwardRef<HTMLInputElement, IDatePickerProps>(
  (
    {
      id,
      name,
      error,
      helperText,
      value,
      dateTime,
      defaultValue = new Date(),
      fieldProps,
      inputFormat,
      mask,
      fullWidth = true,
      renderInput,
      onChange,
      callbackDateConverter = (date) => date,
      ...props
    },
    ref,
  ) => {
    /** 시간선택기능 여부에 따라 컴포넌트, 기본 텍스트 포멧 분기처리 */
    const [Picker, defaultFormat, defaultMask] = React.useMemo(() => {
      return dateTime
        ? [DateTimePickerMaterial, 'yyyy/MM/dd HH:mm', '____/__/__ __:__']
        : [DatePickerMaterial, 'yyyy/MM/dd', '____/__/__'];
    }, [dateTime]);

    const [selectValue, setSelectValue] = React.useState<Date | unknown>(value || defaultValue);

    const handleChange = (newValue: Date, keyboardInputValue?: string) => {
      setSelectValue(newValue);
      onChange && onChange(callbackDateConverter(newValue), keyboardInputValue);
    };

    /** componentDidMount & updated "value" props */
    React.useEffect(() => {
      setSelectValue(value);
    }, [value]);

    return (
      <LocalizationProvider locale={koLocale} dateAdapter={AdapterDateFns}>
        <Picker
          value={selectValue}
          onChange={handleChange}
          inputFormat={inputFormat || defaultFormat}
          mask={mask || defaultMask}
          renderInput={
            renderInput ||
            ((fieldProps) => (
              <TextField
                {...fieldProps}
                fullWidth={fullWidth}
                ref={ref}
                id={id}
                name={name}
                error={error}
                helperText={helperText}
              />
            ))
          }
          {...props}
        />
      </LocalizationProvider>
    );
  },
);
