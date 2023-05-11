import { useNavigate, useLocation } from 'react-router';
import type { Location } from 'history';
import { GoodsLink } from '../constants';

export const useLink = () => {
  const navigate = useNavigate();
  const location: Location<{
    listPageQuery?: string;
  }> = useLocation();

  const navigateGoodsMain = () => {
    const { state } = location;
    navigate(`${GoodsLink.Base}${state?.listPageQuery ?? ''}`);
  };

  return {
    navigateGoodsMain,
  };
};
