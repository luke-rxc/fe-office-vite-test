import { useCallback, useState } from 'react';

export type Mode = 'DEFAULT' | 'EDIT';

export const useMode = (initialMode: Mode = 'DEFAULT') => {
  const [mode, setMode] = useState<Mode>(initialMode);

  const toggleEditMode = useCallback(() => {
    setMode((prev) => (prev === 'DEFAULT' ? 'EDIT' : 'DEFAULT'));
  }, []);

  return {
    mode,
    toggleEditMode,
  };
};
