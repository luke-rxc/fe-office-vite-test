import { LoadingTaskProvider } from '@contexts/LoadingTaskContext';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ManagePageType } from '../constants';
import { ShowtimeManageDashboardContainer } from '../containers';

const ShowtimeManageDashboardPage = () => {
  const { showTimeId, pageType = ManagePageType.CHAT } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (isNaN(Number(showTimeId)) || !(pageType.toUpperCase() in ManagePageType)) {
      navigate('/404');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showTimeId, pageType]);

  if (isNaN(Number(showTimeId))) {
    return null;
  }

  return (
    <LoadingTaskProvider>
      <ShowtimeManageDashboardContainer showTimeId={Number(showTimeId)} pageType={pageType.toUpperCase()} />
    </LoadingTaskProvider>
  );
};
export default ShowtimeManageDashboardPage;
