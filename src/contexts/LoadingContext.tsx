import { createContext, useState } from 'react';
import type { FC, ReactNode } from 'react';
import { Spinner } from '@components/Spinner';

export interface LoadingContextValue {
  showLoading: (msg?: ReactNode) => void;
  hideLoading: () => void;
}

interface LoadingProviderProps {
  children?: ReactNode;
}

export const LoadingContext = createContext<LoadingContextValue>(null);

export const LoadingProvider: FC<LoadingProviderProps> = ({ children }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<ReactNode>('');

  const showLoading = (msg?: ReactNode): void => {
    setLoading(true);
    if (msg) {
      setMessage(msg);
    }
  };

  const hideLoading = (): void => {
    setLoading(false);
    setMessage('');
  };
  return (
    <LoadingContext.Provider
      value={{
        showLoading,
        hideLoading,
      }}
    >
      {children}
      {loading && <Spinner message={message} />}
    </LoadingContext.Provider>
  );
};
