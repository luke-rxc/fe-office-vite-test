import styled from '@emotion/styled';
import { Box, Button, Card, FormControl, FormGroup, FormLabel, Grid } from '@material-ui/core';
import { DateRangeButtonGroup } from '@features/order/components';
import {
  ExportTicketGoodsKindOptions,
  ExportTicketStatusOptions,
  OrderExportSearchFieldType,
  OrderExportSearchFieldTypeLabel,
  OrderExportSearchFieldTypePlaceholder,
  OrderExportTicketGoodsKindLabel,
  OrderExportTicketStatusLabel,
} from '@features/order/constants';
import { OrderExportTicketSearchFormField } from '@features/order/types';
import { ReturnTypeUseOrderExportTicketListService } from '@features/order/services';
import { useMemo } from 'react';
import { CheckOptionGroup } from '../CheckOptionGroup';
import {
  FormControlAutoComplete,
  FormControlCheckbox,
  FormControlDatePickerLocal,
  FormControlSelect,
  FormControlTextField,
} from '@components/form';

interface Props {
  form: ReturnTypeUseOrderExportTicketListService['form'];
  providerCombo: ReturnTypeUseOrderExportTicketListService['providerCombo'];
  mdCombo: ReturnTypeUseOrderExportTicketListService['mdCombo'];
  ticketCombo: ReturnTypeUseOrderExportTicketListService['ticketCombo'];
}

/**
 * 검색 타입 옵션
 */
const searchFieldOptions = Object.keys(OrderExportSearchFieldType).map((key) => {
  return {
    label: OrderExportSearchFieldTypeLabel[key],
    value: OrderExportSearchFieldType[key],
  };
});

/**
 * 출고(티켓) 타입 옵션
 */
const exportTicketGoodsKindOptions = ExportTicketGoodsKindOptions.map((option) => {
  return {
    label: OrderExportTicketGoodsKindLabel[option],
    value: option,
  };
});

/**
 * 출고(티켓) 상태 옵션
 */
const exportTicketStatusOptions = ExportTicketStatusOptions.map((option) => {
  return {
    label: OrderExportTicketStatusLabel[option],
    value: option,
  };
});

/**
 * 출고(티켓) 리스트 검색폼 component
 */
