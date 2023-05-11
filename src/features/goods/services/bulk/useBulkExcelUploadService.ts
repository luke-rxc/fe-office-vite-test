import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useMutation } from 'react-query';
import { excelImport } from '@utils/excel';
import { ErrorModel, ErrorDataModel } from '@utils/api/createAxios';
import { useDialog } from '@hooks/useDialog';
import useLoading from '@hooks/useLoading';
import { DialogType } from '@models/DialogModel';
import { BulkUploadErrorSchema } from '../../schemas';
import {
  BulkUploadField,
  BulkUploadGoodsRequestParams,
  BulkUploadOptionsRequestParams,
  toConverterGoodsFromExcel,
  toConverterOptionsFromExcel,
  toBulkUploadRequestParams,
} from '../../models';
import { BulkType, BulkReservationType, BulkMessage, BulkTypeLabel, BulkExportErrorLimit } from '../../constants';
import { log, validationUploadBulkHeader, validationUploadBulkData } from '../../utils';
import { postUploadGoodsBaseBulk, postUploadGoodsMappingBulk, postUploadOptionsBulk } from '../../apis';
import type { BulkUploadErrorModalProps } from '../../components/bulk';
import { useBulkHeaderService } from '..';

interface Props {
  onListRefresh: () => void;
}

type UploadErrorType = ErrorModel<BulkUploadErrorSchema & ErrorDataModel>;

/**
 * 상품 일괄수정 > 등록 Field Init Value
 */
const defaultFieldValue: BulkUploadField = {
  uploadBulkType: BulkType.BASE,
  title: '',
  reservationDate: '',
  reservationType: BulkReservationType.DIRECT,
};

