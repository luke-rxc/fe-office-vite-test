import * as Yup from 'yup';

export const searchFormValidation = Yup.object().shape({
  joinToDate: Yup.string()
    .nullable()
    .when('joinFromDate', (value, schema) => {
      return schema.test({
        test: (joinToDate) => {
          if (!joinToDate) {
            return true;
          }

          return new Date(value) < new Date(joinToDate);
        },
        message: '시작일이 종료일보다 미래일 수 없습니다.',
      });
    }),
  loginToDate: Yup.string()
    .nullable()
    .when('loginFromDate', (value, schema) => {
      return schema.test({
        test: (loginToDate) => {
          if (!loginToDate) {
            return true;
          }

          return new Date(value) < new Date(loginToDate);
        },
        message: '시작일이 종료일보다 미래일 수 없습니다.',
      });
    }),
});
