import React from 'react';
import { LoadingTaskContext } from '@contexts/LoadingTaskContext';

/**
 * LoadingTaskContext Hook
 */
export const useLoadingTask = () => React.useContext(LoadingTaskContext);
