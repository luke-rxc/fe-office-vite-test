import { useForm, FormProvider } from 'react-hook-form';
import { Button, Grid, Paper } from '@material-ui/core';
import RotateLeftSharpIcon from '@material-ui/icons/RotateLeftSharp';
import { Layout } from '@components/Layout';
import { yupResolver } from '@hookform/resolvers/yup';
import { useGetContentService } from '../services';
import { validationSchema } from '../utils';
import { ContentManagerContainer } from './ContentManagerContainer';

export const ContentContainer = () => {
  const methods = useForm({
    defaultValues: {},
    resolver: yupResolver(validationSchema),
  });
  const { isSuccess, isError, content, handleInvalidateQuery } = useGetContentService(); // 콘텐츠 정보 조회

  return (
    <Layout title="콘텐츠 크리에이터">
      {isSuccess && (
        <FormProvider {...methods}>
          <ContentManagerContainer content={content} />
        </FormProvider>
      )}
      {isError && (
        <Paper sx={{ padding: 20 }}>
          <Grid container sx={{ justifyContent: 'center', alignItems: 'center', textAlign: 'center' }} spacing={3}>
            <Grid item xs={12}>
              콘텐츠 정보를 조회 할 수 없습니다.
            </Grid>
            <Grid item xs={12}>
              <Button
                startIcon={<RotateLeftSharpIcon />}
                onClick={handleInvalidateQuery}
                sx={{ width: 100 }}
                variant="outlined"
              >
                retry
              </Button>
            </Grid>
          </Grid>
        </Paper>
      )}
    </Layout>
  );
};
