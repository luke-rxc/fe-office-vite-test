/** @todo 구조적 Refactor 필요 */

import React, { useCallback, useState } from 'react';
import { useFormContext, FieldValues, UseFieldArrayReturn, Controller } from 'react-hook-form';
import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';
import { makeStyles } from '@material-ui/core/styles';
import { Box, Button, Typography, Tooltip, Card, CardContent } from '@material-ui/core';
import HelpIcon from '@material-ui/icons/Help';
import { Table } from '@components/table/Table';
import { FormControlDatePicker } from '@components/form';
import DownloadIcon from '@assets/icons/Download';
import UploadIcon from '@assets/icons/Upload';
import XIcon from '@assets/icons/X';
import { ExcelFileAccept } from '@utils/excel';
import { toDateFormat } from '@utils/date';
import { GoodsKind } from '@constants/goods';
import { DetailOptionModal } from '../components/detailOption';
import { TextField, Select } from '../components/form';
import { TableLight } from '../components/table';
import { OptBatchTitleType, OptBatchFieldNameType } from '../types';
import { OptionsInfoProp, TicketGoodsModel } from '../models';
import { getRate, callbackDateConverter } from '../utils';
import { OptBatches, OptRegisterKinds, OptionTableType, PageType } from '../constants';
import { usePageType } from '../hooks';
import { useOptionTableControlService } from '../services/detailOption';

const ToolTipTicketAgent =
  '티켓의 정보값이 변경되어, 기존에 등록한 옵션값이 자동으로 변경된 티켓의 정보값으로 수정되었습니다.\r\n확인 후 하단의 수정버튼을 눌러 옵션정보를 업데이트 해주셔야 서비스에도 반영됩니다';

const useStyles = makeStyles(() => {
  return {
    subTableRow: {
      borderTop: 'none',
    },
    centerText: {
      '& input': {
        textAlign: 'center',
      },
    },
    noBorder: {
      '& fieldset': {
        border: 'none',
      },
    },
  };
});

interface Props {
  optionsInfo: OptionsInfoProp;
  fieldArray: UseFieldArrayReturn<FieldValues, 'optionLists', 'id'>;
  ticketAgentList?: TicketGoodsModel[] | null;
  selectedGoodsKind: GoodsKind;
  // 티켓 타입이 숙박권인 경우(BOOKING_DATED, BOOKING_UNDATED)
  isBookedTicketType: boolean;
  // 티켓 타입이 날짜 지정인경우(BOOKING_DATED)
  isBookDatedTicket: boolean;
  isPartnerSite?: boolean;
  onAddOptionList: () => void;
  onExcelDownload: () => void;
  onExcelUpload: (e: React.ChangeEvent<HTMLInputElement>) => Promise<unknown>;
}

