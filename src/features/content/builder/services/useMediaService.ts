import { useState, useCallback, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { UploadFileInfo } from '@models/UploadModel';
import { useFormValueService } from './useFormValueService';

/**
 * 미디어 파일 UI 제어 - 미디어 삭제, 추가, 순서변경
 * - 미디어에 연결 된 폼 데이터 업데이트 처리
 */
type MediaServiceProps = {
  initFileInfo: { file?: any }[];
  singleType?: boolean; // 싱글 - 리스트 형태 여부
  id?: number; // 컴포넌트 id
  formKey?: string; // 컴포넌트 업데이트 대상 form key명
};

export const useMediaService = ({ initFileInfo = [], singleType = false, id, formKey }: MediaServiceProps) => {
  const {
    formState: { errors },
  } = useFormContext();
  const { handleChangeMedia, handleRemoveMedia, handleSortMedia } = useFormValueService();

  const [fileInfo, setFileInfo] = useState<UploadFileInfo[]>(initFileInfo); // 업로드 미디어(비디오, 이미지) 리스트
  const [fileErrors, setFileErrors] = useState([]); // form 에러상태

  /**
   * 미디어 추가
   */
  const handleChange = useCallback(
    (updateFiles: UploadFileInfo[], replace: boolean = false) => {
      setFileErrors([]);
      if (singleType) {
        setFileInfo(updateFiles);
      } else {
        const targetFileInfos = replace ? updateFiles : fileInfo.concat(updateFiles);
        setFileInfo(targetFileInfos);
      }

      handleChangeMedia({
        id,
        formKey,
        isSingleType: singleType,
        updateFiles,
        replace,
      });
    },
    [fileInfo, formKey, handleChangeMedia, id, singleType],
  );

  /**
   * 순서 변경
   * @param sourceIndex
   * @param targetIndex
   * @param id
   * @param formKey
   */
  const handleSort = (sourceIndex: number, targetIndex: number) => {
    [fileInfo[sourceIndex], fileInfo[targetIndex]] = [fileInfo[targetIndex], fileInfo[sourceIndex]];
    setFileInfo([...fileInfo]);

    [fileErrors[sourceIndex], fileErrors[targetIndex]] = [fileErrors[targetIndex], fileErrors[sourceIndex]];
    setFileErrors([...fileErrors]);

    handleSortMedia({
      id,
      formKey,
      sourceIndex,
      targetIndex,
    });
  };

  /**
   * 미디어 삭제
   */
  const handleRemove = useCallback(
    (index: number) => {
      const targetFileInfos = fileInfo.filter((_, idx) => {
        return index !== idx;
      });
      setFileInfo(targetFileInfos);
      const targetFileErrors = fileErrors.filter((_, idx) => {
        return index !== idx;
      });
      setFileErrors(targetFileErrors);

      handleRemoveMedia({
        id,
        formKey,
        isSingleType: singleType,
        index,
      });
    },
    [fileErrors, fileInfo, formKey, handleRemoveMedia, id, singleType],
  );

  // 필수 이미지 체크
  useEffect(() => {
    const error = errors[id]?.contents?.[formKey];
    if (error) {
      setFileErrors(singleType ? [error] : error);
    } else {
      setFileErrors([]);
    }
  }, [errors, formKey, id, singleType]);

  return {
    fileErrors,
    fileInfo,
    handleChange,
    handleRemove,
    handleSort,
  };
};
