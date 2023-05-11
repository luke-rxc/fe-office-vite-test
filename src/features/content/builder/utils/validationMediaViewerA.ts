import * as Yup from 'yup';
import { UploadFileType } from '@services/useFileUploader';

/**
 * 미디어뷰어 A 컴포넌트
 */
export const MediaViewerAValidationSchema = Yup.object({
  contents: Yup.object().shape({
    mediaViewRatioType: Yup.string(),
    mainMedia: Yup.object().shape({
      path: Yup.string().required('이미지/비디오를 확인해 주세요.'),
      id: Yup.number().nullable(),
      type: Yup.string().nullable(),
      width: Yup.number(),
      height: Yup.number(),
      fileSize: Yup.number(),
      extension: Yup.string(),
      posterImage: Yup.string().when('type', {
        is: (value: string) => value === UploadFileType.VIDEO,
        then: Yup.string().required(),
      }),
    }),
    subMediaList: Yup.array().of(
      Yup.object().shape({
        path: Yup.string().required('이미지/비디오를 확인해 주세요.'),
      }),
    ),
    overlayType: Yup.string(),
    bulletColor: Yup.string(),
    useDisplayDateTime: Yup.boolean(),
    displayStartDateTime: Yup.string().when('useDisplayDateTime', {
      is: (value: boolean) => value === true,
      then: Yup.string().when('displayEndDateTime', (displayEndDateTime, schema) => {
        return schema.test({
          test: (displayStartDateTime) => {
            if (!displayStartDateTime) {
              return false;
            }

            return true;
          },
          message: '노출 시작시간을 확인 해 주세요.',
        });
      }),
    }),
    displayEndDateTime: Yup.string().when('useDisplayDateTime', {
      is: (value: boolean) => value === true,
      then: Yup.string().when('displayStartDateTime', (displayStartDateTime, schema) => {
        return schema.test({
          test: (displayEndDateTime) => {
            if (!displayEndDateTime) {
              return false;
            }

            if (displayStartDateTime && displayEndDateTime) {
              return new Date(displayEndDateTime) >= new Date(displayStartDateTime);
            }
            return true;
          },
          message: '노출 종료시간을 확인 해 주세요.',
        });
      }),
    }),
  }),
});
