import React from 'react';
import { DetailTab } from './DetailTab';
import { DetailTabType } from '../../constants';

interface Props {
  isTabFixed: boolean;
  onTabChange: (value: DetailTabType) => void;
}

export const DetailTabWrapper: React.FC<Props> = ({ isTabFixed, onTabChange: handleTabChange }) => {
  return (
    <>
      <DetailTab isTabFixed={false} onTabChange={handleTabChange} />
      {isTabFixed && <DetailTab isTabFixed={true} onTabChange={handleTabChange} />}
    </>
  );
};
