/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import toast from 'react-hot-toast';
import _isEqual from 'lodash/isEqual';
import { useParams } from 'react-router';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Grid } from '@material-ui/core';
import { useLoadingTask } from '@hooks/useLoadingTask';
import { usePrincipal } from '../hooks';
import { affiliationInfoFieldsValidation } from '../models';
import { AccountPrimaryInfo, AccountAffiliationInfo } from '../components';
import { useAccountInfoService, useAccountInfoUpdateService, useAccountPasswordResetService } from '../services';
import {
  ACCOUNT_CHANGED_PRIMARY_INFO_MESSAGE,
  ACCOUNT_CHANGED_AFFILIATION_INFO_MESSAGE,
  ACCOUNT_RESET_PASSWORD_CONFIRM_MESSAGE,
  ACCOUNT_RESET_PASSWORD_SUCCESS_MESSAGE,
  ACCOUNT_INFO_EDIT_CANCEL_CONFIRM_MESSAGE,
} from '../constants';

/**
 * 계정 기본 & 소속 정보 컨테이너
 */
export const AccountInfoContainer = (): JSX.Element => {
  const { id: accountId } = useParams();
  const { isManager } = usePrincipal();
  const { increaseLoadingTask, decreaseLoadingTask } = useLoadingTask();

  const [isPrimaryInfoEdit, setPrimaryInfoEdit] = React.useState(false);
  const [isAffiliationInfoEdit, setAffiliationInfoEdit] = React.useState(false);

  /**
   * 계정 정보 요청 Service
   */
  const {
    primaryInfo,
    affiliationInfo,
    accountInfoError,
    isAccountInfoError,
    isAccountInfoFetched,
    isAccountInfoLoading,
  } = useAccountInfoService({ accountId });

  /**
   * 계정 정보 업데이트 Service
   */
  const {
    // prettier-ignore
    isUpdateAccountInfoLoading,
    onUpdateAccountInfo: handleUpdateAccountInfo,
  } = useAccountInfoUpdateService();

  /**
   * 임시 비밀 번호 발급 Service
   */
  const {
    // prettier-ignore
    isPasswordResetLoading,
    onPasswordReset: handlePasswordReset,
  } = useAccountPasswordResetService();

  // *****************************************************************
  // 기본 정보 폼 컨트롤러
  // *****************************************************************
  const {
    control: primaryInfoControl,
    reset: onPrimaryInfoReset,
    getValues: getPrimaryInfoFieldValues,
    handleSubmit: onSubmitPrimaryInfo,
  } = useForm({ defaultValues: { enabled: primaryInfo.enabled } });

  /**
   * 기본 정보 수정 변경 이벤트 핸들러
   */
  const handlePrimaryInfoEdit = () => {
    setPrimaryInfoEdit(true);
  };

  /**
   * 기본 정보 수정 취소 이벤트 핸들러
   */
  const handleCancelPrimaryInfoEdit = () => {
    if (_isEqual(getPrimaryInfoFieldValues('enabled'), primaryInfo.enabled)) {
      return setPrimaryInfoEdit(false);
    }

    if (window.confirm(ACCOUNT_INFO_EDIT_CANCEL_CONFIRM_MESSAGE)) {
      setPrimaryInfoEdit(false);
      onPrimaryInfoReset({ enabled: primaryInfo.enabled });
    }
  };

  /**
   * 기본 정보 수정 내용 저장 이벤트 핸들러
   */
  const handleSavePrimaryInfo = onSubmitPrimaryInfo((values) => {
    handleUpdateAccountInfo(
      { accountId, ...affiliationInfo, ...values },
      {
        onError: (error) => {
          toast.error(error.data.message);
        },
        onSuccess: () => {
          toast.success(ACCOUNT_CHANGED_PRIMARY_INFO_MESSAGE);
          setPrimaryInfoEdit(false);
        },
      },
    );
  });

  /**
   * 비밀 번호 변경 이벤트 핸들러
   */
  const handleResetPassword = () => {
    window.confirm(ACCOUNT_RESET_PASSWORD_CONFIRM_MESSAGE) &&
      handlePasswordReset(
        { accountId },
        {
          onError: (error) => {
            toast.error(error.data.message);
          },
          onSuccess: () => {
            toast.success(ACCOUNT_RESET_PASSWORD_SUCCESS_MESSAGE);
          },
        },
      );
  };

  // *****************************************************************
  // 소속 정보 폼 컨트롤러
  // *****************************************************************
  const {
    control: affiliationInfoControl,
    formState: { errors: affiliationInfoErrors },
    getValues: getAffiliationInfoFieldValues,
    reset: onAffiliationInfoReset,
    handleSubmit: onSubmitAffiliationInfo,
  } = useForm({
    defaultValues: affiliationInfo,
    resolver: yupResolver(affiliationInfoFieldsValidation),
  });

  /**
   * 소속 정보 수정 변경 이벤트 핸들러
   */
  const handleAffiliationInfoEdit = () => {
    setAffiliationInfoEdit(true);
  };

  /**
   * 소속 정보 수정 취소 이벤트 핸들러
   */
  const handleCancelAffiliationInfoEdit = () => {
    if (_isEqual(getAffiliationInfoFieldValues(), affiliationInfo)) {
      return setAffiliationInfoEdit(false);
    }

    if (window.confirm(ACCOUNT_INFO_EDIT_CANCEL_CONFIRM_MESSAGE)) {
      setAffiliationInfoEdit(false);
      onAffiliationInfoReset(affiliationInfo);
    }
  };

  /**
   * 소속 정보 수정 내용 저장 이벤트 핸들러
   */
  const handleSaveAffiliationInfo = onSubmitAffiliationInfo((values) => {
    handleUpdateAccountInfo(
      { accountId, ...primaryInfo, ...values },
      {
        onError: (error) => {
          toast.error(error.data.message);
        },
        onSuccess: () => {
          toast.success(ACCOUNT_CHANGED_AFFILIATION_INFO_MESSAGE);
          setAffiliationInfoEdit(false);
        },
      },
    );
  });

  /**
   * 계정 정보가 변경(패치)되었을 때 폼 데이터 리셋
   */
  React.useEffect(() => {
    if (isAccountInfoFetched) {
      onPrimaryInfoReset({ enabled: primaryInfo.enabled });
      onAffiliationInfoReset(affiliationInfo);
    }
  }, [isAccountInfoFetched]);

  /**
   * 계정정보 요청 실패시 토스트 메시지 노출
   */
  React.useEffect(() => {
    isAccountInfoError && toast.error(accountInfoError.data.message);
  }, [isAccountInfoError]);

  /**
   * 계정 정보 요청 여부에 따라 spinner show/hide
   */
  React.useEffect(() => {
    isAccountInfoLoading ? increaseLoadingTask() : decreaseLoadingTask();
  }, [isAccountInfoLoading]);

  /**
   * 계정 정보 변경 요청 여부에 따라 spinner show/hide
   */
  React.useEffect(() => {
    isUpdateAccountInfoLoading ? increaseLoadingTask() : decreaseLoadingTask();
  }, [isUpdateAccountInfoLoading]);

  /**
   * 임시비밀번호 발급 요청 여부에 따라 spinner show/hide
   */
  React.useEffect(() => {
    isPasswordResetLoading ? increaseLoadingTask() : decreaseLoadingTask();
  }, [isPasswordResetLoading]);

  return (
    <Grid container item spacing={3}>
      <Grid item xs={12}>
        {/* 기본 정보 */}
        <AccountPrimaryInfo
          isManager={isManager}
          primaryInfo={primaryInfo}
          control={primaryInfoControl}
          isEdit={isPrimaryInfoEdit}
          onEdit={handlePrimaryInfoEdit}
          onSave={handleSavePrimaryInfo}
          onCancel={handleCancelPrimaryInfoEdit}
          onResetPassword={handleResetPassword}
        />
      </Grid>
      <Grid item xs={12}>
        {/* 소속 정보 */}
        <AccountAffiliationInfo
          isEdit={isAffiliationInfoEdit}
          control={affiliationInfoControl}
          errors={affiliationInfoErrors}
          onEdit={handleAffiliationInfoEdit}
          onSave={handleSaveAffiliationInfo}
          onCancel={handleCancelAffiliationInfoEdit}
        />
      </Grid>
    </Grid>
  );
};
