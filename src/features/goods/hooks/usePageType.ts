import { useContext } from 'react';
import { PageTypeContext } from '../contexts';

export const usePageType = () => {
  const ctx = useContext(PageTypeContext);
  return ctx;
};
