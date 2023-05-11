import { useContext } from 'react';
import { LoadingContext, LoadingContextValue } from '@contexts/LoadingContext';

const useLoading = (): LoadingContextValue => useContext(LoadingContext);

export default useLoading;
