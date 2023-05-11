/**
 * 승인, 반려 Service
 * @description 사용 : 매니저 상품수정, 매니저 상품검수 페이지
 */

import { useMutation } from '@hooks/useMutation';
import { ErrorModel } from '@utils/api/createAxios';
import { DialogFeedbackLabel } from '../../constants';
import { putApproval, PutApprovalRequestParams, putReject, PutApprovalRejectParams } from '../../apis';
import { useDialogService } from '..';

interface HandlePutApprovalParams {
  requestIds: number[];
  successCb?: () => void;
}

interface HandlePutRejectParams extends HandlePutApprovalParams {
  memo: string;
}

export const useManagerSaleRequest = () => {
  /** Dialog Service */
  const { successDialog, errorDialog, confirmDialog } = useDialogService();

  /** API : 승인요청 */
  const { mutateAsync: putApprovalMutate, isLoading: isPutApprovalLoading } = useMutation(
    ({ requestIds }: PutApprovalRequestParams) => putApproval({ requestIds }),
  );

  const handlePutApprovalMutate = ({ requestIds, successCb }: HandlePutApprovalParams) => {
    confirmDialog({
      title: '승인 요청',
      message: '승인 하시겠습니까?',
      confirmCb: () => {
        putApprovalMutate(
          { requestIds },
          {
            onSuccess: () => {
              successDialog({
                label: DialogFeedbackLabel.APPROVAL,
                closeCb: () => {
                  successCb?.();
                },
              });
            },
            onError: (error: ErrorModel) => {
              errorDialog({
                label: DialogFeedbackLabel.APPROVAL,
                message: error?.data?.message,
              });
            },
          },
        );
      },
    });
  };

  /** API : 반려요청 */
  const { mutateAsync: putRejectMutate, isLoading: isPutRejectLoading } = useMutation(
    ({ requestIds, memo }: PutApprovalRejectParams) => putReject({ requestIds, memo }),
  );

  const handlePutRejectMutate = ({ requestIds, memo, successCb }: HandlePutRejectParams) => {
    putRejectMutate(
      { requestIds, memo },
      {
        onSuccess: () => {
          successDialog({
            label: DialogFeedbackLabel.REJECT,
            closeCb: () => {
              successCb?.();
            },
          });
        },
        onError: (error: ErrorModel) => {
          errorDialog({
            label: DialogFeedbackLabel.REJECT,
            message: error?.data?.message,
          });
        },
      },
    );
  };

  return {
    isPutApprovalLoading,
    handlePutApprovalMutate,
    isPutRejectLoading,
    handlePutRejectMutate,
  };
};
