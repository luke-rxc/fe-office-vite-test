import { useContext } from 'react';
import { ContentContext } from '../contexts';

export const useContentContext = () => useContext(ContentContext);
