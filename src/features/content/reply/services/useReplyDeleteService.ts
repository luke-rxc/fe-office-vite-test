import toast from 'react-hot-toast';
import { useMutation } from '@hooks/useMutation';
import useLoading from '@hooks/useLoading';
import { ErrorModel, ErrorDataModel } from '@utils/api/createAxios';
import { deleteReply } from '../apis';
import { ReplyListModel } from '../models';

/**
 * 댓글 관리자 삭제
 */
export const useReplyDeleteService = (): {
  handleReplyDelete: (item: ReplyListModel) => void;
  isSuccess: boolean;
  isError: boolean;
  error: ErrorModel<ErrorDataModel>;
} => {
  const { showLoading, hideLoading } = useLoading();
  const { mutate, error, isSuccess, isError } = useMutation((replyId: number) => deleteReply(replyId), {
    onSuccess: () => {
      hideLoading();
    },
    onError: (error: ErrorModel<ErrorDataModel>) => {
      const msg = error.data.message;
      toast.error(msg);
      hideLoading();
    },
  });

  const handleReplyDelete = (item: ReplyListModel): void => {
    showLoading();
    mutate(item.id);
  };

  return {
    handleReplyDelete,
    isSuccess,
    isError,
    error,
  };
};
