import { useForm } from 'react-hook-form';
import { useParams } from 'react-router';
import { useQueryClient } from 'react-query';
import { useQuery } from '@hooks/useQuery';
import useLoading from '@hooks/useLoading';
import { useMutation } from '@hooks/useMutation';
import { ErrorDataModel, ErrorModel } from '@utils/api/createAxios';
import { getBlackLog, postBlackLog, putBlackToggle } from '../apis';
import { QueryKey } from '../constants';
import { MemberBlackLogFormField, MemberBlackLogRequestParams, toBlackLogModel } from '../models';
import { MemberBlackListLogSchema } from '../schemas';

export const useMemberBlackListService = () => {
  const { userId } = useParams();
  const client = useQueryClient();
  const { data: logList } = useQuery(
    [QueryKey.BlackListLog, userId],
    () => {
      return getBlackLog(userId);
    },
    {
      select: (data: MemberBlackListLogSchema) => {
        return toBlackLogModel(data?.logs ?? []);
      },
    },
  );
  const { showLoading, hideLoading } = useLoading();
  const formMethod = useForm<MemberBlackLogFormField>({
    defaultValues: {
      message: '',
    },
  });
  const { handleSubmit, reset } = formMethod;
  const { mutate: handleUpdateLog } = useMutation(
    ({ userId, params }: { userId: string; params: MemberBlackLogRequestParams }) => postBlackLog(userId, params),
    {
      onSuccess: () => {
        hideLoading();
        reset();
        handleRefreshBlackLog();
      },
      onError: (error: ErrorModel<ErrorDataModel>) => {
        hideLoading();
      },
    },
  );

  const { mutateAsync: handleUpdateBlackToggle } = useMutation(() => putBlackToggle(userId), {
    onSuccess: () => {},
    onError: (error: ErrorModel<ErrorDataModel>) => {},
  });

  const handleSubmitBlackLog = handleSubmit((values: MemberBlackLogFormField) => {
    const params: MemberBlackLogRequestParams = {
      message: values?.message,
    };
    showLoading();
    handleUpdateLog({ userId, params });
  });

  const handleRefreshBlackLog = () => {
    client.invalidateQueries([QueryKey.BlackListLog, userId]);
  };

  return {
    formMethod,
    logList,
    handleRefreshBlackLog,
    handleSubmitBlackLog,
    handleUpdateBlackToggle,
  };
};
