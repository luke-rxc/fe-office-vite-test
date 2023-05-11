import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ShowtimeContentsModifyContainer } from '../containers';

const ShowtimeContentsModifyPage = () => {
  const { showTimeId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (isNaN(Number(showTimeId))) {
      navigate('/404');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showTimeId]);

  if (isNaN(Number(showTimeId))) {
    return null;
  }

  return <ShowtimeContentsModifyContainer showTimeId={Number(showTimeId)} />;
};
export default ShowtimeContentsModifyPage;
