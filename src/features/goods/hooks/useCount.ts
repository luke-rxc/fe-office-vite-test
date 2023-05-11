import { useState, useEffect } from 'react';

export const useCount = (initCount = 0) => {
  const [count, setCount] = useState(initCount);

  const handleCount = (value: number) => {
    setCount(value);
  };

  const handleInputLength = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = evt.target;
    handleCount(value.length);
  };

  useEffect(() => {
    handleCount(initCount);
  }, [initCount]);

  return {
    count,
    handleCount,
    handleInputLength,
  };
};
