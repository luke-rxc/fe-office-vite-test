import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import difference from 'lodash/difference';
import { excelExport } from '@utils/excel';
import { GoodsKind } from '@constants/goods';
import { ListSearchQueryState, BulkHeaderModel, toSearchRequest, toBulkExportModel } from '../../models';
import { BulkType, ManagerListMessage, BulkAutoGenerateKeys } from '../../constants';
import { postExportBulk } from '../../apis';
import { BulkCbListProps } from '../../types';
import { useBulkHeaderService, useDialogService } from '..';

interface Props {
  queryState: ListSearchQueryState;
}

/** Action 상품일괄 업데이트 기본서식(기본정보 or 옵션정보) */
const getBulkExcelHeader = (sheetCode: BulkHeaderModel['entries'], headers: string[]) => {
  const headerLabels = headers.map((header) => {
    return sheetCode[header];
  });
  return headerLabels;
};

const getBulkExcelFileName = (type: BulkType) => {
  if (type === BulkType.OPTION) {
    return 'bulk_option';
  }

  if (type === BulkType.MAPPING) {
    return 'bulk_goods_mapping';
  }

  return 'bulk_goods_base';
};

export const useManagerListBulkService = ({ queryState }: Props) => {
  // 일괄 수정 상품 버튼 관리
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [isBulkDownloading, setIsBulkDownloading] = useState(false);
  const [bulkCbList, setBulkCbList] = useState<BulkCbListProps>(null);
  const { errorDialog } = useDialogService();

  /** API : Header 기준 조회 */
  const { bulkHeaders } = useBulkHeaderService();

  /**
   * 일괄수정 모달 오픈 (조건에 맞춰 체크 후 모달오픈여부 결정)
   * @see https://www.notion.so/rxc/7a4a6425ef2d44db9f12e2ffdfa85ebe#d713cf1bbd6e44f98bee66a953212682
   */
  const handleBulkModalOpen = () => {
    const { name, goodsIds, brandIds, providerIds } = queryState;
    const isActiveName = name && !!name.trim();
    const isActiveGoodsIds = goodsIds && !!goodsIds.trim();
    const isActiveBrandIds = brandIds && !!brandIds.trim();
    const isActiveProviderIds = providerIds && !!providerIds.trim();
    const isActive = [isActiveName, isActiveGoodsIds, isActiveBrandIds, isActiveProviderIds].some((v) => v);

    if (!isActive) {
      errorDialog({
        message: ManagerListMessage.REQUIRED_EXPORT_BULK,
        titleDisabled: true,
      });
      return;
    }

    setIsBulkModalOpen(true);
  };

  const handleBulkModalClose = () => {
    isBulkModalOpen && setIsBulkModalOpen(false);
  };

  const makeExcel = (sheetData: Record<string, string>[], headers: string[], fileName: string) => {
    if (!sheetData || sheetData.length === 0) {
      return;
    }

    try {
      excelExport({
        sheetData,
        fileName,
        headers: [headers],
        autoFit: true,
        autoFitRatio: 1.2,
        columnMinSize: 15,
      });
    } catch (e) {
      toast.error(ManagerListMessage.FAIL_EXPORT_BULK);
    }
  };

  const handleBulkExcelDownload = async (type: BulkType, headers: string[]) => {
    // 티켓_연동으로 검색된 결과라면 다운로드를 진행하지 않음
    const { goodsKind } = queryState;
    const isBulkListUpdateTypeGoods = !(type === BulkType.OPTION);
    if (goodsKind && goodsKind === GoodsKind.TICKET_AGENT && !isBulkListUpdateTypeGoods) {
      toast.error(ManagerListMessage.VALID_EXPORT_BULK.GOODS_KIND);
      return;
    }

    setIsBulkDownloading(true);

    try {
      const params = {
        ...toSearchRequest(queryState),
        headers,
      };

      const { entries: bulkHeaderEntries } = bulkHeaders;
      const res = await postExportBulk(type, params);
      const sheetData = toBulkExportModel(res);
      const sheetHeaders = getBulkExcelHeader(bulkHeaderEntries, res.headers);
      makeExcel(sheetData, sheetHeaders, `${getBulkExcelFileName(type)}.xlsx`);
      handleBulkModalClose();
      setIsBulkDownloading(false);
    } catch (e) {
      toast.error(ManagerListMessage.FAIL_EXPORT_BULK);
      setIsBulkDownloading(false);
    }
  };

  useEffect(() => {
    if (bulkHeaders && !bulkCbList) {
      const {
        group: { goods, goodsMapping, option },
      } = bulkHeaders;

      const uniqueGoods = difference(goods, BulkAutoGenerateKeys);
      const uniqueGoodsMapping = difference(goodsMapping, BulkAutoGenerateKeys);
      const uniqueOption = difference(option, BulkAutoGenerateKeys);

      setBulkCbList({
        base: uniqueGoods,
        mapping: uniqueGoodsMapping,
        option: uniqueOption,
      });
    }
  }, [bulkHeaders, bulkCbList]);

  useEffect(() => {
    return () => {
      handleBulkModalClose();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    isBulkModalOpen,
    isBulkDownloading,
    bulkCbList,
    bulkHeaderEntries: bulkHeaders?.entries ?? null,
    handleBulkExcelDownload,
    handleBulkModalOpen,
    handleBulkModalClose,
  };
};
