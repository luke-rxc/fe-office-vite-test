import React from 'react';
import { Controller, ControllerProps } from 'react-hook-form';

/**
 * 폼요소를 react-hook-form의 Controller로 랩핑한 HOC
 * @todo props로 전달받은 control에 따라 name prop이 type check 되도록 수정
 */
export function withHookFormController<P extends object, V = any>(
  Component: React.ComponentType<any>,
  defaultProps?: Partial<P>,
) {
  return ({
    name,
    rules,
    shouldUnregister,
    defaultValue,
    control,
    ...props
  }: P & Omit<ControllerProps<V>, 'render'>) => {
    return (
      <Controller
        name={name}
        rules={rules}
        control={control}
        defaultValue={defaultValue}
        shouldUnregister={shouldUnregister}
        render={({ field }) => <Component {...defaultProps} {...field} {...props} checked={field.value} />}
      />
    );
  };
}
