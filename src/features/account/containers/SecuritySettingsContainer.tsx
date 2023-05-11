import type { FC } from 'react';
import toast from 'react-hot-toast';
import * as Yup from 'yup';
import { Formik } from 'formik';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  FormHelperText,
  Grid,
  TextField,
  Typography,
} from '@material-ui/core';
import { putPassword } from '../apis';
import { isPasswordValid } from '../utils';

const SecuritySettingsContainer: FC = (props) => (
  <Formik
    initialValues={{
      currentPassword: '',
      password: '',
      passwordConfirm: '',
      submit: null,
    }}
    validationSchema={Yup.object().shape({
      currentPassword: Yup.string().required('기존 비밀번호를 입력해주세요.'),
      password: Yup.string()
        .required('비밀번호를 입력해주세요.')
        .test('', '비밀번호 정책(최소 8자,영문자,숫자,특수문자 각 최소 1개 이상)과 일치하지 않습니다.', (value) =>
          isPasswordValid(value),
        ),
      passwordConfirm: Yup.string()
        .oneOf([Yup.ref('password'), null], '새 비밀번호가 일치하지 않습니다.')
        .required('새 비밀번호를 입력해주세요.'),
    })}
    onSubmit={async (values, { resetForm, setErrors, setStatus, setSubmitting }): Promise<void> => {
      const { currentPassword, password } = values;
      const params = { password: currentPassword, newPassword: password };
      try {
        await putPassword({ params });
        resetForm();
        setStatus({ success: true });
        setSubmitting(false);
        toast.success('비밀번호 변경이 완료되었습니다.');
      } catch (err) {
        toast.error('비밀번호 변경이 실패하였습니다.');
        setStatus({ success: false });
        setErrors({
          submit: err.data?.message ?? '네트워크 이슈로 비밀번호 변경이 실패하였습니다. 잠시 후 다시 시도하여 주세요.',
        });
        setSubmitting(false);
      }
    }}
  >
    {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }): JSX.Element => (
      <form onSubmit={handleSubmit} {...props}>
        <Card>
          <CardHeader title="비밀번호 변경" />
          <Divider />
          <CardContent>
            <Typography color="textSecondary" variant="body2" sx={{ mb: 4 }}>
              최소 8자, 영문자, 숫자, 특수문자 각 최소 1개 이상 입력하여야 합니다
            </Typography>
            <Grid container spacing={3} sx={{ mb: 2 }}>
              <Grid item md={8} sm={10} xs={12}>
                <TextField
                  error={Boolean(touched.currentPassword && errors.currentPassword)}
                  fullWidth
                  helperText={touched.currentPassword && errors.currentPassword}
                  label="기존 비밀번호"
                  name="currentPassword"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  type="password"
                  value={values.currentPassword}
                  variant="outlined"
                />
              </Grid>
            </Grid>
            <Grid container spacing={3}>
              <Grid item md={4} sm={6} xs={12}>
                <TextField
                  error={Boolean(touched.password && errors.password)}
                  fullWidth
                  helperText={touched.password && errors.password}
                  label="변경할 비밀번호"
                  name="password"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  type="password"
                  value={values.password}
                  variant="outlined"
                />
              </Grid>
              <Grid item md={4} sm={6} xs={12}>
                <TextField
                  error={Boolean(touched.passwordConfirm && errors.passwordConfirm)}
                  fullWidth
                  helperText={touched.passwordConfirm && errors.passwordConfirm}
                  label="변경할 비밀번호 확인"
                  name="passwordConfirm"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  type="password"
                  value={values.passwordConfirm}
                  variant="outlined"
                />
              </Grid>
            </Grid>
            {errors.submit && (
              <Box sx={{ mt: 3, ml: 1 }}>
                <FormHelperText error>{errors.submit}</FormHelperText>
              </Box>
            )}
          </CardContent>
          <Divider />
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              p: 2,
            }}
          >
            <Button color="primary" disabled={isSubmitting} type="submit" variant="contained">
              비밀번호 변경
            </Button>
          </Box>
        </Card>
      </form>
    )}
  </Formik>
);

export default SecuritySettingsContainer;