export const useBulkExcelUploadService = ({ onListRefresh: handleListRefresh }: Props) => {
  const [registeredExcelFileName, setRegisteredExcelFileName] = useState<string>(null);
  const [isOpenUploadModal, setIsOpenUploadModal] = useState(false);
  const [uploadErrorModal, setUploadErrorModal] = useState<Omit<BulkUploadErrorModalProps, 'onCloseModal'>>(null);
  const [uploadData, setUploadData] = useState([] as Array<Record<string, string>>);
  const formMethod = useForm({
    defaultValues: defaultFieldValue,
  });
  const { open: dialogOpen, close: dialogClose } = useDialog();
  const { showLoading, hideLoading } = useLoading();
  const { getValues, reset } = formMethod;

  /** API : Header 기준 조회 */
  const { bulkHeaders } = useBulkHeaderService();

  /**
   * API : 업로드 실패에 대한 처리
   */
  const handleUploadError = (error: UploadErrorType, bulkUploadType: BulkType) => {
    if (error.data.messages) {
      errorBulkUploadServerValid(error.data.messages, bulkUploadType);
      return;
    }
    errorUploadDialog();
  };

  /** API : 등록 (기본정보) */
  const { mutateAsync: uploadGoodsBaseBulk, isLoading: isUploadGoodsBaseBulkLoading } = useMutation(
    (params: BulkUploadGoodsRequestParams) => postUploadGoodsBaseBulk(params),
    {
      onSuccess: () => {
        successUploadDialog();
      },
      onError: (error: UploadErrorType) => {
        handleUploadError(error, BulkType.BASE);
      },
    },
  );

  /** API : 등록 (매핑정보) */
  const { mutateAsync: uploadGoodsMappingBulk, isLoading: isUploadGoodsMappingBulkLoading } = useMutation(
    (params: BulkUploadGoodsRequestParams) => postUploadGoodsMappingBulk(params),
    {
      onSuccess: () => {
        successUploadDialog();
      },
      onError: (error: UploadErrorType) => {
        handleUploadError(error, BulkType.MAPPING);
      },
    },
  );

  /** API : 등록 (옵션정보) */
  const { mutateAsync: uploadOptionsBulk, isLoading: isUploadOptionBulkLoading } = useMutation(
    (params: BulkUploadOptionsRequestParams) => postUploadOptionsBulk(params),
    {
      onSuccess: () => {
        successUploadDialog();
      },
      onError: (error: UploadErrorType) => {
        handleUploadError(error, BulkType.OPTION);
      },
    },
  );

  /** Dialog : 등록완료 */
  const successUploadDialog = () => {
    dialogOpen({
      title: '등록완료',
      content: '등록이 완료되었습니다',
      type: DialogType.ALERT,
      onClose: () => {
        dialogClose();
        handleCloseUploadModal();
        handleListRefresh();
      },
    });
  };

  /** Dialog : 등록실패 */
  const errorUploadDialog = (message?: string) => {
    dialogOpen({
      title: '등록 실패',
      content: message ?? '등록이 실패되었습니다',
      type: DialogType.ALERT,
    });
  };

  /** Error Modal Validation : Server Error */
  const errorBulkUploadServerValid = (messages: BulkUploadErrorSchema['messages'], bulkUploadType: BulkType) => {
    const messageList = messages.map(({ goodsId, optionId, message }, index) => {
      return {
        id: `${goodsId ?? 'goodsId'}_${optionId ?? 'optionId'}_${index}`,
        goodsId: goodsId ? `${goodsId}` : '',
        optionId: optionId || optionId === 0 ? `${optionId}` : undefined,
        reason: message,
      };
    });

    errorBulkUploadData({
      list: messageList,
      total: messageList.length,
      bulkType: bulkUploadType,
    });
  };

  /** Error Modal Open */
  const errorBulkUploadData = ({
    list,
    total,
    bulkType,
  }: Omit<BulkUploadErrorModalProps, 'isOpen' | 'onCloseModal'>) => {
    setUploadErrorModal((prev) => ({
      ...prev,
      list: list.slice(0, BulkExportErrorLimit),
      total,
      bulkType,
      isOpen: true,
    }));
  };

  /** Error Modal Close */
  const handleCloseUploadErrorModal = () => {
    setUploadErrorModal((prev) => ({
      ...prev,
      isOpen: false,
    }));
  };

  /** Upload Modal Open */
  const handleOpenUploadModal = () => {
    setIsOpenUploadModal(true);
  };

  /** Upload Modal Close */
  const handleCloseUploadModal = () => {
    // data reset
    reset({
      ...defaultFieldValue,
    });

    // upload file data reset
    setUploadData([]);
    setRegisteredExcelFileName(null);

    // modal Close
    setIsOpenUploadModal(false);
  };

  /**
   * Action : Submit
   */
  const handleExcelUploadSubmit = async (values: BulkUploadField) => {
    log('[handleExcelUploadSubmit]', values);

    if (!registeredExcelFileName) {
      toast.error('엑셀 파일을 등록해 주세요');
      return;
    }

    const uploadBulkType = getValues('uploadBulkType');
    const isBulkBaseType = uploadBulkType === BulkType.BASE;
    const isBulkMappingType = uploadBulkType === BulkType.MAPPING;
    const isBulkOptionType = uploadBulkType === BulkType.OPTION;
    const { entries: bulkHeaderEntries } = bulkHeaders;

    const items = isBulkOptionType
      ? toConverterOptionsFromExcel(bulkHeaderEntries, uploadData)
      : toConverterGoodsFromExcel(bulkHeaderEntries, uploadData);

    if (!validationUploadBulkHeader(bulkHeaders, uploadBulkType, items[0])) {
      errorUploadDialog(`${BulkTypeLabel[uploadBulkType]} ${BulkMessage.FAIL_UPLOAD_TYPE}`);
      return;
    }

    const errorList = validationUploadBulkData(uploadBulkType, items);
    if (!!errorList.length) {
      errorBulkUploadData({
        list: errorList,
        total: errorList.length,
        bulkType: uploadBulkType,
      });
      return;
    }

    // log('[handleExcelUploadSubmit]uploadData', uploadData);
    // log('[handleExcelUploadSubmit]items', items);

    // 업로드 Data Mapping
    const params = toBulkUploadRequestParams(values, items);
    log('[handleExcelUploadSubmit]request Params', params);

    /**
     * @todo refactoring 필요
     */
    if (isBulkBaseType) {
      await uploadGoodsBaseBulk(params as BulkUploadGoodsRequestParams);
      return;
    }

    if (isBulkMappingType) {
      await uploadGoodsMappingBulk(params as BulkUploadGoodsRequestParams);
      return;
    }

    await uploadOptionsBulk(params as BulkUploadOptionsRequestParams);
  };

  /**
   * 엑셀 업로드
   */
  const handleExcelUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    const targetFile = files[0];
    const uploadedFile = (await excelImport({
      file: targetFile,
    })) as Array<Record<string, string>>;
    e.target.value = '';

    setRegisteredExcelFileName(uploadedFile.length > 0 ? targetFile.name : null);
    setUploadData(uploadedFile);
  };

  useEffect(() => {
    return () => {
      handleCloseUploadModal();
      setUploadErrorModal(null);
      dialogClose();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    isUploadGoodsBaseBulkLoading || isUploadGoodsMappingBulkLoading || isUploadOptionBulkLoading
      ? showLoading()
      : hideLoading();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isUploadGoodsBaseBulkLoading, isUploadGoodsMappingBulkLoading, isUploadOptionBulkLoading]);

  return {
    formMethod,
    isOpenUploadModal,
    registeredExcelFileName,
    uploadErrorModal,
    handleCloseUploadErrorModal,
    handleOpenUploadModal,
    handleCloseUploadModal,
    handleExcelUploadSubmit,
    handleExcelUpload,
  };
};
