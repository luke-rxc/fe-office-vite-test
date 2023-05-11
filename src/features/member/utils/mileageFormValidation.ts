import * as Yup from 'yup';
import { MILEAGE_ACTION_TYPE } from '../constants';

export const mileageFormValidation = Yup.object().shape({
  type: Yup.string().required('처리 방식을 선택해주세요.'),
  point: Yup.number().min(1, '적립금을 확인해주세요.').typeError('적립금을 입력해주세요.').required(),
  expiredDate: Yup.string()
    .nullable()
    .when('type', (value, schema) => {
      if (value === MILEAGE_ACTION_TYPE.SAVE) {
        return schema.test({
          test: (expiredDate) => new Date() < new Date(expiredDate),
          message: ({ value }) => (value === null ? '만료일을 입력해주세요.' : '만료일은 오늘보다 이전일 수 없습니다.'),
        });
      }
    }),
  reason: Yup.string().required('지급 사유를 입력해주세요.'),
});
