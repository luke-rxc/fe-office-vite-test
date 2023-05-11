import React from 'react';
import { Control, FieldErrors } from 'react-hook-form';
import { Grid, Typography } from '@material-ui/core';
import { Modal } from '@components/Modal';
import { Autocomplete } from '@components/Autocomplete';
import { Transfer } from '@components/transfer';
import {
  ADD_PROVIDER_TITLE,
  ADD_PROVIDER_BUTTON_LABEL,
  ADD_PROVIDER_FILED_NAMES,
  ADD_PROVIDER_FILED_LABELS,
  ADD_PROVIDER_FIELD_HELPER_TEXTS,
} from '../constants';
import { RoleListModel, ProviderComboListModel, ProviderComboItemModel, AddProviderFieldModel } from '../models';
import { ControlSwitch } from '../components';

interface IAddProviderProps {
  control: Control<AddProviderFieldModel>;
  errors: FieldErrors<AddProviderFieldModel>;
  roleList: RoleListModel;
  providerComboList: ProviderComboListModel;
  onChangeProviderId: (item: ProviderComboItemModel) => void;
  onChangeRoleIds: (unSelectedRoleIds: (string | number)[], SelectedRoleIds: (string | number)[]) => void;
  onClose: () => void;
  onSubmit: () => void;
}

export const AddProvider = ({
  control,
  errors,
  roleList,
  providerComboList,
  onChangeProviderId: handleChangeProviderId,
  onChangeRoleIds: handleChangeRoleIds,
  onClose: handleClose,
  onSubmit: handleSubmit,
}: IAddProviderProps): JSX.Element => {
  return (
    <Modal
      open
      title={ADD_PROVIDER_TITLE}
      confirmText={ADD_PROVIDER_BUTTON_LABEL}
      onClose={handleClose}
      onCancel={handleClose}
      onConfirm={handleSubmit}
    >
      <Grid container spacing={3}>
        {/* 입점사 */}
        <Grid item xs={12}>
          <Autocomplete
            required
            fullWidth
            options={providerComboList}
            label={ADD_PROVIDER_FILED_LABELS.PROVIDER_ID}
            error={!!errors[ADD_PROVIDER_FILED_NAMES.PROVIDER_ID]}
            helperText={errors?.[ADD_PROVIDER_FILED_NAMES.PROVIDER_ID]?.message}
            onChange={handleChangeProviderId}
            // material ui에서 요구하는 데이터 검증을 위한 함수들
            getOptionLabel={({ name }: ProviderComboItemModel) => name}
            isOptionEqualToValue={(v: ProviderComboItemModel, o: ProviderComboItemModel) => v.id === o.id}
          />
        </Grid>

        {/* 최고 권한 */}
        <Grid item xs={12}>
          <ControlSwitch
            control={control}
            name={ADD_PROVIDER_FILED_NAMES.IS_ROOT}
            label={ADD_PROVIDER_FILED_LABELS.IS_ROOT}
          />
          <Typography variant="caption" component="p">
            {ADD_PROVIDER_FIELD_HELPER_TEXTS.IS_ROOT}
          </Typography>
        </Grid>

        {/* 권한부여 */}
        <Grid item xs={12}>
          <Transfer
            rightList={[]}
            leftList={roleList}
            leftHeader={ADD_PROVIDER_FILED_LABELS.UNSELECTED_ROLES}
            rightHeader={ADD_PROVIDER_FILED_LABELS.SELECTED_ROLES}
            onChange={handleChangeRoleIds}
          />
        </Grid>
      </Grid>
    </Modal>
  );
};
