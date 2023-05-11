import { FormControlSelect } from '@components/form';
import styled from '@emotion/styled';
import { OrderRequestExchangeableItemOptionModel } from '@features/order/models';
import { ReturnTypeUseOrderRequestExchangeService } from '@features/order/services';
import { OrderRequestExchangeFormField } from '@features/order/types';
import { Box, Grid, MenuItem, Button } from '@material-ui/core';
import get from 'lodash/get';
import { useMemo, useState } from 'react';
import { useFormContext } from 'react-hook-form';

interface Props {
  editable: boolean;
  item: OrderRequestExchangeableItemOptionModel;
  optionIndex: number;
  getOptionItemEaOptions: ReturnTypeUseOrderRequestExchangeService['getOptionItemEaOptions'];
  onRemoveOptionItem: ReturnTypeUseOrderRequestExchangeService['handleRemoveOptionItem'];
  onInsertOptionItem: ReturnTypeUseOrderRequestExchangeService['handleInsertOptionItem'];
  onClearErrorsOption: ReturnTypeUseOrderRequestExchangeService['handleClearErrorsOption'];
}

/**
 * 주문 교환옵션 component
 */
export const OrderRequestExchangeOption = ({
  editable,
  item: { goodsOptions, id },
  optionIndex,
  getOptionItemEaOptions,
  onRemoveOptionItem: handleRemoveOptionItem,
  onInsertOptionItem: handleInsertOptionItem,
  onClearErrorsOption: handleClearErrorsOption,
}: Props) => {
  const {
    getValues,
    watch,
    formState: { errors },
  } = useFormContext<OrderRequestExchangeFormField>();
  const [options, setOptions] = useState(goodsOptions);
  const isExistSelectableOptions = useMemo(() => {
    return options.filter((item) => !item.readOnly).length > 0;
  }, [options]);

  const { optionItemIds, optionEa, optionItemEaList } = watch(`options.${optionIndex}`);
  const errorMessage = get(errors, `options.${optionIndex}.message`);
  const optionCount = (optionItemIds || []).length;

  const enabledAddOption = useMemo(() => {
    const totalOptionEa = (optionItemEaList || []).reduce((target, item) => {
      target += Number(item || 1);
      return target;
    }, optionCount - (optionItemEaList || []).length);
    return optionEa > totalOptionEa;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [optionEa, optionItemEaList, optionIndex, optionCount]);

  const onChangeOptionItem = () => {
    const selectOptions = getValues(`options.${optionIndex}.optionItemIds`);
    setOptions((prev) => {
      return prev.map((item) => {
        return {
          ...item,
          readOnly: (selectOptions || []).map((item) => Number(item)).includes(Number(item.value)),
        };
      });
    });
    handleClearErrorsOption();
  };

  const onChangeOptionItemEa = () => {
    handleClearErrorsOption();
  };

  const onClickAddOption = () => {
    handleInsertOptionItem(optionIndex);
  };

  if (!editable) {
    return <Box>-</Box>;
  }

  return (
    <Box>
      {optionItemIds.map((optionItemId, optionItemIndex) => {
        const eaOptions = getOptionItemEaOptions(optionIndex, optionItemIndex);

        return (
          <Grid container key={`${id}_${optionItemIndex}`} gap={1} sx={{ margin: '10px 0', minWidth: '440px' }}>
            <Grid item sm={8}>
              <FormControlSelect<OrderRequestExchangeFormField>
                name={`options.${optionIndex}.optionItemIds.${optionItemIndex}`}
                size="small"
                options={options}
                defaultValue={''}
                displayEmpty
                onChange={onChangeOptionItem}
                sx={{ minWidth: '200px' }}
                showError
                rules={{
                  required: {
                    value: true,
                    message: isExistSelectableOptions
                      ? '교환상품을 선택하세요'
                      : '선택가능한 옵션이 없어 교환이 불가합니다.',
                  },
                }}
              >
                <MenuItem value="" disabled>
                  선택
                </MenuItem>
              </FormControlSelect>
            </Grid>
            <Grid item>
              <FormControlSelect<OrderRequestExchangeFormField>
                name={`options.${optionIndex}.optionItemEaList.${optionItemIndex}`}
                size="small"
                defaultValue={0}
                options={eaOptions}
                disabled={!optionItemId}
                onChange={onChangeOptionItemEa}
                rules={{
                  min: { value: 1, message: '수량을 확인하세요' },
                }}
              />
            </Grid>
            <Grid>
              <Button
                type="button"
                variant="outlined"
                disabled={optionItemEaList.length <= 1}
                onClick={handleRemoveOptionItem(optionIndex, optionItemIndex)}
                sx={{ width: '40px', height: '40px' }}
              >
                삭제
              </Button>
            </Grid>
          </Grid>
        );
      })}
      <Button
        type="button"
        variant="outlined"
        size="small"
        sx={{ width: '100%' }}
        disabled={!enabledAddOption || !isExistSelectableOptions}
        onClick={onClickAddOption}
      >
        +
      </Button>
      {errorMessage && <ErrorMessageStyled>{errorMessage}</ErrorMessageStyled>}
    </Box>
  );
};

const ErrorMessageStyled = styled.div`
  margin: 10px 14px 0;
  color: #f44336;
`;
