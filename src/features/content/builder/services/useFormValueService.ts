import { useCallback } from 'react';
import { useFormContext } from 'react-hook-form';
import has from 'lodash/has';
import { UploadFileInfo } from '@models/UploadModel';
import { FORM_KEY } from '../constants';
import { FormContentMediaModel, FormContentMediaUploadModel } from '../models';
import { getInitMediaUploader, getInitMediaContent } from '../utils';

/**
 * 컨텐츠 formValue를 제어하기 위한 서비스
 * @returns
 */
export const useFormValueService = () => {
  const { setValue, getValues, unregister } = useFormContext();

  /**
   * 미디어 formValue 리셋
   */
  const handleResetMedia = useCallback(
    (id) => {
      const formValues = getValues();
      const formValue = formValues[id];
      const mediaUploaderValue = formValue.mediaUploader;

      for (const mediaKey in mediaUploaderValue) {
        const mediaValue = mediaUploaderValue[mediaKey];
        const isSingleType = !Array.isArray(mediaValue);
        if (isSingleType) {
          // 폼 - 미디어 업로더 데이터 업데이트
          setValue(`${id}.${FORM_KEY.MEDIA_UPLOADER}`, {
            ...getValues(`${id}.${FORM_KEY.MEDIA_UPLOADER}`),
            [mediaKey]: {
              ...getInitMediaUploader(),
            },
          });

          // 폼 - 컨텐츠 데이터 업데이트
          setValue(`${id}.${FORM_KEY.CONTENTS}`, {
            ...getValues(`${id}.${FORM_KEY.CONTENTS}`),
            [mediaKey]: {
              ...getInitMediaContent(),
            },
          });
        } else {
          // 폼 - 미디어 업로더 데이터 업데이트
          unregister(`${id}.${FORM_KEY.MEDIA_UPLOADER}.${mediaKey}`);
          setValue(`${id}.${FORM_KEY.MEDIA_UPLOADER}`, {
            ...formValue[FORM_KEY.MEDIA_UPLOADER],
          });
          setValue(`${id}.${FORM_KEY.MEDIA_UPLOADER}.${mediaKey}`, []);

          // 폼 - 컨텐츠 데이터 업데이트
          unregister(`${id}.${FORM_KEY.CONTENTS}.${mediaKey}`);
          // 미디어 리셋시, content의 formValue의 특정 key 값이 함께 리셋이 되어야 하는 경우 resetKey값에 추가
          const resetKey: {
            keyName: string; // content의 formValue 키 네임
            hasProperty: boolean; // 키값 unregister 전에, content에 해당 property 포함 여부 판단 값
            initValue: any; // 리셋시 초기화 값
          }[] = [
            {
              keyName: 'subMediaTitleList',
              hasProperty: false,
              initValue: [],
            },
          ];
          resetKey.forEach((key) => {
            const hasKey = has(formValue[FORM_KEY.CONTENTS], key.keyName);
            if (hasKey) {
              key.hasProperty = true;
              unregister(`${id}.${FORM_KEY.CONTENTS}.${key.keyName}`);
            }
          });
          setValue(`${id}.${FORM_KEY.CONTENTS}`, {
            ...formValue[FORM_KEY.CONTENTS],
          });
          setValue(`${id}.${FORM_KEY.CONTENTS}.${mediaKey}`, []);
          resetKey.forEach((key) => {
            if (key.hasProperty) {
              if (Array.isArray(key.initValue)) {
                setValue(`${id}.${FORM_KEY.CONTENTS}.${key.keyName}`, []);
              } else {
                setValue(`${id}.${FORM_KEY.CONTENTS}.${key.keyName}`, key.initValue);
              }
            }
          });
        }
      }
    },
    [getValues, setValue, unregister],
  );

  /**
   * 미디어 추가
   */
  const handleChangeMedia = useCallback(
    ({
      id,
      formKey,
      isSingleType,
      updateFiles,
      replace,
    }: {
      id: number; // 컴포넌트 id
      formKey: string; // 컴포넌트 업데이트 대상 form key명
      isSingleType: boolean; // 미디어 리스트 여부
      updateFiles: UploadFileInfo[]; // 업로드된 이미지 정보
      replace: boolean; // 이미지 교체 인 경우 true, 싱글 타입이 아닌 경우 리스트 추가시 false
    }) => {
      if (isSingleType) {
        // 미디어 업로더 데이터
        const newUploaderFormInfo: FormContentMediaUploadModel = {
          ...getInitMediaUploader(), // 기존 데이터 초기화
          file: updateFiles[0],
          fileType: updateFiles[0]?.file.type,
        };
        // 컨텐츠 데이터
        const newContentFormInfo: FormContentMediaModel = {
          ...getInitMediaContent(), // 기존 데이터 초기화
        };
        // 폼 - 미디어 업로더 데이터 업데이트
        setValue(`${id}.${FORM_KEY.MEDIA_UPLOADER}`, {
          ...getValues(`${id}.${FORM_KEY.MEDIA_UPLOADER}`),
          [formKey]: newUploaderFormInfo,
        });
        // 폼 - 컨텐츠 데이터 업데이트
        setValue(`${id}.${FORM_KEY.CONTENTS}`, {
          ...getValues(`${id}.${FORM_KEY.CONTENTS}`),
          [formKey]: newContentFormInfo,
        });
      } else {
        const uploaderFormInfo = getValues(`${id}.${FORM_KEY.MEDIA_UPLOADER}.${formKey}`) ?? [];
        const contentsFormInfo = getValues(`${id}.${FORM_KEY.CONTENTS}.${formKey}`) ?? [];
        const newUploaderFormInfo = [];
        const newContentFormInfo = [];
        updateFiles.forEach((fileInfo, index) => {
          const commonMediaInfo = {
            id: fileInfo.id ?? null,
            path: fileInfo.path ?? '',
            width: fileInfo.width ?? 0,
            height: fileInfo.height ?? 0,
            extension: fileInfo.extension ?? '',
            blurHash: fileInfo.blurHash ?? '',
          };
          // 미디어 업로더 데이터
          const uploadInfo: FormContentMediaUploadModel = {
            ...commonMediaInfo,
            fileSize: uploaderFormInfo?.fileSize ?? 0,
            file: (fileInfo.file && fileInfo) ?? null,
            fileType: fileInfo.fileType ?? '',
          };
          // 컨텐츠 데이터
          const contentInfo: FormContentMediaModel = {
            ...commonMediaInfo,
            fileSize: contentsFormInfo?.fileSize ?? 0,
            type: contentsFormInfo?.type ?? '',
            posterImage: contentsFormInfo?.posterImage ?? '',
          };
          newUploaderFormInfo.push(uploadInfo);
          newContentFormInfo.push(contentInfo);
        });

        if (replace) {
          // 폼 - 미디어 업로더 데이터 업데이트
          unregister(`${id}.${FORM_KEY.MEDIA_UPLOADER}.${formKey}`);
          setValue(`${id}.${FORM_KEY.MEDIA_UPLOADER}`, {
            ...getValues(`${id}.${FORM_KEY.MEDIA_UPLOADER}`),
            [formKey]: [...newUploaderFormInfo],
          });
          // 폼 - 컨텐츠 데이터 업데이트
          unregister(`${id}.${FORM_KEY.CONTENTS}.${formKey}`);
          setValue(`${id}.${FORM_KEY.CONTENTS}`, {
            ...getValues(`${id}.${FORM_KEY.CONTENTS}`),
            [formKey]: [...newContentFormInfo],
          });
        } else {
          // 폼 - 미디어 업로더 데이터 업데이트
          unregister(`${id}.${FORM_KEY.MEDIA_UPLOADER}.${formKey}`);
          setValue(`${id}.${FORM_KEY.MEDIA_UPLOADER}`, {
            ...getValues(`${id}.${FORM_KEY.MEDIA_UPLOADER}`),
            [formKey]: [...uploaderFormInfo, ...newUploaderFormInfo],
          });
          // 폼 - 컨텐츠 데이터 업데이트
          unregister(`${id}.${FORM_KEY.CONTENTS}.${formKey}`);
          setValue(`${id}.${FORM_KEY.CONTENTS}`, {
            ...getValues(`${id}.${FORM_KEY.CONTENTS}`),
            [formKey]: [...contentsFormInfo, ...newContentFormInfo],
          });
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  /**
   * 미디어 삭제
   */
  const handleRemoveMedia = useCallback(
    ({
      id,
      formKey,
      isSingleType,
      index,
    }: {
      id: number; // 컴포넌트 id
      formKey: string; // 컴포넌트 업데이트 대상 form key명
      isSingleType: boolean; // 미디어 리스트 여부
      index: number; // 미디어가 리스트인 경우, idx 삭제
    }) => {
      if (isSingleType) {
        // 폼 - 미디어 업로더 데이터 업데이트
        setValue(`${id}.${FORM_KEY.MEDIA_UPLOADER}`, {
          ...getValues(`${id}.${FORM_KEY.MEDIA_UPLOADER}`),
          [formKey]: {
            ...getInitMediaUploader(), // 기존 데이터 초기화
          },
        });
        // 폼 - 컨텐츠 데이터 업데이트
        setValue(`${id}.${FORM_KEY.CONTENTS}`, {
          ...getValues(`${id}.${FORM_KEY.CONTENTS}`),
          [formKey]: {
            ...getInitMediaContent(), // 기존 데이터 초기화
          },
        });
      } else {
        const uploaderFormValue = getValues(`${id}.${FORM_KEY.MEDIA_UPLOADER}.${formKey}`);
        const contentsFormValue = getValues(`${id}.${FORM_KEY.CONTENTS}.${formKey}`);
        const uploaderFormInfo = uploaderFormValue ? uploaderFormValue : [];
        const contentsFormInfo = contentsFormValue ? contentsFormValue : [];
        // 미디어 업로더 데이터
        const newUploaderFormInfo = uploaderFormInfo.filter((_, idx) => {
          return index !== idx;
        });
        // 컨텐츠 데이터
        const newContentFormInfo = contentsFormInfo.filter((data, idx) => {
          return index !== idx;
        });

        // 폼 - 미디어 업로더 데이터 업데이트
        unregister(`${id}.${FORM_KEY.MEDIA_UPLOADER}.${formKey}`);
        setValue(`${id}.${FORM_KEY.MEDIA_UPLOADER}`, {
          ...getValues(`${id}.${FORM_KEY.MEDIA_UPLOADER}`),
          [formKey]: [...newUploaderFormInfo],
        });
        // 폼 - 컨텐츠 데이터 업데이트
        unregister(`${id}.${FORM_KEY.CONTENTS}.${formKey}`);
        setValue(`${id}.${FORM_KEY.CONTENTS}`, {
          ...getValues(`${id}.${FORM_KEY.CONTENTS}`),
          [formKey]: [...newContentFormInfo],
        });
      }
    },
    [getValues, setValue, unregister],
  );

  /**
   * 미디어 순서 변경
   */
  const handleSortMedia = useCallback(
    ({
      id,
      formKey,
      sourceIndex,
      targetIndex,
    }: {
      id: number; // 컴포넌트 id
      formKey: string; // 컴포넌트 업데이트 대상 form key명
      sourceIndex: number; // 미디어 리스트 여부
      targetIndex: number; // 미디어가 리스트인 경우, idx 삭제
    }) => {
      const uploaderFormValue = getValues(`${id}.${FORM_KEY.MEDIA_UPLOADER}.${formKey}`);
      const contentsFormValue = getValues(`${id}.${FORM_KEY.CONTENTS}.${formKey}`);
      const uploaderFormInfo = uploaderFormValue ? uploaderFormValue : [];
      const contentsFormInfo = contentsFormValue ? contentsFormValue : [];

      [contentsFormInfo[sourceIndex], contentsFormInfo[targetIndex]] = [
        contentsFormInfo[targetIndex],
        contentsFormInfo[sourceIndex],
      ];
      [uploaderFormInfo[sourceIndex], uploaderFormInfo[targetIndex]] = [
        uploaderFormInfo[targetIndex],
        uploaderFormInfo[sourceIndex],
      ];
      // 폼 - 미디어 업로더 데이터 업데이트
      setValue(`${id}.${FORM_KEY.MEDIA_UPLOADER}`, {
        ...getValues(`${id}.${FORM_KEY.MEDIA_UPLOADER}`),
        [formKey]: [...uploaderFormInfo],
      });
      // 폼 - 컨텐츠 데이터 업데이트
      setValue(`${id}.${FORM_KEY.CONTENTS}`, {
        ...getValues(`${id}.${FORM_KEY.CONTENTS}`),
        [formKey]: [...contentsFormInfo],
      });
    },
    [getValues, setValue],
  );

  return {
    handleResetMedia,
    handleChangeMedia,
    handleRemoveMedia,
    handleSortMedia,
  };
};
