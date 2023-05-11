import { useDialog } from '@hooks/useDialog';
import useLoading from '@hooks/useLoading';
import { useMutation } from '@hooks/useMutation';
import { DialogType } from '@models/DialogModel';
import { ErrorModel, ErrorDataModel } from '@utils/api/createAxios';
import { excelExport, excelImport } from '@utils/excel';
import { useEffect, useState } from 'react';
import { putOrderExportExcelTicketUsed } from '../apis';
import { OrderExportTicketStatusChangeExcelCode } from '../constants';
import { useModal } from '../hooks';
import { OrderExportTicketBulkStatusSummaryModel, toOrderExportTicketSummaryModel } from '../models';
import { OrderExportStatusChangeExcelItem, OrderExportStatusChangeResponse } from '../types';

export type ReturnTypeUseOrderExportBulkStatusService = ReturnType<typeof useOrderExportBulkStatusService>;

interface Props {
  reloadExportTicketList: () => void;
}

/**
 * 주문 출고(티켓) 일괄 상태변경 service
 */
export const useOrderExportBulkStatusService = ({ reloadExportTicketList }: Props) => {
  const [orderExportTicketBulkStatusSummary, setOrderExportTicketBulkStatusSummary] = useState<
    OrderExportTicketBulkStatusSummaryModel | undefined
  >();

  const dialog = useDialog();
  const { showLoading, hideLoading } = useLoading();
  const {
    openModal: openExportTicketStatusModal,
    handleOpenModal: handleOpenExportTicketStatusModal,
    handleCloseModal: handleCloseExportTicketStatusModal,
  } = useModal();

  const { mutateAsync: requestOrderExportExcelTicketUsed } = useMutation(
    ({ exportId, orderId }: OrderExportStatusChangeExcelItem) => putOrderExportExcelTicketUsed(exportId, orderId),
  );

  useEffect(() => {
    return () => {
      setOrderExportTicketBulkStatusSummary(undefined);
    };
  }, []);

  const getItemKeyCode = () => {
    return Object.keys(OrderExportTicketStatusChangeExcelCode).reduce((target, item) => {
      target[OrderExportTicketStatusChangeExcelCode[item]] = item;

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
   * 출고(티켓) 사용완료 처리 템플릿 excel download
   */
  const handleDownloadStatusChangeExcel = async () => {
    excelExport({
      headers: [['출고번호', '주문번호']],
      sheetData: [],
      autoFit: true,
      autoFitRatio: 1.5,
      fileName: '출고(티켓) 사용완료 처리 템플릿.xlsx',
    });
  };

  /**
   * 출고(티켓) 사용완료 처리 excel 파일 등록
   */
  const handleUploadExportStatusChangeExcel = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    const uploadedFile = (await excelImport({
      file: files[0],
    })) as Array<Record<string, string>>;
    e.target.value = '';

    !!orderExportTicketBulkStatusSummary && setOrderExportTicketBulkStatusSummary(undefined);
    const itemKeyCode = getItemKeyCode();

    const items: Array<OrderExportStatusChangeExcelItem> = uploadedFile.map<OrderExportStatusChangeExcelItem>(
      (item) => {
        return Object.keys(item).reduce<OrderExportStatusChangeExcelItem>((target, key) => {
          if (!itemKeyCode[key]) {
            return target;
          }

          if (itemKeyCode[key] === 'exportId' || itemKeyCode[key] === 'orderId') {
            target[itemKeyCode[key]] = String(item[key]).trim();
          } else {
            target[itemKeyCode[key]] = item[key] ?? '';
          }

          return target;
        }, {} as OrderExportStatusChangeExcelItem);
      },
    );

    if (items.length === 0) {
      dialog.open({
        type: DialogType.ALERT,
        title: '알림',
        content: `출고(티켓) 일괄 사용완료 처리할 출고건이 없습니다.\r\n 업로드한 엑셀 내용을 확인해주세요.`,
        onClose: () => {
          dialog.close();
        },
      });
      return;
    }

    const actionFuncArray = items.map((item): (() => Promise<OrderExportStatusChangeResponse>) => {
      return async () => {
        try {
          await requestOrderExportExcelTicketUsed(item);
          return { success: true, exportId: item.exportId, orderId: item.orderId };
        } catch (error) {
          return {
            success: false,
            message: (error as ErrorModel<ErrorDataModel>).data.message,
            exportId: item.exportId,
            orderId: item.orderId,
          };
        }
      };
    });

    showLoading();

    const responses = await callParallelApi<OrderExportStatusChangeResponse>(actionFuncArray);

    hideLoading();

    const exportTicketSummary = toOrderExportTicketSummaryModel(responses);
    const { total, success } = exportTicketSummary;
    setOrderExportTicketBulkStatusSummary(exportTicketSummary);

    dialog.open({
      type: DialogType.ALERT,
      title: '알림',
      content:
        total === success
          ? `출고(티켓) 일괄 사용완료 처리가 완료되었습니다.\r\n(성공: ${success.toLocaleString()}개 / 전체: ${total.toLocaleString()}개)`
          : `출고(티켓) 일괄 사용완료 처리중 실패한 항목이 있습니다.\r\n사용완료 처리 결과를 확인해주세요.`,
      onClose: () => {
        reloadExportTicketList?.();
        dialog.close();
      },
    });
  };

  const handleOpenStatusChangeUploadModal = () => {
    handleOpenExportTicketStatusModal();
  };

  const handleCloseStatusChangeUploadModal = () => {
    setOrderExportTicketBulkStatusSummary(undefined);
    handleCloseExportTicketStatusModal();
  };

  return {
    openExportTicketStatusModal,
    orderExportTicketBulkStatusSummary,
    handleOpenStatusChangeUploadModal,
    handleCloseStatusChangeUploadModal,
    handleUploadExportStatusChangeExcel,
    handleDownloadStatusChangeExcel,
  };
};
