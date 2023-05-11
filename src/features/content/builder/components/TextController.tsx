import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { Box } from '@material-ui/core';
import { ControlColorPicker } from './ControlColorPicker';
import { ControlTextBold } from './ControlTextBold';
import { ControlTextSize } from './ControlTextSize';
import { FormControlInput, FormControlInputProps } from './form';
import { ControlTextBoldProps } from './ControlTextBold';
import { ControlColorPickerProps } from './ControlColorPicker';
import { ControlTextSizeProps } from './ControlTextSize';

/**
 * 텍스트 컨트롤러
 * - 텍스트 입력, 컬러, bold, 사이즈 설정
 */

type TextControlProps = {
  textInputProps?: FormControlInputProps<any>; // 인풋 텍스트
  textBoldProps?: ControlTextBoldProps<any>; //  bold
  textColorProps?: ControlColorPickerProps<any>; // 색상
  textSizeProps?: ControlTextSizeProps<any>; //  사이즈
};

export const TextController = ({ textInputProps, textBoldProps, textColorProps, textSizeProps }: TextControlProps) => {
  const { setValue } = useFormContext();
  const [text, setText] = useState(textInputProps?.defaultValue ?? '');
  const maxNum = textInputProps?.inputProps?.max;
  return (
    <>
      {/* 텍스트 인풋 */}
      {textInputProps?.name && (
        <Box sx={{ width: '100%' }}>
          <FormControlInput
            sx={{ width: '100%' }}
            defaultValue={textInputProps?.defaultValue}
            onChangeText={(value) => {
              // 개행 특수문자 처리
              const encodeValue = encodeURIComponent(value).replaceAll('%E2%80%A8', '%0A');
              const decodeValue = decodeURIComponent(encodeValue);
              setValue(`${textInputProps.name}`, decodeValue);
              setText(value);
            }}
            {...textInputProps}
          />
          <Box sx={{ textAlign: 'right', color: '#666', fontSize: '14px' }}>
            {maxNum && (
              <>
                <strong style={{ color: `${text.length > maxNum ? '#f54437' : ''}` }}>{text.length}</strong>
                &nbsp;/&nbsp;{maxNum}
              </>
            )}
          </Box>
        </Box>
      )}
      <Box sx={{ mt: 2 }}>
        <>
          {/* 글자 볼드 */}
          {textBoldProps?.name && <ControlTextBold sx={{ display: 'inline', mr: 1 }} {...textBoldProps} />}
          {/* 글자 색상 */}
          {textColorProps?.name && <ControlColorPicker sx={{ display: 'inline', mr: 1 }} {...textColorProps} />}
          {/* 글자 사이즈 */}
          {textSizeProps?.name && <ControlTextSize sx={{ display: 'inline' }} {...textSizeProps} />}
        </>
      </Box>
    </>
  );
};
