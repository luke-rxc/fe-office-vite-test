/** @todo Refactoring, type 강화 필요 */

import React, { useCallback } from 'react';
import toast from 'react-hot-toast';
import { useFormContext } from 'react-hook-form';
import { excelExport, excelImport } from '@utils/excel';
import { toDateFormat } from '@utils/date';
import { GoodsKind, TicketType } from '@constants/goods';
import {
  OptExcelSheetCode,
  ExcelDownloadForm,
  ExcelDownloadSheetName,
  ExcelUploadErrorQueueType,
  OptExcelUploadType,
  OptListRegisterLimit,
} from '../../constants';
import { getRate, toDateTimestampFromString } from '../../utils';
import { OptionsInfoProp, StateModel, OptListModel } from '../../models';

interface UploadConverterReturnProps extends OptionsInfoProp {
  errorQueues: string[];
}

interface UploadConverterProps {
  uploadedFile: any;
  selectedGoodsKind: GoodsKind;
  selectedTicketTypeId: TicketType;
}

/** Import : 기본 배송 상품 옵션 엑셀 Format */
const getGoodsOptionExcelBase = (obj: any, idx: number) => {
  const { id, consumerPrice, price, stock, commissionRate } = OptExcelSheetCode.BASE;
  const {
    // 엑셀 한글 이름 : 값
    [id]: _id,
    [consumerPrice]: _consumerPrice,
    [price]: _price,
    [stock]: _stock,
    [commissionRate]: _commissionRate,
    ...objOpts
  } = obj;
  const opts = {
    id: _id ?? '',
    consumerPrice: _consumerPrice ?? '',
    price: _price ?? '',
    discountRate: getRate(_consumerPrice, _price) ?? 0,
    stock: _stock ?? '',
    commissionRate: _commissionRate ?? '',
    idx,
    key: `option-key-${idx}`,
  };

  return {
    objOpts,
    opts,
  };
};

/**
 * Import : 티켓 상품 옵션 엑셀 Format
 */
const getGoodsOptionExcelBaseTicket = (obj: any, idx: number) => {
  const { id, consumerPrice, price, stock, ticketGoodsId, commissionRate } = OptExcelSheetCode.TICKET_BASE;
  const {
    // 엑셀 한글 이름 : 값
    [id]: _id,
    [consumerPrice]: _consumerPrice,
    [price]: _price,
    [stock]: _stock,
    [ticketGoodsId]: _ticketGoodsId,
    [commissionRate]: _commissionRate,
    ...objOpts
  } = obj;
  const opts = {
    id: _id ?? '',
    consumerPrice: _consumerPrice ?? '',
    price: _price ?? '',
    discountRate: getRate(_consumerPrice, _price) ?? 0,
    stock: _stock ?? '',
    ticketGoodsId: _ticketGoodsId,
    commissionRate: _commissionRate ?? '',
    idx,
    key: `option-key-${idx}`,
  };

  return {
    objOpts,
    opts,
  };
};

const getGoodsOptionExcelBookTicket = (obj: any, idx: number, selectedTicketTypeId: TicketType) => {
  const isBookDatedTicket = selectedTicketTypeId === TicketType.BOOKING_DATED;
  const { id, bookingDate, consumerPrice, price, depositPrice, stock, ticketGoodsId, commissionRate } =
    isBookDatedTicket ? OptExcelSheetCode.TICKET_BOOK_DATED : OptExcelSheetCode.TICKET_BOOK_UNDATED;
  const {
    // 엑셀 한글 이름 : 값
    [id]: _id,
    [bookingDate]: _bookingDate,
    [consumerPrice]: _consumerPrice,
    [price]: _price,
    [depositPrice]: _depositPrice,
    [stock]: _stock,
    [ticketGoodsId]: _ticketGoodsId,
    [commissionRate]: _commissionRate,
    ...objOpts
  } = obj;
  const opts = {
    id: _id ?? '',
    bookingDate: isBookDatedTicket ? toDateTimestampFromString(_bookingDate) : null,
    consumerPrice: _consumerPrice ?? '',
    price: _price ?? '',
    depositPrice: _depositPrice ?? '',
    discountRate: getRate(_consumerPrice, _price) ?? 0,
    stock: _stock ?? '',
    ticketGoodsId: _ticketGoodsId,
    commissionRate: _commissionRate ?? 0,
    idx,
    key: `option-key-${idx}`,
  };

  return {
    objOpts,
    opts,
  };
};

