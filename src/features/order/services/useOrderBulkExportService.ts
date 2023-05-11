import { useDialog } from '@hooks/useDialog';
import { useMutation } from '@hooks/useMutation';
import { DialogType } from '@models/DialogModel';
import { toDateFormat } from '@utils/date';
import { excelExport, excelImport } from '@utils/excel';
import { useEffect, useState } from 'react';
import { getOrderExportableItems, getDeliveryCompaniesComboList, postOrderExportOption } from '../apis';
import { OrderExportPrepareExcelCode } from '../constants';
import {
  OrderExportSummaryModel,
  toOrderExportSummaryModel,
  toOrderExportUploadItemList,
  toOrderExportUploadOptionParams,
} from '../models';
import { OrderExportExcelItem, OrderExportUploadOptionParams } from '../types';
import { ReturnTypeUseOrderExportPrepareListService } from './useOrderExportPrepareListService';

interface Props {
  selectedRowKeys: ReturnTypeUseOrderExportPrepareListService['rowSelection']['selectedRowKeys'];
  onCloseBulkExportModal: ReturnTypeUseOrderExportPrepareListService['action']['handleCloseOrderExportModel'];
  onReloadOrderList: ReturnTypeUseOrderExportPrepareListService['action']['handleReloadOrderList'];
}

export type ReturnTypeUseOrderBulkExportService = ReturnType<typeof useOrderBulkExportService>;

const deliveryCompaniesExcelHeader = ['배송사 이름', '배송코드'];

/**
 * 주문 일괄출고 service
 */
export const useOrderBulkExportService = ({
  selectedRowKeys,
  onCloseBulkExportModal,
  onReloadOrderList: handleReloadOrderList,
}: Props) => {
  const dialog = useDialog();
  const [orderExportSummary, setOrderExportSummary] = useState<OrderExportSummaryModel | undefined>();
  // 출고 대상 item 조회
  const { mutateAsync: getExportableItems } = useMutation((orderItemIds: Array<string>) =>
    getOrderExportableItems(orderItemIds),
  );

  // 배송사 목록코드 조회
  const { mutateAsync: getDeliveryCompanies } = useMutation(() => getDeliveryCompaniesComboList());

  const { mutateAsync: createOrderExportOption } = useMutation(
    (params: Array<OrderExportUploadOptionParams>) => postOrderExportOption(params),
    {
      onError: (error) => {
        dialog.open({
          content: `출고파일 등록처리중 문제가 발생하였습니다.\r\n(${error.data.message})`,
          type: DialogType.ALERT,
        });
      },
    },
  );

  useEffect(() => {
    return () => {
      setOrderExportSummary(undefined);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * 배송사 목록 excel download
   */
  const handleDownloadDeliveryCompanies = async () => {
    const deliveryCompanies = await getDeliveryCompanies();

    excelExport({
      headers: [deliveryCompaniesExcelHeader],
      sheetData: deliveryCompanies.map((item) => {
        return { name: item.name, code: item.code };
      }),
      autoFit: true,
      autoFitRatio: 1.5,
      fileName: '배송사코드.xlsx',
    });
  };

  /**
   * 출고 가능 아이템 excel download
   */
  const handleDownloadExportableItems = async () => {
    const exportableItems = await getExportableItems(selectedRowKeys.map((key) => key.split('_')[1]));

    const excelKeys = Object.keys(OrderExportPrepareExcelCode);

    const headers = excelKeys.map((key) => OrderExportPrepareExcelCode[key] as string);
    const sheetData = toOrderExportUploadItemList(exportableItems.items);

    excelExport({
      headers: [headers],
      sheetData,
      autoFit: true,
      autoFitRatio: 1.2,
      columnMinSize: 9,
      fileName: `export_${toDateFormat(new Date(), 'yyyyMMddHHmm')}.xlsx`,
    });
  };

  const getItemKeyCode = () => {
    return Object.keys(OrderExportPrepareExcelCode).reduce((target, item) => {
      target[OrderExportPrepareExcelCode[item]] = item;

      return target;
    }, {});
  };

  /**
   * 출고 excel 파일 등록
   */
  const handleUploadExportExcelData = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    const uploadedFile = (await excelImport({
      file: files[0],
    })) as Array<Record<string, string>>;
    e.target.value = '';

    !!orderExportSummary && setOrderExportSummary(undefined);
    const itemKeyCode = getItemKeyCode();

    const item: Array<OrderExportExcelItem> = uploadedFile.map<OrderExportExcelItem>((item) => {
      return Object.keys(item).reduce<OrderExportExcelItem>((target, key) => {
        target[itemKeyCode[key]] = item[key];

        return target;
      }, {} as OrderExportExcelItem);
    });

    const exportResponse = await createOrderExportOption(toOrderExportUploadOptionParams(item));
    const exportSummary = toOrderExportSummaryModel(exportResponse);
    const { total, success } = exportSummary;
    if (total > success) {
      setOrderExportSummary(exportSummary);
    }

    dialog.open({
      type: DialogType.ALERT,
      title: '알림',
      content:
        total === success
          ? '출고 일괄 업로드가 완료되었습니다.'
          : `출고 일괄 업로드중 실패한 항목이 있습니다. \r\n출고 결과를 확인해주세요.`,
      onClose: () => {
        if (total === success) {
          handleReloadOrderList();
          handleCloseOrderExportModel();
        }

        dialog.close();
      },
    });
  };

  const handleCloseOrderExportModel = () => {
    !!orderExportSummary && setOrderExportSummary(undefined);
    onCloseBulkExportModal();
  };

  return {
    orderExportSummary,
    handleDownloadDeliveryCompanies,
    handleDownloadExportableItems,
    handleUploadExportExcelData,
    handleCloseOrderExportModel,
  };
};
