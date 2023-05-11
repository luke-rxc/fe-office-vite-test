import React from 'react';
import { Control, FieldErrors } from 'react-hook-form';
import { Grid, Typography } from '@material-ui/core';
import { Modal } from '@components/Modal';
import { Transfer } from '@components/transfer';
import { Autocomplete } from '@components/Autocomplete';
import {
  MANAGER_INVITATION_APPROVAL_FILED_LEGEND,
  PARTNER_INVITATION_APPROVAL_FILED_LEGEND,
  INVITATION_APPROVAL_BUTTON_LABEL,
  INVITATION_APPROVAL_FILED_NAMES,
  INVITATION_APPROVAL_FILED_LABELS,
  INVITATION_APPROVAL_FIELD_HELPER_TEXTS,
} from '../constants';
import { InvitationsApprovalFiledModel, InvitationInfoModel, ProviderComboItemModel } from '../models';
import { ControlTextField, ControlSwitch } from '../components';

interface IInvitationApprovalModalProps {
  /** 관리 계정 타입 */
  isManager: boolean;
  /** 권한 리스트 */
  roles: InvitationInfoModel['roles'];
  /** 입점사 리스트 */
  providers: InvitationInfoModel['providerComboList'];
  /** react-hook-from control */
  control: Control<InvitationsApprovalFiledModel>;
  /** react-hook-from error */
  errors: FieldErrors<InvitationsApprovalFiledModel>;
  /** 초대 승인 모달 닫기 이벤트 콜백 */
  onClose: () => void;
  /** 초대 승인 요청 이벤트 콜백 */
  onSubmit: () => void;
  /** 권한 리스트 변경 이벤트 콜백 */
  onChangeRoleIds: (leftList: number[], rightList: number[]) => void;
  /** 입점사 변경 이벤트 콜백 */
  onChangeProviderId: (provider: ProviderComboItemModel) => void;
}

/**
 * 초대 승인 모달 컴포넌트
 */
export const InvitationApprovalModal = ({
  isManager,
  roles,
  providers,
  control,
  errors,
  onClose: handleClose,
  onSubmit: handleSubmit,
  onChangeRoleIds: handleChangeRoleIds,
  onChangeProviderId: handleChangeProviderId,
}: IInvitationApprovalModalProps) => {
  return (
    <Modal
      open
      maxHeight="95%"
      title={isManager ? MANAGER_INVITATION_APPROVAL_FILED_LEGEND : PARTNER_INVITATION_APPROVAL_FILED_LEGEND}
      confirmText={INVITATION_APPROVAL_BUTTON_LABEL}
      onClose={handleClose}
      onCancel={handleClose}
      onConfirm={handleSubmit}
    >
      <Grid container spacing={3}>
        {/* 이메일 */}
        <Grid item xs={12}>
          <ControlTextField
            disabled
            control={control}
            name={INVITATION_APPROVAL_FILED_NAMES.EMAIL}
            label={INVITATION_APPROVAL_FILED_LABELS.EMAIL}
          />
        </Grid>

        {/* 회사/단체명 */}
        <Grid item xs={12}>
          <ControlTextField
            disabled
            control={control}
            name={INVITATION_APPROVAL_FILED_NAMES.COMPANY_NAME}
            label={INVITATION_APPROVAL_FILED_LABELS.COMPANY_NAME}
          />
        </Grid>

        {/* 이름 */}
        <Grid item xs={12}>
          <ControlTextField
            disabled
            control={control}
            name={INVITATION_APPROVAL_FILED_NAMES.NAME}
            label={INVITATION_APPROVAL_FILED_LABELS.NAME}
          />
        </Grid>

        {/* 담당자 전화번호 */}
        <Grid item xs={12}>
          <ControlTextField
            disabled
            control={control}
            name={INVITATION_APPROVAL_FILED_NAMES.CELL_PHONE}
            label={INVITATION_APPROVAL_FILED_LABELS.CELL_PHONE}
          />
        </Grid>

        {/* 부서명 */}
        <Grid item xs={12}>
          <ControlTextField
            disabled
            control={control}
            name={INVITATION_APPROVAL_FILED_NAMES.PART_NAME}
            label={INVITATION_APPROVAL_FILED_LABELS.PART_NAME}
          />
        </Grid>

        {/* 입점사 */}
        {!isManager && (
          <Grid item xs={12}>
            <Autocomplete
              required
              fullWidth
              options={providers}
              label={INVITATION_APPROVAL_FILED_LABELS.PROVIDER_ID}
              error={!!errors[INVITATION_APPROVAL_FILED_NAMES.PROVIDER_ID]}
              helperText={errors?.[INVITATION_APPROVAL_FILED_NAMES.PROVIDER_ID]?.message}
              onChange={handleChangeProviderId}
              // material ui에서 요구하는 데이터 검증을 위한 함수들
              getOptionLabel={({ name }: ProviderComboItemModel) => name}
              isOptionEqualToValue={(v: ProviderComboItemModel, o: ProviderComboItemModel) => v.id === o.id}
            />
          </Grid>
        )}

        {/* 최고 권한 */}
        <Grid item xs={12}>
          <ControlSwitch
            control={control}
            name={INVITATION_APPROVAL_FILED_NAMES.IS_ROOT}
            label={INVITATION_APPROVAL_FILED_LABELS.IS_ROOT}
          />
          <Typography variant="caption" component="p">
            {INVITATION_APPROVAL_FIELD_HELPER_TEXTS.IS_ROOT}
          </Typography>
        </Grid>

        {/* 권한부여 */}
        <Grid item xs={12}>
          <Transfer
            leftList={roles}
            rightList={[]}
            leftHeader={INVITATION_APPROVAL_FILED_LABELS.UNSELECTED_ROLES}
            rightHeader={INVITATION_APPROVAL_FILED_LABELS.SELECTED_ROLES}
            onChange={handleChangeRoleIds}
          />
        </Grid>
      </Grid>
    </Modal>
  );
};
