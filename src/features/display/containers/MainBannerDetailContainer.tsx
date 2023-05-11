import { Layout } from '@components/Layout';
import { Box, Button } from '@material-ui/core';
import { useParams } from 'react-router';
import { MainBannerDetail } from '../components';
import { useMainBannerDetailService } from '../services';

export const MainBannerDetailContainer = () => {
  const { homeBannerId } = useParams();
  const { detailData, ...props } = useMainBannerDetailService({
    queryParams: { homeBannerId: Number(homeBannerId) },
  });

  return (
    <Layout
      title="메인 배너 편성 콘텐츠 상세"
      actions={
        props.mode === 'DEFAULT' && (
          <Box display="flex" sx={{ gap: 1 }}>
            <Button size="medium" variant="contained" onClick={props.onEdit}>
              수정
            </Button>

            <Button size="medium" variant="contained" onClick={props.onDelete} color="secondary">
              삭제
            </Button>
          </Box>
        )
      }
    >
      <MainBannerDetail data={detailData.value} status={detailData.status} {...props} />
    </Layout>
  );
};