const handleExcelUploadConverter = ({
  uploadedFile,
  selectedGoodsKind,
  selectedTicketTypeId,
}: UploadConverterProps): UploadConverterReturnProps => {
  const isGoodsKindReal = selectedGoodsKind === GoodsKind.REAL;
  const isBookTicket = [TicketType.BOOKING_DATED as string, TicketType.BOOKING_UNDATED as string].includes(
    selectedTicketTypeId,
  );
  const errorQueues = [];
  const optionTitles = [];
  const optionLists = Array.from(uploadedFile, (obj: any, index: number) => {
    const { objOpts, opts } = isGoodsKindReal
      ? getGoodsOptionExcelBase(obj, index)
      : isBookTicket
      ? getGoodsOptionExcelBookTicket(obj, index, selectedTicketTypeId)
      : getGoodsOptionExcelBaseTicket(obj, index);

    // validation & transpile option
    try {
      Object.keys(objOpts).forEach((optName, optsIndex) => {
        const detailOptName = optName.split(`opt${optsIndex + 1}_`)[1];
        if (optName.indexOf('opt') > -1 && detailOptName) {
          if (index === 0) {
            optionTitles.push(detailOptName);
          }
          opts[`option${optsIndex + 1}`] = objOpts[optName] ?? '';
        } else {
          throw ExcelUploadErrorQueueType.OPTION;
        }
      });
    } catch (e) {
      errorQueues.push(e);
    }

    return opts;
  });

  return {
    optionLists,
    optionTitles,
    errorQueues,
  };
};

const getExcelUploadType = (selectedGoodsKind: GoodsKind, selectedTicketTypeId: TicketType) => {
  if (selectedGoodsKind !== GoodsKind.REAL) {
    if (selectedTicketTypeId === TicketType.BOOKING_DATED) {
      return OptExcelUploadType.TICKET_BOOK_DATED;
    }

    if (selectedTicketTypeId === TicketType.BOOKING_UNDATED) {
      return OptExcelUploadType.TICKET_BOOK_UNDATED;
    }

    return OptExcelUploadType.TICKET_BASE;
  }

  return OptExcelUploadType.BASE;
};

interface Props {
  updateOptionsInfo: (info: OptionsInfoProp) => void;
  selectedGoodsKind: GoodsKind;
  selectedTicketTypeId: TicketType;
}

