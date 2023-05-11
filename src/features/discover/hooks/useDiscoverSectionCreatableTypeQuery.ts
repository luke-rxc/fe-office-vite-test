import { useQuery } from '@hooks/useQuery';
import { ErrorModel } from '@utils/api/createAxios';
import { useCallback } from 'react';
import { UseQueryOptions } from 'react-query';
import { getDiscoverSectionCreatableType } from '../apis';
import { DiscoverSectionQueryKeys } from '../constants';
import { DiscoverSectionCreatableTypeModel, toDiscoverSectionCreatableTypeModelList } from '../models';
import { DiscoverSectionCreatableTypeSchema } from '../schemas';

/**
 * 디스커버 섹션 생성가능 타입 조회 query
 */
export const useDiscoverSectionCreatableTypeQuery = (
  option: UseQueryOptions<
    Array<DiscoverSectionCreatableTypeSchema>,
    ErrorModel,
    Array<DiscoverSectionCreatableTypeModel>
  > = {},
) => {
  const queryFn = useCallback(() => {
    return getDiscoverSectionCreatableType();
  }, []);

  return useQuery(DiscoverSectionQueryKeys.creatableType(), queryFn, {
    select: (data) => {
      return toDiscoverSectionCreatableTypeModelList(data);
    },
    onError: (error: ErrorModel) => window.console.log(error?.data?.message),
    ...option,
  });
};
