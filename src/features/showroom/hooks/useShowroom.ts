/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useCallback } from 'react';
import { useQueryClient } from 'react-query';
import { ShowroomContext } from '../contexts';
import { ShowroomInfoSchema } from '../schemas';
import { ShowroomInfoQueryKeys } from '../services/queries';

/**
 * ShowroomContext에 연결된 hooks
 */
export const useShowroom = () => {
  const queryClient = useQueryClient();
  const value = useContext(ShowroomContext);

  /**
   * queryClient를 통해 쇼룸 정보를 업데이트
   */
  const refetch = useCallback(({ showroomId }: Parameters<typeof ShowroomInfoQueryKeys.item>[0]) => {
    const { id, code, sectionId, showRoomType } = queryClient.getQueryData<ShowroomInfoSchema>(
      ShowroomInfoQueryKeys.item({ showroomId }),
    );
    value.dispatch({ id, code, type: showRoomType, sectionId });
  }, []);

  return { ...value, refetch };
};
