import { useRef, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { useParams } from 'react-router';
import { pathConfig } from '@config';
import { useMutation } from '@hooks/useMutation';
import useLoading from '@hooks/useLoading';
import { useDialog } from '@hooks/useDialog';
import { DialogType } from '@models/DialogModel';
import { CONTENT_SUBMIT_TYPE } from '../constants';
import { ContentFormModel, toComponentReqParam } from '../models';
import { useContentContext } from '../hooks';
import { postContent, postPreview } from '../apis';
import { PreviewResSchema } from '../schemas';
import { getMediaFileList } from '../utils';
import { useContentMediaUploadService } from './useContentMediaUploadService';

export const useSubmitService = () => {
  const { id } = useParams();
  const { contentData } = useContentContext();
  const { handleSubmit, formState, getValues } = useFormContext();
  const { showLoading, hideLoading } = useLoading();
  const { open: dialogOpen, close: dialogClose } = useDialog();
  const { handleMediaUpload } = useContentMediaUploadService(); // 파일 업로드 서비스
  const [isLoading, setIsLoading] = useState(false);

  // 컨텐츠 저장
  const { mutateAsync: submitContentComponentMutate } = useMutation(postContent, {
    onError: (error) => {
      hideLoading();
      dialogOpen({
        title: '저장 실패',
        content: `${error.data.message || '컨텐츠를 수정 할 수 없습니다.'}`,
        type: DialogType.ALERT,
        onClose: () => {
          dialogClose();
        },
      });
    },
  });
  // 컨텐츠 미리보기
  const { mutateAsync: submitContentPreviewMutate } = useMutation(postPreview, {
    onError: (error) => {
      hideLoading();
      dialogOpen({
        title: '미리보기 실패',
        content: `${error.data.message || '미리보기를 실행 할 수 없습니다.'}`,
        type: DialogType.ALERT,
        onClose: () => {
          dialogClose();
        },
      });
    },
  });
  const submitType = useRef<CONTENT_SUBMIT_TYPE>(CONTENT_SUBMIT_TYPE.SAVE);
  const submitDateTime = useRef<string>(''); // 미리보기 제공 시점

  /**
   * 저장/미리보기 클릭시 파일업로드 처리 - validation - 저장 순서로 처리
   * @param type
   */
  const handleContentSubmit = async (type: CONTENT_SUBMIT_TYPE, dateTime?: string) => {
    submitType.current = type;
    submitDateTime.current = dateTime;

    // 파일 업로드 처리
    const mediaFileList = getMediaFileList(getValues() as ContentFormModel);
    showLoading('이미지/비디오 업로드 중입니다.');
    setIsLoading(true);
    try {
      await handleMediaUpload(mediaFileList);
    } catch (error) {}

    // submit
    handleSubmit(handleFormSubmit, () => handleInvalidData(type))();
    hideLoading();
    setIsLoading(false);
  };

  /**
   * 폼 검증 후, DATA 저장
   * @param contentFormValues
   * @returns
   */
  const handleFormSubmit = async (contentFormValues: ContentFormModel) => {
    const componentReqParam = toComponentReqParam(contentFormValues, contentData); // request Data
    const submitTypeValue = submitType.current;
    const saveFn =
      submitTypeValue === CONTENT_SUBMIT_TYPE.SAVE ? submitContentComponentMutate : submitContentPreviewMutate;
    showLoading('콘텐츠 정보를 저장 중입니다.');
    setIsLoading(true);
    const saveRes = await saveFn({
      contentId: id,
      params: componentReqParam,
    });
    hideLoading();
    setIsLoading(false);

    if (submitTypeValue === CONTENT_SUBMIT_TYPE.SAVE) {
      dialogOpen({
        title: '콘텐츠 저장',
        content: '콘텐츠 저장이 완료되었습니다',
        type: DialogType.ALERT,
        onClose: () => {
          dialogClose();
          window.location.reload();
        },
      });
    } else {
      const { code, uuid, type } = saveRes as PreviewResSchema;
      const dateTime = submitDateTime.current;
      if (!uuid) {
        return;
      }
      window.open(
        `${pathConfig.serviceUrl}/${type.toLocaleLowerCase()}/${code}?preview=true&uuid=${uuid}&dateTime=${dateTime}`,
      );
    }
  };

  /**
   * fail submit - validate
   */
  const handleInvalidData = (type: CONTENT_SUBMIT_TYPE) => {
    const contentType = type === CONTENT_SUBMIT_TYPE.PREVIEW ? '등록' : '저장';
    dialogOpen({
      title: `콘텐츠 ${contentType} 실패`,
      content: `콘텐츠를 ${contentType} 할 수 없습니다.\r\n컴포넌트의 필수 입력 항목을 모두 확인해 주세요.`,
      type: DialogType.ALERT,
      onClose: () => {
        dialogClose();
      },
    });
  };

  const getFormValue = () => {
    console.log('폼데이터:');
    console.log(getValues());
    console.log('폼데이터 error 상태:');
    console.log(formState.errors);
  };

  const getContentValue = () => {
    console.log('컨텍스트 컨텐츠 데이터:');
    console.log(contentData);
  };

  return {
    formState,
    isLoading,
    handleContentSubmit,
    getFormValue,
    getContentValue,
  };
};
