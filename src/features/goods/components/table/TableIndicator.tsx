import React, { useRef, useState, useEffect } from 'react';

export interface IndicatorProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  hasMore?: boolean;
  onLoadMore?: () => void;
}

export const TableIndicator = ({ hasMore, onLoadMore, ...props }: IndicatorProps) => {
  const indicatorRef = useRef<HTMLDivElement>(null);
  const [loading, setLoadState] = useState<boolean>(false);

  const handleIntersection = ([entry]: IntersectionObserverEntry[]) => {
    if (entry.isIntersecting && hasMore && !loading) {
      setLoadState(true);
      setTimeout(() => onLoadMore?.(), 0);
    } else {
      setLoadState(false);
    }
  };

  useEffect(() => {
    let observer: IntersectionObserver;

    if (indicatorRef.current && hasMore) {
      observer = new IntersectionObserver(handleIntersection);
      observer.observe(indicatorRef.current);
    } else {
      setLoadState(false);
    }

    return () => observer && observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasMore]);

  return <div ref={indicatorRef} {...props} style={{ height: '1px' }} />;
};
