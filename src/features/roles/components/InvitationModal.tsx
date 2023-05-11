import React from 'react';
import { Control, FieldErrors } from 'react-hook-form';
import { Grid } from '@material-ui/core';
import { Modal } from '@components/Modal';
import {
  INVITATION_FILED_LABELS,
  INVITATION_FILED_NAMES,
  INVITATION_BUTTON_LABEL,
  INVITATION_FIELD_HELPER_TEXTS,
  MANAGER_INVITATION_FILED_LEGEND,
  PARTNER_INVITATION_FILED_LEGEND,
} from '../constants';
import { InvitationFieldModel } from '../models';
import { ControlTextField } from '../components';

interface IInvitationModalProps {
  /** 관리 계정 타입 */
  isManager: boolean;
  /** react-hook-from control */
  control: Control<InvitationFieldModel>;
  /** react-hook-from error */
  errors: FieldErrors<InvitationFieldModel>;
  /** 초대 모달 닫기 이벤트 콜백 */
  onClose: () => void;
  /** 초대 요청 이벤트 콜백 */
  onSubmit: () => void;
}

export const InvitationModal = ({
  isManager,
  control,
  errors,
  onClose: handleClose,
  onSubmit: handleInvitation,
}: IInvitationModalProps): JSX.Element => {
  return (
    <Modal
      open
      title={isManager ? MANAGER_INVITATION_FILED_LEGEND : PARTNER_INVITATION_FILED_LEGEND}
      confirmText={INVITATION_BUTTON_LABEL}
      onClose={handleClose}
      onCancel={handleClose}
      onConfirm={handleInvitation}
    >
      <Grid container spacing={3}>
        {/* 이메일 */}
        <Grid item xs={12}>
          <ControlTextField
            required
            control={control}
            name={INVITATION_FILED_NAMES.EMAIL}
            label={INVITATION_FILED_LABELS.EMAIL}
            error={!!errors[INVITATION_FILED_NAMES.EMAIL]}
            helperText={errors?.[INVITATION_FILED_NAMES.EMAIL]?.message || INVITATION_FIELD_HELPER_TEXTS.EMAIL}
          />
        </Grid>

        {/* 회사/단체명 */}
        <Grid item xs={12}>
          <ControlTextField
            required
            disabled={isManager}
            control={control}
            name={INVITATION_FILED_NAMES.COMPANY_NAME}
            label={INVITATION_FILED_LABELS.COMPANY_NAME}
            error={!!errors[INVITATION_FILED_NAMES.COMPANY_NAME]}
            helperText={errors?.[INVITATION_FILED_NAMES.COMPANY_NAME]?.message}
          />
        </Grid>

        {/* 담당자 이름 */}
        <Grid item xs={12}>
          <ControlTextField
            required
            control={control}
            name={INVITATION_FILED_NAMES.NAME}
            label={INVITATION_FILED_LABELS.NAME}
            error={!!errors[INVITATION_FILED_NAMES.NAME]}
            helperText={errors?.[INVITATION_FILED_NAMES.NAME]?.message}
          />
        </Grid>

        {/* 담당자 연락처 */}
        <Grid item xs={12}>
          <ControlTextField
            required
            control={control}
            name={INVITATION_FILED_NAMES.CELL_PHONE}
            label={INVITATION_FILED_LABELS.CELL_PHONE}
            error={!!errors[INVITATION_FILED_NAMES.CELL_PHONE]}
            helperText={
              errors?.[INVITATION_FILED_NAMES.CELL_PHONE]?.message || INVITATION_FIELD_HELPER_TEXTS.CELL_PHONE
            }
          />
        </Grid>

        {/* 부서명 */}
        <Grid item xs={12}>
          <ControlTextField
            required
            control={control}
            name={INVITATION_FILED_NAMES.PART_NAME}
            label={INVITATION_FILED_LABELS.PART_NAME}
            error={!!errors[INVITATION_FILED_NAMES.PART_NAME]}
            helperText={errors?.[INVITATION_FILED_NAMES.PART_NAME]?.message}
          />
        </Grid>
      </Grid>
    </Modal>
  );
};
