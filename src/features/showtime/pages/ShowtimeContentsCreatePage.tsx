import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ContentsType } from '../constants';
import { ShowtimeContentsCreateContainer } from '../containers';

const ShowtimeContentsCreatePage = () => {
  const { contentsType: contentsTypeText } = useParams();
  const contentsType = contentsTypeText.toUpperCase() as ContentsType;

  const navigate = useNavigate();

  useEffect(() => {
    if (!(contentsType === ContentsType.STANDARD || contentsType === ContentsType.AUCTION)) {
      navigate('/404');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contentsType]);

  return <ShowtimeContentsCreateContainer contentsType={contentsType} />;
};
export default ShowtimeContentsCreatePage;