export const useDetailOptionExcelService = ({ updateOptionsInfo, selectedGoodsKind, selectedTicketTypeId }: Props) => {
  const { setValue, getValues, clearErrors } = useFormContext<StateModel>();
  const uploadType = getExcelUploadType(selectedGoodsKind, selectedTicketTypeId);
  const isKindTicketAgent = selectedGoodsKind === GoodsKind.TICKET_AGENT;

  /** Export : Header */
  const getExcelHeader = useCallback(() => {
    const optionTitles = getValues('optionTitles');
    /** @todo type */
    const opts = optionTitles.map((optionTitle, index) => {
      const idx = index + 1;
      return `opt${idx}_${optionTitle}`;
    });

    /** @todo type issue */
    // const optExcelSheetCode = OptExcelSheetCode[uploadType];

    // TICKET_BOOK_UNDATED
    if (uploadType === OptExcelUploadType.TICKET_BOOK_UNDATED) {
      /** @todo type issue */
      // const { id, consumerPrice, price, stock, commissionRate, ticketGoodsId } = optExcelSheetCode;

      const { id, consumerPrice, price, depositPrice, stock, commissionRate, ticketGoodsId } =
        OptExcelSheetCode[uploadType];
      const ticketGoodsIdRaw = isKindTicketAgent ? [ticketGoodsId] : [];
      return [id, ...opts, consumerPrice, price, depositPrice, stock, commissionRate, ...ticketGoodsIdRaw];
    }

    if (uploadType === OptExcelUploadType.TICKET_BOOK_DATED) {
      const { id, bookingDate, consumerPrice, price, depositPrice, stock, commissionRate, ticketGoodsId } =
        OptExcelSheetCode[uploadType];
      const ticketGoodsIdRaw = isKindTicketAgent ? [ticketGoodsId] : [];
      return [id, bookingDate, ...opts, consumerPrice, price, depositPrice, stock, commissionRate, ...ticketGoodsIdRaw];
    }

    if (uploadType === OptExcelUploadType.TICKET_BASE) {
      const { id, consumerPrice, price, stock, commissionRate, ticketGoodsId } = OptExcelSheetCode[uploadType];
      const ticketGoodsIdRaw = isKindTicketAgent ? [ticketGoodsId] : [];
      return [id, ...opts, consumerPrice, price, stock, commissionRate, ...ticketGoodsIdRaw];
    }

    // BASE
    if (uploadType === OptExcelUploadType.BASE) {
      const { id, consumerPrice, price, stock, commissionRate } = OptExcelSheetCode[uploadType];
      return [id, ...opts, consumerPrice, price, stock, commissionRate];
    }

    return null;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uploadType]);

  /** 옵션 리스트 중에 isDeleted의 설정이 없는 부분만 Filtering */
  const getOptionList = () => {
    const optionLists = getValues('optionLists');
    return optionLists.filter((optionList) => !optionList['isDeleted']);
  };

  /** Export : SheetData */
  const getExcelOptionLists = () => {
    const optionLists = getOptionList();
    const optionTitles = getValues('optionTitles');
    const getOptionData = (optionList: OptListModel) => {
      return optionTitles.reduce((current, _, index) => {
        const optName = `option${index + 1}`;
        current[optName] = optionList[optName];
        return current;
      }, {});
    };

    // TICKET_BOOK_UNDATED
    if (uploadType === OptExcelUploadType.TICKET_BOOK_UNDATED) {
      return optionLists.reduce((current, optionList, index: number) => {
        const { id, consumerPrice, price, depositPrice, stock, commissionRate, ticketGoodsId } = optionList;
        const optionData = getOptionData(optionList);
        const ticketGoodsIdRaw = isKindTicketAgent ? { ticketGoodsId: ticketGoodsId ?? '' } : {};
        current[index] = {
          id,
          ...optionData,
          consumerPrice,
          price,
          depositPrice,
          stock,
          commissionRate,
          ...ticketGoodsIdRaw,
        };
        return current;
      }, []);
    }

    // TICKET_BOOK_UNDATED
    if (uploadType === OptExcelUploadType.TICKET_BOOK_DATED) {
      return optionLists.reduce((current, optionList, index: number) => {
        const { id, bookingDate, consumerPrice, price, depositPrice, stock, commissionRate, ticketGoodsId } =
          optionList;
        const optionData = getOptionData(optionList);
        const ticketGoodsIdRaw = isKindTicketAgent ? { ticketGoodsId: ticketGoodsId ?? '' } : {};
        current[index] = {
          id,
          bookingDate: bookingDate ? toDateFormat(bookingDate, 'yyMMdd') : '',
          ...optionData,
          consumerPrice,
          price,
          depositPrice,
          stock,
          commissionRate,
          ...ticketGoodsIdRaw,
        };
        return current;
      }, []);
    }

    // TICKET_BASE
    if (uploadType === OptExcelUploadType.TICKET_BASE) {
      return optionLists.reduce((current, optionList, index: number) => {
        const { id, consumerPrice, price, stock, commissionRate, ticketGoodsId } = optionList;
        const optionData = getOptionData(optionList);
        const ticketGoodsIdRaw = isKindTicketAgent ? { ticketGoodsId: ticketGoodsId ?? '' } : {};
        current[index] = {
          id,
          ...optionData,
          consumerPrice,
          price,
          stock,
          commissionRate,
          ...ticketGoodsIdRaw,
        };
        return current;
      }, []);
    }

    // BASE
    if (uploadType === OptExcelUploadType.BASE) {
      return optionLists.reduce((current, optionList, index: number) => {
        const { id, consumerPrice, price, stock, commissionRate } = optionList;
        const optionData = getOptionData(optionList);
        current[index] = { id, ...optionData, consumerPrice, price, stock, commissionRate };
        return current;
      }, []);
    }
  };

  const handleExcelDownload = () => {
    const optionLists = getOptionList();
    const isBaseExcelFormDownload = !optionLists.length;

    // 기본 엑셀 서식
    /** @todo refactoring */
    if (isBaseExcelFormDownload) {
      const downloadForm = ExcelDownloadForm[uploadType];

      if (selectedGoodsKind === GoodsKind.TICKET_NORMAL) {
        delete downloadForm[ExcelDownloadSheetName.ticketGoodsId];
      }

      excelExport({
        sheetData: [downloadForm],
      });

      return;
    }

    // 리스트 엑셀 서식
    const headers = getExcelHeader();
    const sheetData = getExcelOptionLists();

    excelExport({
      sheetData,
      headers: [headers],
      autoFit: true,
      autoFitRatio: 1.2,
      columnMinSize: 15,
    });
  };

  const handleExcelUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    const uploadedFile = await excelImport({
      file: files[0],
    });
    e.target.value = '';

    const { optionTitles, optionLists, errorQueues } = handleExcelUploadConverter({
      uploadedFile,
      selectedGoodsKind,
      selectedTicketTypeId,
    });

    if (optionLists.length > OptListRegisterLimit) {
      toast.error(`옵션은 최대 ${OptListRegisterLimit}개까지 등록 가능합니다.`);
      return;
    }

    if (errorQueues.length) {
      toast.error(errorQueues[0]);
      return;
    }

    // 옵션 업로드시 오류 메시지 초기화
    clearErrors('optionLists');

    setValue('optionLists', []);
    updateOptionsInfo({
      optionTitles,
      optionLists,
    });
  };

  return {
    handleExcelDownload,
    handleExcelUpload,
  };
};
