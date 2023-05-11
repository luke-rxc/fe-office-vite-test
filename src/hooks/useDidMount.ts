import React from 'react';

/**
 * componentDidMount State hook
 */
export const useDidMount = (): boolean => {
  const isMounted = React.useRef(false);

  React.useEffect(() => {
    isMounted.current = true;
  }, []);

  return isMounted.current;
};
