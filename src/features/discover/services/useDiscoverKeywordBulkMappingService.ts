import { useDialog } from '@hooks/useDialog';
import useLoading from '@hooks/useLoading';
import { DialogType } from '@models/DialogModel';
import { excelExport, excelImport } from '@utils/excel';
import { useEffect, useState } from 'react';
import {
  DiscoverKeywordMappingType,
  DiscoverKeywordMappingTypeLabel,
  DiscoverKeywordRegistExcelCode,
} from '../constants';
import { useDiscoverKeywordMappingRegistCheckMutation, useModal } from '../hooks';
import {
  ContentsModel,
  DiscoverKeywordBulkRegistSummaryModel,
  GoodsModel,
  ShowroomModel,
  toDiscoverKeywordBulkRegistSummaryModel,
} from '../models';
import { ReturnTypeUseDiscoverKeywordModifyService } from './useDiscoverKeywordModifyService';

export type ReturnTypeUseDiscoverKeywordBulkMappingService = ReturnType<typeof useDiscoverKeywordBulkMappingService>;

interface Props {
  keywordId: string;
  mappingType: DiscoverKeywordMappingType;
  listItems: ReturnTypeUseDiscoverKeywordModifyService['listItems'];
  onReloadTypeList: () => void;
}

/**
 * 디스커버 키워드 맵핑 일괄등록 service
 */
export const useDiscoverKeywordBulkMappingService = ({
  keywordId,
  mappingType,
  listItems,
  onReloadTypeList: handleReloadTypeList,
}: Props) => {
  const [discoverKeywordBulkSummary, setDiscoverKeywordBulkSummary] = useState<
    DiscoverKeywordBulkRegistSummaryModel<GoodsModel | ShowroomModel | ContentsModel> | undefined
  >();

  const dialog = useDialog();
  const { showLoading, hideLoading } = useLoading();
  const {
    isOpenModal: openDiscoverKeywordBulkMappingModal,
    handleOpenModal: handleOpenDiscoverKeywordBulkModel,
    handleCloseModal: handleCloseDiscoverKeywordBulkModel,
  } = useModal();

  const { mutateAsync: requestDiscoverKeywordMappingRegistCheck } = useDiscoverKeywordMappingRegistCheckMutation();

  useEffect(() => {
    return () => {
      setDiscoverKeywordBulkSummary(undefined);
    };
  }, []);

  const getItemKeyCode = () => {
    return Object.keys(DiscoverKeywordRegistExcelCode[mappingType]).reduce((target, item) => {
      target[DiscoverKeywordRegistExcelCode[mappingType][item]] = item;

      return target;
    }, {});
  };

  /**
   * 출고(티켓) 사용완료 처리 템플릿 excel download
   */
  const handleDownloadExcel = async () => {
    excelExport({
      headers: [[`${DiscoverKeywordMappingTypeLabel[mappingType]}ID`]],
      sheetData: [],
      autoFit: true,
      autoFitRatio: 1.5,
      fileName: `키워드 맵핑 ${DiscoverKeywordMappingTypeLabel[mappingType]} 템플릿.xlsx`,
    });
  };

  /**
   * 맵핑타입 item 리턴
   */
  const getMappingTypeItem = () => {
    switch (mappingType) {
      case DiscoverKeywordMappingType.GOODS:
        return listItems.goods;
      case DiscoverKeywordMappingType.CONTENTS:
        return listItems.contents;
      case DiscoverKeywordMappingType.SHOWROOM:
        return listItems.showroom;
    }
  };

  /**
   * 출고(티켓) 일괄등록 처리 excel 파일 등록
   */
  const handleChangeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    const uploadedFile = (await excelImport({
      file: files[0],
    })) as Array<Record<string, string>>;
    e.target.value = '';

    !!discoverKeywordBulkSummary && setDiscoverKeywordBulkSummary(undefined);
    const itemKeyCode = getItemKeyCode();

    const checkIds: Array<string> = uploadedFile
      .map<string>((item) => {
        return Object.keys(item).reduce<string>((target, key) => {
          if (!itemKeyCode[key]) {
            return target;
          }

          return item[key];
        }, null);
      })
      .filter((item) => item !== null);

    if (checkIds.length === 0) {
      dialog.open({
        type: DialogType.ALERT,
        title: '알림',
        content: `디스커버 키워드 일괄등록 처리할 ${DiscoverKeywordMappingTypeLabel[mappingType]}이 없습니다.\r\n 업로드한 엑셀 내용을 확인해주세요.`,
        onClose: () => {
          dialog.close();
        },
      });
      return;
    }

    showLoading();

    const mappingTypeUrl = mappingType === DiscoverKeywordMappingType.CONTENTS ? 'story' : mappingType.toLowerCase();

    const response = await requestDiscoverKeywordMappingRegistCheck({
      localIds: listItems.goods.list.map((item) => item.goodsId),
      checkIds,
      keywordId,
      mappingType: mappingTypeUrl,
    });

    hideLoading();

    const mappingTypeItem = getMappingTypeItem();
    const addedIds = mappingTypeItem.list.map<number>((item) => {
      if (mappingType === DiscoverKeywordMappingType.GOODS) {
        return (item as GoodsModel).goodsId;
      }

      return (item as ContentsModel | ShowroomModel).id;
    });

    const keywordMappingRegistSummary = toDiscoverKeywordBulkRegistSummaryModel(response, mappingType, addedIds);
    const { total, success, items } = keywordMappingRegistSummary;
    setDiscoverKeywordBulkSummary(keywordMappingRegistSummary);

    mappingTypeItem.handleUpdateList(
      items
        .map((item) => {
          if (item.success) {
            return item.item;
          } else {
            return null;
          }
        })
        .filter((item) => item !== null),
      'append',
    );

    dialog.open({
      type: DialogType.ALERT,
      title: '알림',
      content:
        total === success
          ? `디스커버 키워드 일괄등록 처리가 완료되었습니다.\r\n(성공: ${success.toLocaleString()}개 / 전체: ${total.toLocaleString()}개)`
          : `디스커버 키워드 일괄등록 처리중 실패한 항목이 있습니다.\r\n사용완료 처리 결과를 확인해주세요.`,
      onClose: () => {
        dialog.close();
      },
    });
  };

  const handleOpenModal = () => {
    handleOpenDiscoverKeywordBulkModel();
  };

  const handleCloseModal = () => {
    setDiscoverKeywordBulkSummary(undefined);
    handleCloseDiscoverKeywordBulkModel();
  };

  return {
    openDiscoverKeywordBulkMappingModal,
    discoverKeywordBulkSummary,
    handleDownloadExcel,
    handleChangeUpload,
    handleOpenModal,
    handleCloseModal,
  };
};