export const ExportTicketSearchForm = ({
  form: {
    formMethod: {
      formState: { errors },
      watch,
    },
    handleSubmit,
    handleReset,
    handleChangeDateRange,
    handleUpdateExportTicketGoodsKindList,
    handleUpdateExportTicketStatusList,
  },
  providerCombo,
  mdCombo,
  ticketCombo,
}: Props) => {
  const [searchType, goodsKindListValues, ticketStatusListValues] = watch([
    'searchType',
    'goodsKindList',
    'ticketStatusList',
  ]);

  const placeHolder = useMemo(() => {
    return OrderExportSearchFieldTypePlaceholder[searchType];
  }, [searchType]);

  return (
    <Card>
      <WrapperStyled>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item md={2} xs={12}>
              <FormControlSelect<OrderExportTicketSearchFormField>
                name="searchType"
                label="검색조건"
                inputProps={{ 'aria-label': 'searchType' }}
                options={searchFieldOptions}
                autoWidth
              />
            </Grid>
            <Grid item md={10} xs={12}>
              <FormControlTextField<OrderExportTicketSearchFormField>
                name="keyword"
                label=""
                placeholder={placeHolder}
                sx={{ width: '400px' }}
              />
            </Grid>

            <Grid item md={3} xs={6}>
              <FormControlDatePickerLocal<OrderExportTicketSearchFormField>
                name="fromDate"
                label="출고일 검색범위(시작)"
                fullWidth
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Grid item md={3} xs={6}>
              <FormControlDatePickerLocal<OrderExportTicketSearchFormField>
                name="toDate"
                label="출고일 검색범위(종료)"
                fullWidth
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Grid item md={6} xs={12} display="flex" alignItems="center">
              <DateRangeButtonGroup onChangeDateRange={handleChangeDateRange} />
            </Grid>

            <Grid item md={12} xs={12}>
              <FormControlStyled fullWidth>
                <FormLabel>티켓 타입</FormLabel>
                <FormGroup>
                  <Box width="100%">
                    <CheckOptionGroup
                      formFieldName="goodsKindList"
                      options={exportTicketGoodsKindOptions}
                      selectedOptions={goodsKindListValues}
                      onUpdateSelectList={handleUpdateExportTicketGoodsKindList}
                    />
                  </Box>
                  {errors?.goodsKindList && <ErrorWrapperStyled>{errors?.goodsKindList['message']}</ErrorWrapperStyled>}
                </FormGroup>
              </FormControlStyled>
            </Grid>

            <Grid item md={12} xs={12}>
              <FormControlStyled fullWidth>
                <FormLabel>티켓 상태</FormLabel>
                <FormGroup>
                  <Box width="100%">
                    <CheckOptionGroup
                      formFieldName="ticketStatusList"
                      options={exportTicketStatusOptions}
                      selectedOptions={ticketStatusListValues}
                      onUpdateSelectList={handleUpdateExportTicketStatusList}
                    />
                  </Box>
                  {errors?.ticketStatusList && (
                    <ErrorWrapperStyled>{errors?.ticketStatusList['message']}</ErrorWrapperStyled>
                  )}
                </FormGroup>
              </FormControlStyled>
            </Grid>

            <Grid item md={12} xs={12}>
              <FormControlStyled fullWidth>
                <FormLabel></FormLabel>
                <FormGroup>
                  <Box width="100%">
                    <FormControlCheckbox<OrderExportTicketSearchFormField>
                      name="returnedYN"
                      label="반품요청 포함여부"
                    />
                  </Box>
                </FormGroup>
              </FormControlStyled>
            </Grid>

            {providerCombo && (
              <Grid item md={4} xs={4}>
                <FormControlStyled fullWidth>
                  <FormLabel>입점사</FormLabel>
                  <FormGroup row>
                    <FormControlAutoComplete<OrderExportTicketSearchFormField>
                      name="provider"
                      options={providerCombo}
                      variant="outlined"
                      placeholder="전체"
                      sx={{ width: '300px' }}
                    />
                  </FormGroup>
                </FormControlStyled>
              </Grid>
            )}

            {mdCombo && (
              <Grid item md={8} xs={8}>
                <FormControlStyled fullWidth>
                  <FormLabel>MD</FormLabel>
                  <FormGroup row>
                    <FormControlAutoComplete<OrderExportTicketSearchFormField>
                      name="md"
                      options={mdCombo}
                      variant="outlined"
                      placeholder="전체"
                      sx={{ width: '300px' }}
                    />
                  </FormGroup>
                </FormControlStyled>
              </Grid>
            )}

            {ticketCombo && (
              <Grid item md={4} xs={4}>
                <FormControlStyled fullWidth>
                  <FormLabel>티켓</FormLabel>
                  <FormGroup row>
                    <FormControlAutoComplete<OrderExportTicketSearchFormField>
                      name="ticket"
                      options={ticketCombo}
                      variant="outlined"
                      placeholder="전체"
                      sx={{ width: '300px' }}
                    />
                  </FormGroup>
                </FormControlStyled>
              </Grid>
            )}
          </Grid>
          <ButtonWrapperStyled>
            <Button color="primary" type="submit" variant="contained">
              검색
            </Button>
            <Button color="secondary" type="button" variant="contained" onClick={handleReset} sx={{ ml: 1 }}>
              초기화
            </Button>
          </ButtonWrapperStyled>
        </form>
      </WrapperStyled>
    </Card>
  );
};

const WrapperStyled = styled(Box)`
  min-height: 100%;
  padding: 25px 40px;
`;

const ButtonWrapperStyled = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-top: 10px;
`;

const FormControlStyled = styled(FormControl)`
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;

  & > label {
    width: 80px;
    margin-right: 20px;
  }
`;

const ErrorWrapperStyled = styled(Box)`
  color: red;
  margin-top: 5px;
`;
