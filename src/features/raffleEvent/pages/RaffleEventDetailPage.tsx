import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { RaffleEventDetailContainer } from '../containers';

const RaffleEventDetailPage = () => {
  const { raffleId: id } = useParams();
  const raffleId = Number(id);
  const navigate = useNavigate();

  useEffect(() => {
    if (isNaN(raffleId)) {
      navigate('/404');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [raffleId]);

  if (isNaN(raffleId)) {
    return null;
  }

  return <RaffleEventDetailContainer raffleId={raffleId} />;
};

export default RaffleEventDetailPage;
