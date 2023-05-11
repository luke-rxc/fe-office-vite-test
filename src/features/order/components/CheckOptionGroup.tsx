import styled from '@emotion/styled';
import { Box, Button } from '@material-ui/core';
import _ from 'lodash';
import React from 'react';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import CheckBoxOutlineBlank from '@material-ui/icons/CheckBoxOutlineBlank';
import { FieldValues, Path } from 'react-hook-form';
import { TOption } from '@components/Select';
import { FormControlCheckbox } from '@components/form';

interface Props {
  formFieldName: string;
  options: Array<TOption>;
  selectedOptions: Array<boolean>;
  onUpdateSelectList: (selectedOption: Array<boolean>) => void;
}

export const CheckOptionGroup = React.memo(
  <T extends FieldValues>({ formFieldName, options, selectedOptions, onUpdateSelectList }: Props) => {
    const selectedOptionCount = selectedOptions.filter((item) => !!item).length;
    const isAllChecked = selectedOptionCount === options.length;

    const handleClickSelection = () => {
      const isSelectAll = selectedOptionCount !== options.length;
      const updateSelectedOptions = _.clone(selectedOptions);
      options.forEach((_, index) => {
        updateSelectedOptions[index] = isSelectAll;
      });

      onUpdateSelectList(updateSelectedOptions);
    };

    return (
      <WrapperStyled>
        <OptionWrapperStyled>
          {options.map((option, index) => (
            <FormControlCheckbox<T>
              name={`${formFieldName}.${index}` as Path<T>}
              key={option.value}
              label={option.label}
              value={option}
            />
          ))}
        </OptionWrapperStyled>
        <Button
          variant="outlined"
          size="small"
          onClick={handleClickSelection}
          startIcon={isAllChecked ? <CheckBoxOutlineBlank /> : <CheckBoxIcon />}
        >
          {isAllChecked ? '전체해제' : '전체선택'}
        </Button>
      </WrapperStyled>
    );
  },
);

const WrapperStyled = styled(Box)`
  display: flex;
  align-items: center;
`;

const OptionWrapperStyled = styled(Box)`
  display: inline-flex;
  min-width: 400px;
  margin-right: 50px;
`;
