import { useDialog } from '@hooks/useDialog';
import useLoading from '@hooks/useLoading';
import { useMutation } from '@hooks/useMutation';
import { DialogType } from '@models/DialogModel';
import { ErrorModel, ErrorDataModel } from '@utils/api/createAxios';
import { excelExport, excelImport } from '@utils/excel';
import { addDays, isDate, isMatch, isValid } from 'date-fns';
import { useEffect, useState } from 'react';
import { putOrderExportExcelTicketBookingDate } from '../apis';
import { OrderExportTicketBookingDateChangeExcelCode } from '../constants';
import { useModal } from '../hooks';
import {
  OrderExportTicketBulkBookingDateSummaryModel,
  toOrderExportTicketBulkBookingDateSummaryModel,
} from '../models';
import { OrderExportBookingDateChangeExcelItem, OrderExportBookingDateChangeResponse } from '../types';
import { toDateFormat } from '../utils';

export type ReturnTypeUseOrderExportBulkBookingDateService = ReturnType<typeof useOrderExportBulkBookingDateService>;

interface Props {
  reloadExportTicketList: () => void;
}

/**
 * 주문 출고(티켓) 일괄 투숙일지정 service
 */
export const useOrderExportBulkBookingDateService = ({ reloadExportTicketList }: Props) => {
  const [orderExportTicketBulkBookingDateSummary, setOrderExportTicketBulkBookingDateSummary] = useState<
    OrderExportTicketBulkBookingDateSummaryModel | undefined
  >();

  const dialog = useDialog();
  const { showLoading, hideLoading } = useLoading();
  const {
    openModal: openDiscoverKeywordBulkBookingDateModal,
    handleOpenModal: handleOpenDiscoverKeywordBulkModel,
    handleCloseModal: handleCloseDiscoverKeywordBulkModel,
  } = useModal();

  const { mutateAsync: requestOrderExportExcelTicketUsed } = useMutation(
    (params: OrderExportBookingDateChangeExcelItem) => putOrderExportExcelTicketBookingDate(params),
  );

  useEffect(() => {
    return () => {
      setOrderExportTicketBulkBookingDateSummary(undefined);
    };
  }, []);

  const getItemKeyCode = () => {
    return Object.keys(OrderExportTicketBookingDateChangeExcelCode).reduce((target, item) => {
      target[OrderExportTicketBookingDateChangeExcelCode[item]] = item;

      return target;
    }, {});
  };

  /**
   * api 병렬 호출
   */
  const callParallelApi = <T>(actionFuncArray: Array<() => Promise<T>>) => {
    return actionFuncArray.reduce(async (promise: Promise<Array<T>>, apiCallable: () => Promise<T>) => {
      const previousResult = await promise.then();

      const results = await apiCallable();

      return [...previousResult, ...[results]];
    }, Promise.resolve([] as Array<T>));
  };

  /**
   * 출고(티켓) 투숙일지정 처리 템플릿 excel download
   */
  const handleDownloadExcel = async () => {
    excelExport({
      headers: [['출고번호', '주문번호', '투숙일']],
      sheetData: [['', '', '']],
      autoFit: true,
      autoFitRatio: 1.5,
      columnMinSize: 10,
      fileName: `출고(티켓) 일괄 투숙일 지정 템플릿.xlsx`,
    });
  };

  /**
   * 출고(티켓) 투숙일지정 처리 excel 파일 등록
   */
  const handleChangeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    const uploadedFile = (await excelImport({
      file: files[0],
      readOpt: { cellDates: true },
      sheetJsonOpt: { dateNF: 'yyyy/mm/dd' },
    })) as Array<Record<string, string>>;
    e.target.value = '';

    !!orderExportTicketBulkBookingDateSummary && setOrderExportTicketBulkBookingDateSummary(undefined);
    const itemKeyCode = getItemKeyCode();

    const items: Array<OrderExportBookingDateChangeExcelItem> = uploadedFile.map<OrderExportBookingDateChangeExcelItem>(
      (item) => {
        return Object.keys(item).reduce<OrderExportBookingDateChangeExcelItem>((target, key) => {
          if (!itemKeyCode[key]) {
            return target;
          }

          if (itemKeyCode[key] === 'exportId' || itemKeyCode[key] === 'orderId') {
            target[itemKeyCode[key]] = String(item[key]).trim();
          } else if (itemKeyCode[key] === 'bookingDate') {
            if (item[key] === '') {
              target[itemKeyCode[key]] = null;
            } else {
              if (isValid(item[key]) && (isDate(item[key]) || isMatch(item[key], 'yyyy/MM/dd'))) {
                const dateTime = addDays(new Date(`${toDateFormat(item[key], 'yyyy/MM/dd')} 00:00:00`), 1).getTime();
                target[itemKeyCode[key]] = dateTime;
              } else {
                target['errorMessage'] = `투숙일을 확인해주세요`;
                target[itemKeyCode[key]] = item[key];
              }
            }
          }

          return target;
        }, {} as OrderExportBookingDateChangeExcelItem);
      },
    );

    if (items.length === 0) {
      dialog.open({
        type: DialogType.ALERT,
        title: '알림',
        content: `출고(티켓) 일괄 투숙일지정 처리할 출고건이 없습니다.\r\n 업로드한 엑셀 내용을 확인해주세요.`,
        onClose: () => {
          dialog.close();
        },
      });
      return;
    }

    const actionFuncArray = items.map((item): (() => Promise<OrderExportBookingDateChangeResponse>) => {
      return async () => {
        try {
          if (item.errorMessage) {
            return {
              success: false,
              message: item.errorMessage,
              exportId: item.exportId,
              orderId: item.orderId,
              bookingDate: String(item.bookingDate),
            };
          }

          await requestOrderExportExcelTicketUsed(item);
          return {
            success: true,
            exportId: item.exportId,
            orderId: item.orderId,
            bookingDate: item.bookingDate ? toDateFormat(item.bookingDate, 'yyyy/MM/dd') : '',
          };
        } catch (error) {
          return {
            success: false,
            message: (error as ErrorModel<ErrorDataModel>).data.message,
            exportId: item.exportId,
            orderId: item.orderId,
            bookingDate: item.bookingDate ? String(item.bookingDate) : '',
          };
        }
      };
    });

    showLoading();

    const responses = await callParallelApi<OrderExportBookingDateChangeResponse>(actionFuncArray);

    hideLoading();

    const exportTicketSummary = toOrderExportTicketBulkBookingDateSummaryModel(responses);
    const { total, success } = exportTicketSummary;
    setOrderExportTicketBulkBookingDateSummary(exportTicketSummary);

    dialog.open({
      type: DialogType.ALERT,
      title: '알림',
      content:
        total === success
          ? `출고(티켓) 일괄 투숙일지정 처리가 완료되었습니다.\r\n(성공: ${success.toLocaleString()}개 / 전체: ${total.toLocaleString()}개)`
          : `출고(티켓) 일괄 투숙일지정 처리중 실패한 항목이 있습니다.\r\n사용완료 처리 결과를 확인해주세요.`,
      onClose: () => {
        reloadExportTicketList?.();
        dialog.close();
      },
    });
  };

  const handleOpenModal = () => {
    handleOpenDiscoverKeywordBulkModel();
  };

  const handleCloseModal = () => {
    setOrderExportTicketBulkBookingDateSummary(undefined);
    handleCloseDiscoverKeywordBulkModel();
  };

  return {
    openDiscoverKeywordBulkBookingDateModal,
    orderExportTicketBulkBookingDateSummary,
    handleDownloadExcel,
    handleChangeUpload,
    handleOpenModal,
    handleCloseModal,
  };
};