export const DetailOptionTableContainer = React.memo(
  ({
    optionsInfo,
    fieldArray,
    ticketAgentList,
    selectedGoodsKind,
    isBookedTicketType,
    isBookDatedTicket,
    isPartnerSite = false,
    onAddOptionList: handleAddOptionList,
    onExcelDownload: handleExcelDownload,
    onExcelUpload: handleExcelUpload,
  }: Props) => {
    const classes = useStyles();
    const { optionTitles } = optionsInfo;
    const { type: pageType } = usePageType();

    // form value
    const {
      register,
      setValue,
      getValues,
      clearErrors,
      formState: { errors },
      control,
    } = useFormContext();
    const { fields, remove } = fieldArray;

    /** 일괄적용 */
    const [selectedRowKeys, setSelectedRowKeys] = useState<Array<string>>([]);

    /**
     * 옵션 Title ReadOnly 여부
     * @description 단일 옵션인 경우 readOnly 처리
     */
    const isOptionRegisterStop = getValues('optionRegister') === OptRegisterKinds.STOP;
    /** 엑셀 업로드 Disabled, 단일상품 + 숙박권 날짜 지정형 */
    const isExcelUploadDisabled = isOptionRegisterStop && !isBookDatedTicket;

    /** 페이지 등록모드 */
    const isCreatePage = pageType === PageType.CREATE;

    /** 금액 수정 */
    const isPriceDisabled =
      ((isCreatePage && !!ticketAgentList) ||
        (pageType === PageType.MODIFY && selectedGoodsKind === GoodsKind.TICKET_AGENT)) &&
      !isBookedTicketType;

    /** 초기 랜딩시 테이블 타입 설정 */
    const {
      isRender,
      optTotal,
      optionTableType,
      lightTable: {
        renderOptList,
        hasMore,
        disabledRowItemIndexes,
        handleMoreLoad,
        handleRowKeyChange: handleLightRowKeyChange,
        handleRemoveIndex: handleLightRemoveIndex,
        handleRemoveList: handleLightRemoveList,
        handleBatchChange: handleLightBatchChange,
      },
      batchModal: { batchModalInfo, handleUpdateBatchModalInfo },
      maxHeight: tableMaxHeight,
    } = useOptionTableControlService({
      fieldArray,
    });

    /** 옵션 추가 버튼 노출여부 */
    const isAddOptBtn =
      !!optTotal && optionTableType === OptionTableType.NORMAL && !isOptionRegisterStop && !isBookDatedTicket;

    /** Option Row: Selected */
    const handleRowKeyChange = useCallback((keys) => {
      setSelectedRowKeys(keys);
    }, []);

    /** 일괄적용 진행 */
    const handleBatchChange = (value, fieldName) => {
      fields.forEach((_, index) => {
        setValue(`optionLists.${index}.${fieldName}`, value);

        (fieldName === 'consumerPrice' || fieldName === 'price') && handleCheckRate(null, index);
      });
      handleUpdateBatchModalInfo();
    };

    /** 일괄적용 Modal Open */
    const handleBatchModalOpen = (title: OptBatchTitleType, fieldName: OptBatchFieldNameType) => {
      handleUpdateBatchModalInfo({ title, fieldName });
    };

    /** Option Row: 삭제 */
    const handleRemoveList = () => {
      /** @todo type */
      const fieldKeys = fields.map((field: any) => field.key);
      const removeArr = selectedRowKeys
        .map((rowKey) => fieldKeys.indexOf(rowKey))
        .filter((selectedKey) => selectedKey > -1);

      remove(removeArr);
    };

    const handleRemoveIndex = (index: number) => {
      remove(index);
    };

    const handleCheckRate = (_: unknown, index: number) => {
      // 정상가
      const customerPrice = +getValues(`optionLists.${index}.consumerPrice`);
      // 판매가
      const price = +getValues(`optionLists.${index}.price`);

      /** @todo 할인율 계산 방식 확인 */
      const rate = getRate(customerPrice, price);

      setValue(`optionLists.${index}.discountRate`, `${!isNaN(rate) && isFinite(rate) ? rate : 0}`);
    };

    const handleSelectTicketList = (value: TicketGoodsModel['value'], index: number) => {
      // 숙박권 타입은 금액 적용하지 않음
      if (isBookedTicketType) {
        return;
      }
      const values = ticketAgentList?.find((ticket) => ticket.value === value);
      const { consumerPrice, price } = values.info;
      setValue(`optionLists.${index}.consumerPrice`, consumerPrice);
      setValue(`optionLists.${index}.price`, price);
      clearErrors([`optionLists.${index}.consumerPrice`, `optionLists.${index}.price`]);
      handleCheckRate(null, index);
    };

    const handleAddOption = () => {
      /** @issue Table Dom 접근코드 */
      const $tableContainer = document.querySelector('.MuiTableContainer-root');
      $tableContainer.scrollTo(0, 0);
      handleAddOptionList();
    };

    const columns = [
      {
        label: '관리 코드',
        dataKey: 'id',
        align: 'center',
        render: (value) => <p>{value ?? ''}</p>,
      },
      {
        label: '날짜',
        dataKey: 'bookingDate',
        align: 'center',
        hide: !isBookDatedTicket,
        render: (value, items, index) => {
          return (
            <FormControlDatePicker
              name={`optionLists.${index}.bookingDate`}
              fullWidth={false}
              callbackDateConverter={callbackDateConverter}
            />
          );
        },
        renderPreview: (value) => {
          const dateValue = value ?? new Date().getTime();
          return <p>{toDateFormat(dateValue, 'yyyy/MM/dd')}</p>;
        },
      },
      ...optionTitles.map((optionTitle, index) => {
        const optionName = `option${index + 1}`;
        return {
          label: optionTitle,
          dataKey: optionName,
          align: 'center',
          render: (value, item, idx) => {
            return (
              <TextField
                name={`optionLists.${idx}.${optionName}`}
                error={!!errors.optionLists?.[idx]?.[optionName]}
                helperText={errors.optionLists?.[idx]?.[optionName]?.message}
                fullWidth
                inputProps={{
                  readOnly: isOptionRegisterStop,
                }}
              />
            );
          },
        };
      }),
      {
        label: '정상가',
        dataKey: 'consumerPrice',
        align: 'center',
        render: (value, item, index) => {
          return (
            <>
              {item.isTicketConsumerPriceChanged && (
                <Typography variant="overline" color="#f00" display="flex" justifyContent="center" alignItems="center">
                  티켓정보 변경됨
                  <Tooltip
                    title={
                      <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                        {ToolTipTicketAgent}
                      </Typography>
                    }
                    children={<HelpIcon fontSize="small" />}
                    placement="top"
                  />
                </Typography>
              )}
              <TextField
                type="number"
                name={`optionLists.${index}.consumerPrice`}
                onChange={(evt) => handleCheckRate(evt, index)}
                sx={{ width: 120 }}
                className={classes.centerText}
                error={!!errors.optionLists?.[index]?.consumerPrice}
                helperText={errors.optionLists?.[index]?.consumerPrice?.message}
                disabled={isPriceDisabled}
              />
            </>
          );
        },
        renderPreview: (value, item, index) => {
          return <InputStyled {...register(`optionLists.${index}.consumerPrice`)} readOnly />;
        },
      },
      {
        label: '판매가',
        dataKey: 'price',
        align: 'center',
        render: (value, item, index) => {
          return (
            <>
              {item.isTicketPriceChanged && (
                <Typography variant="overline" color="#f00" display="flex" justifyContent="center" alignItems="center">
                  티켓정보 변경됨
                  <Tooltip
                    title={
                      <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                        {ToolTipTicketAgent}
                      </Typography>
                    }
                    children={<HelpIcon fontSize="small" />}
                    placement="top"
                  />
                </Typography>
              )}
              <TextField
                type="number"
                name={`optionLists.${index}.price`}
                onChange={(evt) => handleCheckRate(evt, index)}
                sx={{ width: 120 }}
                className={classes.centerText}
                error={!!errors.optionLists?.[index]?.price}
                helperText={errors.optionLists?.[index]?.price?.message}
                disabled={isPriceDisabled}
              />
            </>
          );
        },
        renderPreview: (value, item, index) => {
          return <InputStyled {...register(`optionLists.${index}.price`)} readOnly />;
        },
      },
      {
        label: '입금가',
        dataKey: 'depositPrice',
        align: 'center',
        hide: !isBookedTicketType,
        render: (value, item, index) => (
          <TextField
            type="number"
            name={`optionLists.${index}.depositPrice`}
            sx={{ width: 100 }}
            className={classes.centerText}
            error={!!errors.optionLists?.[index]?.depositPrice}
            helperText={errors.optionLists?.[index]?.depositPrice?.message}
          />
        ),
      },
      {
        label: '할인율',
        dataKey: 'discountRate',
        align: 'center',
        render: (value, item, index) => {
          return (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Controller
                name={`optionLists.${index}.discountRate`}
                control={control}
                render={({ field }) => <p>{field.value}%</p>}
              />
            </Box>
          );
        },
        renderPreview: (value, item, index) => {
          return (
            <Controller
              name={`optionLists.${index}.discountRate`}
              control={control}
              render={({ field }) => <p>{field.value}%</p>}
            />
          );
        },
      },
      {
        label: '재고수량',
        dataKey: 'stock',
        align: 'center',
        render: (value, item, index) => (
          <TextField
            type="number"
            name={`optionLists.${index}.stock`}
            sx={{ width: 100 }}
            className={classes.centerText}
            error={!!errors.optionLists?.[index]?.stock}
            helperText={errors.optionLists?.[index]?.stock?.message}
          />
        ),
        renderPreview: (value, item, index) => {
          return <InputStyled {...register(`optionLists.${index}.stock`)} readOnly />;
        },
      },
      {
        label: '수수료',
        dataKey: 'commissionRate',
        align: 'center',
        render: (value, item, index) => (
          <TextField
            type="number"
            name={`optionLists.${index}.commissionRate`}
            sx={{ width: 100 }}
            className={classes.centerText}
            disabled={isPartnerSite}
            error={!!errors.optionLists?.[index]?.commissionRate}
            helperText={errors.optionLists?.[index]?.commissionRate?.message}
          />
        ),
      },
      {
        label: '티켓 선택',
        dataKey: 'ticketGoodsId',
        align: 'center',
        hide: !(getValues('goodsKind') === GoodsKind.TICKET_AGENT),
        render: (value, item, index) => {
          return (
            ticketAgentList && (
              <Select
                label="티켓 선택"
                name={`optionLists.${index}.ticketGoodsId`}
                defaultValue=""
                onValueChange={(value: TicketGoodsModel['value']) => handleSelectTicketList(value, index)}
                options={ticketAgentList}
                sx={{ width: 250 }}
                error={!!errors.optionLists?.[index]?.ticketGoodsId}
                helperText={errors.optionLists?.[index]?.ticketGoodsId?.message}
              />
            )
          );
        },
        forceRender: true,
      },
      {
        label: '',
        dataKey: 'removeList',
        align: 'center',
        /** @since 221004 티켓 : 숙박권 등록/수정은 엑셀로만 진행가능 */
        hide: optionTableType === OptionTableType.LIMIT || isBookDatedTicket || isOptionRegisterStop,
        render: (value, item, index) => {
          return (
            <Button
              color="primary"
              variant="text"
              size="medium"
              onClick={() => {
                handleRemoveIndex(index);
              }}
            >
              <XIcon fontSize="small" />
            </Button>
          );
        },
      },
    ] as any[];

    /**
     * 초기 렌더링 이후에, optTotal의 상태와 fields의 상태가 서로 다른 케이스에 대한 렌더링 처리
     */
    if ((!isRender && !isCreatePage) || optTotal !== fields.length) {
      return (
        <TableLoadStyled>
          <CardContent className="content">
            <Typography className="desc animation-desc" color="#f00" variant="body2" textAlign="center" paragraph>
              테이블 데이터를 갱신중입니다...
            </Typography>
            <Typography className="desc" variant="body2" textAlign="center" paragraph>
              리스트 개수가 많을 수록 시간이 걸릴 수 있습니다
            </Typography>
          </CardContent>
        </TableLoadStyled>
      );
    }

    return (
      <>
        {/* menu */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'flex-end',
            mt: 2,
            p: 2,
          }}
        >
          {OptBatches.map(({ title, fieldName }) => {
            /** @todo refactoring 필요 */
            // Display 조건
            if (fieldName === 'depositPrice' && !isBookedTicketType) {
              return null;
            }
            return (
              <Button
                key={fieldName}
                color="primary"
                variant="outlined"
                sx={{ mr: 2 }}
                disabled={!(fields?.length > 0) || (!!ticketAgentList && fieldName !== 'stock')}
                onClick={() => handleBatchModalOpen(title, fieldName)}
              >
                {title} 일괄수정
              </Button>
            );
          })}
          {/** @since 221004 엑셀 양식 제약 없애는 것으로 진행 */}
          <Button
            color="primary"
            startIcon={<DownloadIcon fontSize="small" />}
            variant="text"
            onClick={handleExcelDownload}
            disabled={isExcelUploadDisabled}
          >
            엑셀양식다운로드
          </Button>

          {!isExcelUploadDisabled && (
            <input
              accept={ExcelFileAccept}
              style={{ display: 'none' }}
              id="excelUpload"
              type="file"
              onChange={handleExcelUpload}
            />
          )}

          <label htmlFor="excelUpload">
            <Button
              color="primary"
              variant="text"
              component="span"
              startIcon={<UploadIcon fontSize="small" />}
              disabled={isExcelUploadDisabled}
            >
              엑셀업로드
            </Button>
          </label>
          <Button
            color="primary"
            variant="text"
            size="medium"
            startIcon={<XIcon fontSize="small" />}
            disabled={isOptionRegisterStop || isBookDatedTicket}
            onClick={optionTableType === OptionTableType.NORMAL ? handleRemoveList : handleLightRemoveList}
          >
            삭제
          </Button>
        </Box>

        <Box sx={{ minWidth: 1150 }}>
          {optionTableType === OptionTableType.NORMAL && (
            <Table
              stickyHeader
              columns={columns}
              items={fields}
              maxHeight={tableMaxHeight}
              rowKey="key"
              pagination={false}
              rowSelection={{
                selectedRowKeys,
                onChange: handleRowKeyChange,
              }}
            />
          )}
          {optionTableType === OptionTableType.LIMIT && (
            <TableLight
              stickyHeader
              columns={columns}
              items={renderOptList}
              maxHeight={tableMaxHeight}
              rowKey="key"
              rowSelection={{
                disabledRowItemIndexes,
                onChange: handleLightRowKeyChange,
              }}
              indicatorOptions={{
                hasMore,
                onLoadMore: handleMoreLoad,
              }}
              deleteOptions={{
                deletable: !(isBookDatedTicket || isOptionRegisterStop),
                onDelete: handleLightRemoveIndex,
              }}
              rowErrors={Object.keys(errors.optionLists ?? []).map((value) => +value)}
            />
          )}

          {/** @since 221004 티켓 : 숙박권 등록/수정은 엑셀로만 진행가능 */}
          {isAddOptBtn && (
            <Button variant="contained" onClick={handleAddOption} sx={{ my: 1, width: '100%' }}>
              옵션리스트 추가
            </Button>
          )}
        </Box>

        <DetailOptionModal
          isOpen={batchModalInfo !== null}
          title={batchModalInfo?.title}
          fieldName={batchModalInfo?.fieldName}
          onClose={handleUpdateBatchModalInfo}
          onBatchChange={optionTableType === OptionTableType.NORMAL ? handleBatchChange : handleLightBatchChange}
        />
      </>
    );
  },
  (prevProps, nextProps) => {
    const {
      fieldArray: { fields: prevFields },
      ticketAgentList: prevTicketAgentList,
    } = prevProps;

    const {
      fieldArray: { fields: nextFields },
      ticketAgentList: nextTicketAgentList,
    } = nextProps;

    const prev = JSON.stringify(prevFields);
    const next = JSON.stringify(nextFields);
    const prevTicketAgentListStr = JSON.stringify(prevTicketAgentList);
    const nextTicketAgentListStr = JSON.stringify(nextTicketAgentList);

    if (prev !== next || prevTicketAgentListStr !== nextTicketAgentListStr) {
      // console.log('[DetailOptionTable Memo Render]');
      return false;
    }

    return true;
  },
);

const InputStyled = styled.input`
  border: none;
  outline: none;
  text-align: center;
  cursor: default;
  color: #000;
  width: 100px;
  &:read-only {
    background: transparent;
  }
`;

const loadAnimationFrame = keyframes`
  0% { opacity: 0 }
  100% { opacity: 1 }
`;

const TableLoadStyled = styled(Card)`
  .content {
    padding: 16px;
    .desc {
      margin-bottom: 0;
      &.animation-desc {
        animation: ${loadAnimationFrame} 0.5s ease-in-out infinite;
      }
    }
  }
`;
