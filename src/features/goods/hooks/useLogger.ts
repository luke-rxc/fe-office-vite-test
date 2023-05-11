import { useEffect } from 'react';

// let count = 0;
export const useLogger = (componentName) => {
  // console.log(`${componentName} start`, count++);
  useEffect(() => {
    // console.log(`${componentName} mount`);
    return () => {
      // console.log(`${componentName} end`);
    };
  });
};
