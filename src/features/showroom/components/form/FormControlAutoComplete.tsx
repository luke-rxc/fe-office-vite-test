import { FieldValues } from 'react-hook-form';
import { FormControlAutoComplete as AutoComplete, Props as AutoCompleteProps } from '@components/form';
import { AutoCompleteFieldValue } from '../../types';

export type FormControlAutoCompleteProps<T extends FieldValues> = AutoCompleteProps<T>;

/**
 * 공통 FormControlAutoComplete에서 반복적으로 적용되는 props를 미리 설정해둔 컴포넌트
 */
export const FormControlAutoComplete = <T extends FieldValues>({
  ChipProps,
  ...props
}: FormControlAutoCompleteProps<T>) => (
  <AutoComplete<T>
    getOptionLabel={({ name = '' }: AutoCompleteFieldValue) => name}
    filterSelectedOptions={false}
    ChipProps={
      // @todo 추후 form 요소에 readonly 스타일 적용시 opacity 제거
      props.disabled ? { ...ChipProps, onDelete: undefined, disabled: true, style: { opacity: 0.6 } } : ChipProps
    }
    isOptionEqualToValue={(v: AutoCompleteFieldValue, o: AutoCompleteFieldValue) => v?.id === o?.id}
    {...props}
  />
);
