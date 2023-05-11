import { useEffect } from 'react';
import useLoading from '@hooks/useLoading';
import { useQuery } from '@hooks/useQuery';
import { useDialog } from '@hooks/useDialog';
import { DialogType } from '@models/DialogModel';
import { QueryKey } from '../constants';
import { getGeneralInfo, getAuthority } from '../apis';
import { toGeneralDetail, toAuthority } from '../models';

export const useGeneralSettingsService = () => {
  const { showLoading, hideLoading } = useLoading();
  const { open: dialogOpen, close: dialogClose } = useDialog();

  // 내 관리자 정보 상세 조회
  const {
    data: generalInfo,
    isError: isGeneralInfoError,
    isFetched: isGeneralInfoFetched,
    isLoading: isGeneralInfoLoading,
  } = useQuery([QueryKey.GeneralInfo], getGeneralInfo);

  // 현재 토큰(세션) 기반 권한조회
  const {
    data: authority,
    isError: isAuthorityError,
    isFetched: isAuthorityFetched,
    isLoading: isAuthorityLoading,
  } = useQuery([QueryKey.Authority], getAuthority);

  const isContentError = isGeneralInfoError || isAuthorityError;
  const isLoading = isGeneralInfoLoading || isAuthorityLoading;
  const isComplete = isGeneralInfoFetched && isAuthorityFetched;

  useEffect(() => {
    if (isContentError) {
      dialogOpen({
        title: '회원정보 로드 실패',
        content: '회원정보를 불러올 수 없습니다.\r\n잠시 후 다시 시도해 주세요.',
        type: DialogType.ALERT,
        onClose: () => {
          dialogClose();
          window.location.reload();
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isContentError]);

  useEffect(() => {
    !isLoading || isContentError ? hideLoading() : showLoading();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]);

  return {
    generalInfo,
    generalDetail: toGeneralDetail(generalInfo),
    authority: toAuthority(authority),
    isComplete,
    isError: isContentError,
  };
};
