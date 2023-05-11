import { useState } from 'react';

/**
 * 편집여부 관련 hook
 */
export const useEdit = () => {
  const [isEdit, setIsEdit] = useState<boolean>(false);

  const handleToggleEdit = (edit: boolean) => {
    setIsEdit(edit);
  };

  return {
    isEdit,
    handleToggleEdit,
  };
};
