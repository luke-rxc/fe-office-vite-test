/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { default as useLoading } from '@hooks/useLoading';

interface ILoadingTaskProviderProps {
  children?: React.ReactNode;
}

export interface ILoadingTaskContextValues {
  /**
   * Loading Count +1
   */
  increaseLoadingTask: () => void;
  /**
   * Loading Count -1
   */
  decreaseLoadingTask: () => void;
  /**
   * clear All Loading Task
   */
  clearLoadingTasks: () => void;
}

/**
 * Context Create
 */
export const LoadingTaskContext = React.createContext<ILoadingTaskContextValues>(null);

/**
 * Loading Task 개수에 따라 spinner를 show/hide하는 Context
 *
 * LoadingContext를 dependency하고 있어
 * 필히, LoadingContext.Provider 아래에서 사용
 */
export const LoadingTaskProvider = ({ children }: ILoadingTaskProviderProps) => {
  const { showLoading, hideLoading } = useLoading();
  const [loadingTask, setLoadingTask] = React.useState(0);

  /**
   * show spinner
   */
  const showLoadingSpinner = () => {
    showLoading();
  };

  /**
   * hide spinner
   */
  const hideLoadingSpinner = () => {
    hideLoading();
  };

  /**
   * lading task +1
   */
  const increaseLoadingTask = () => {
    setLoadingTask((prevLoadingTask) => prevLoadingTask + 1);
  };

  /**
   * lading task -1
   */
  const decreaseLoadingTask = () => {
    setLoadingTask((prevLoadingTask) => Math.max(0, prevLoadingTask - 1));
  };

  /**
   * lading task 0(모두 제거)
   */
  const clearLoadingTasks = () => {
    setLoadingTask(0);
  };

  // loadingTask updated에 따라 spinner toggle
  React.useEffect(() => {
    loadingTask ? showLoadingSpinner() : hideLoadingSpinner();
  }, [loadingTask]);

  // componentWillUnmount될 경우 spinner 제거
  React.useEffect(() => () => hideLoadingSpinner(), []);

  return (
    <LoadingTaskContext.Provider
      value={{
        increaseLoadingTask,
        decreaseLoadingTask,
        clearLoadingTasks,
      }}
    >
      {children}
    </LoadingTaskContext.Provider>
  );
};
