import * as Yup from 'yup';
import { BLANK_SPACING_TYPE } from '../constants';

/**
 * 여백 컴포넌트
 */
export const BlankValidationSchema = Yup.object({
  contents: Yup.object().shape({
    spacingType: Yup.string(),
    height: Yup.number().min(0, '수치를 입력해 주세요.').required('required').typeError('수치를 입력해 주세요.'),
    customHeight: Yup.number().when('spacingType', {
      is: (value: string) => value === BLANK_SPACING_TYPE.CUSTOM,
      then: Yup.number().min(0, '수치를 입력해 주세요.').required('required').typeError('수치를 입력해 주세요.'),
    }),
    colorType: Yup.string(),
    colors: Yup.array().of(Yup.string()),
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
