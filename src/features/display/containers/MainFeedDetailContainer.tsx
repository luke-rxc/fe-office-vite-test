import { Layout } from '@components/Layout';
import { Box, Button } from '@material-ui/core';
import { useParams } from 'react-router';
import { MainFeedDetail } from '../components';
import { useMainFeedDetailService } from '../services';

export const MainFeedDetailContainer = () => {
  const { homeFeedId } = useParams();
  const { detailData, ...props } = useMainFeedDetailService({
    queryParams: { homeFeedId: Number(homeFeedId) },
  });

  return (
    <Layout
      title="메인 피드 편성 콘텐츠 상세"
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
      <MainFeedDetail data={detailData.value} status={detailData.status} {...props} />
    </Layout>
  );
};
