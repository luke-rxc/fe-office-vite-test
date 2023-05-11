import React, { useCallback } from 'react';
import { useFormContext } from 'react-hook-form';
import { CategoryListModel } from '../models';
import { SearchCategoryInfoProp } from '../types';
import { Select } from './form';

interface Props {
  formFieldKeys: string[];
  infos: CategoryListModel[][];
  onChange: ({ depth, value }: SearchCategoryInfoProp) => void;
}

export const GoodsCategory: React.FC<Props> = ({ formFieldKeys, infos, onChange }) => {
  const { setValue } = useFormContext();
  const handleChange = useCallback(
    ({ depth, value }: SearchCategoryInfoProp) => {
      formFieldKeys.forEach((fieldKey, idx) => {
        if (idx >= depth) {
          setValue(fieldKey, '');
        }
      });
      onChange({ depth, value });
    },
    [formFieldKeys, onChange, setValue],
  );

  return (
    <>
      {formFieldKeys.map((fieldKey, idx) => {
        const options = infos[idx];
        const isDisabled = !(options && options.length);
        return (
          <Select
            key={fieldKey}
            label={`${idx + 1}차 Category`}
            name={fieldKey}
            options={options}
            sx={{ width: '15%', mx: idx % 2 === 1 ? 2 : 0 }}
            disabled={isDisabled}
            onValueChange={(value: number) => {
              idx < formFieldKeys.length - 1 && handleChange({ depth: idx + 1, value });
            }}
          />
        );
      })}
    </>
  );
};
