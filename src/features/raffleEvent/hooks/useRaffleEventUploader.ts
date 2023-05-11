import { useDialog } from '@hooks/useDialog';
import { DialogType } from '@models/DialogModel';
import { UploadFileInfo } from '@models/UploadModel';
import { useFileUploader, UploadDomainType } from '@services/useFileUploader';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { RaffleEventDetailFormField } from '../types';

interface Props {
  formMethod: UseFormReturn<RaffleEventDetailFormField>;
  selectedTimesIndex: number;
}

export type ReturnTypeUseRaffleEventUploader = ReturnType<typeof useRaffleEventUploader>;

export const useRaffleEventUploader = ({ formMethod, selectedTimesIndex }: Props) => {
  const dialog = useDialog();
  const [uploadFileList, setUploadFileList] = useState<Array<Array<UploadFileInfo>>>([]);

  const { fileInfos, handleUpdateFileInfo, handleUpload, handleRemove } = useFileUploader({
    domainType: UploadDomainType.RAFFLE,
    initFileInfos: [],
  });

  /**
   * 업로드 파일 update
   */
  const handleUpdateFile = useCallback(
    (fileInfos: UploadFileInfo | null, targetIndex: number) => {
      if (!fileInfos) {
        handleRemove(0);
        return;
      }

      handleUpdateFileInfo([fileInfos], true);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  useEffect(() => {
    const fileInfos = uploadFileList[selectedTimesIndex];
    handleUpdateFile(fileInfos ? fileInfos[0] : null, selectedTimesIndex);
  }, [handleUpdateFile, selectedTimesIndex, uploadFileList]);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const currentFileInfo = useMemo(() => {
    return uploadFileList[selectedTimesIndex];
  }, [selectedTimesIndex, uploadFileList]);

  /**
   * 파일 업로드 change
   */
  const handleChangeUploadFile = async (fileInfos: Array<UploadFileInfo>) => {
    try {
      const uploadFiles = await handleUpload(fileInfos);
      const items = [...uploadFileList];
      items[selectedTimesIndex] = uploadFiles;
      setUploadFileList(items);
      handleUpdateFileInfo(uploadFiles, true);
      return {
        id: uploadFiles[0].id,
        fileType: uploadFiles[0].fileType,
      };
    } catch (e) {
      dialog.open({
        content: '미디어(이미지/동영상) 업로드에 문제가 발생하였습니다. 다시 확인해주세요.',
        type: DialogType.ALERT,
      });
    }
  };

  /**
   * 업로드 파일 제거
   */
  const handleRemoveUploadFile = (index: number) => {
    handleRemove(index);
    const items = [...uploadFileList];
    items[selectedTimesIndex] = null;
    setUploadFileList(items);
  };

  /**
   * 회차별 파일 위치 수정
   */
  const handleMoveUploadFile = (sourceIndex: number, destinationIndex: number) => {
    const newUploadFileList = Array.from(uploadFileList);
    const [removed] = newUploadFileList.splice(sourceIndex, 1);
    newUploadFileList.splice(destinationIndex, 0, removed);
    setUploadFileList(newUploadFileList);
    // newUploadFileList.forEach((uploadItems, index) => {
    //   const mediaId = uploadItems && uploadItems[0] ? uploadItems[0].id.toString() : '';
    //   const mediaType = uploadItems && uploadItems[0] ? uploadItems[0].fileType : '';
    //   setValue(`itemList.${index}.mediaId`, mediaId);
    //   setValue(`itemList.${index}.fileType`, mediaType);
    //   trigger(`itemList.${index}.mediaId`);
    // });
  };

  /**
   * 회차별 파일 리스트에 item 추가
   */
  const handleAppendUploadFile = (fileInfos: Array<UploadFileInfo> | null, targetIndex?: number) => {
    const newUploadFileList = Array.from(uploadFileList);
    newUploadFileList.splice(targetIndex !== undefined ? targetIndex : uploadFileList.length, 0, fileInfos);
    setUploadFileList(newUploadFileList);
  };

  /**
   * 회차별 파일 리스트 업데이트
   */
  const handleUpdateFileList = (fileInfosList: Array<Array<UploadFileInfo>>) => {
    setUploadFileList(fileInfosList);
  };
  /**
   * 회차별 파일 리스트 아이템 제거
   */
  const handleRemoveFileListItem = (targetIndex: number) => {
    setUploadFileList((prev) => {
      return prev.filter((item, index) => index !== targetIndex);
    });
  };

  return {
    fileInfos,
    uploadFileList,
    handleChangeUploadFile,
    handleRemoveUploadFile,
    handleUpdateFile,
    handleMoveUploadFile,
    handleAppendUploadFile,
    handleUpdateFileList,
    handleRemoveFileListItem,
  };
};
