import styled from '@emotion/styled';
import { OrderStatus, OrderStatusLabel } from '@features/order/constants';
import { OrderSearchFormField } from '@features/order/types';
import { Box, Button } from '@material-ui/core';
import _ from 'lodash';
import React from 'react';
import { FormControlCheckbox } from '@components/form';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import CheckBoxOutlineBlank from '@material-ui/icons/CheckBoxOutlineBlank';

interface Props {
  hideButton?: boolean;
  buttonLabel: string;
  options: Array<OrderStatus>;
  startIndex: number;
  selectedOptions: Array<boolean>;
  onUpdateOrderStepList: (selectedOption: Array<boolean>) => void;
}

export const StatusOptionGroup = React.memo(
  ({ hideButton = true, buttonLabel, options, startIndex, selectedOptions, onUpdateOrderStepList }: Props) => {
    const selectedOptionCount = options
      .map((_, index) => selectedOptions[index + startIndex])
      .filter((item) => !!item).length;

    const isAllChecked = selectedOptionCount === options.length;

    const handleClickSelection = () => {
      const isSelectAll = selectedOptionCount !== options.length;
      const updateSelectedOptions = _.clone(selectedOptions);
      options.forEach((_, index) => {
        updateSelectedOptions[index + startIndex] = isSelectAll;
      });

      onUpdateOrderStepList(updateSelectedOptions);
    };

    if (hideButton) {
      return (
        <OptionWrapperStyled>
          {options.map((option, index) => (
            <FormControlCheckbox<OrderSearchFormField>
              name={`orderStepList.${index + startIndex}`}
              key={option}
              label={OrderStatusLabel[option]}
              value={option}
            />
          ))}
        </OptionWrapperStyled>
      );
    }

    return (
      <WrapperStyled>
        <OptionWrapperStyled>
          {options.map((option, index) => (
            <FormControlCheckbox<OrderSearchFormField>
              name={`orderStepList.${index + startIndex}`}
              key={option}
              label={OrderStatusLabel[option]}
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
          {buttonLabel} {isAllChecked ? '전체해제' : '전체선택'}
        </Button>
      </WrapperStyled>
    );
  },
);

const WrapperStyled = styled(Box)`
  display: flex;
  align-items: center;
  /* width: 100%; */
`;

const OptionWrapperStyled = styled(Box)`
  display: inline-flex;
  min-width: 700px;
  margin-right: 50px;
`;
