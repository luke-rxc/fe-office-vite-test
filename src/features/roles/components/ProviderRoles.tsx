import React from 'react';
import { Control } from 'react-hook-form';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { Card, CardHeader, CardContent, Chip, Divider } from '@material-ui/core';
import Done from '@material-ui/icons/Done';
import Close from '@material-ui/icons/Close';
import Edit from '@material-ui/icons/Edit';
import { IconButton } from '@components/IconButton';
import {
  PROVIDER_ROLE_LIST_EMPTY_TEXT,
  PROVIDER_ROLE_LIST_FIELD_NAMES,
  PROVIDER_ROLE_LIST_FIELD_LABELS,
  PROVIDER_ROLE_LIST_ACTION_BUTTON_LABELS,
} from '../constants';
import { ProviderItemModel } from '../models';
import { Chips, ControlSwitch, MoreMenu, MultiSelect } from '../components';

/**
 * 관리 입점사 권한 컴포넌트 스타일
 */
const useStyles = makeStyles((theme: Theme) => ({
  title: { '& .MuiCardHeader-title': { fontSize: '1rem !important' } },
}));

interface IProviderRolesProps {
  /** 관리 계정 타입 */
  isManager: boolean;
  /** 수정 모드 여부 */
  isEdit: boolean;
  /** 관리 입점사명 */
  name: ProviderItemModel['name'];
  /** 카테고리별 모든 권한 리스트 */
  roleCategories: ProviderItemModel['roleCategories'];
  /** 부여된 권한 ID, 권한명 리스트 */
  grantedRoles: ProviderItemModel['grantedRoles'];
  /** 부여된 권한 ID 리스트 */
  grantedRoleIds: string[];
  /** react-hook-form control */
  control: Control<any>;
  /** 관리 입점사 권한 수정 이벤트 핸들러 */
  onEdit: () => void;
  /** 관리 입점사 권한 수정 저장 이벤트 핸들러 */
  onSave: () => void;
  /** 관리 입점사 권한 수정 취소 이벤트 핸들러 */
  onCancel: () => void;
  /** 관리 입점사 삭제 이벤트 핸들러 */
  onDelete: () => void;
  /** 관리 입점사 권한 해제 이벤트 핸들러 */
  onUnGrantedRole: (roleId) => void;
  /** 관리 입점사 권한 부여/해제 이벤트 핸들러 */
  onToggleGrantedRoles: (roleIds, changedRole) => void;
}

/**
 * 관리 입점사 권한 목록(설정) 컴포넌트
 */
export const ProviderRoles = ({
  isEdit,
  isManager,
  name,
  roleCategories,
  grantedRoles,
  grantedRoleIds,
  control,
  onEdit: handleEdit,
  onSave: handleSave,
  onCancel: handleCancel,
  onDelete: handleDelete,
  onUnGrantedRole: handleUnGrantedRole,
  onToggleGrantedRoles: handleToggleGrantedRoles,
}: IProviderRolesProps): JSX.Element => {
  const styles = useStyles();
  return (
    <Card sx={{ marginTop: 3 }}>
      {/* 입점사명 */}
      {!isManager && (
        <>
          <CardHeader
            title={name}
            className={styles.title}
            action={
              <ActionMenu
                isEdit={isEdit}
                onEdit={handleEdit}
                onSave={handleSave}
                onCancel={handleCancel}
                onDelete={handleDelete}
              />
            }
          />
          <Divider />
        </>
      )}

      {/* 최고 관리자 권한 */}
      <CardHeader
        title={
          <ControlSwitch
            name={PROVIDER_ROLE_LIST_FIELD_NAMES.IS_ROOT}
            label={PROVIDER_ROLE_LIST_FIELD_LABELS.IS_ROOT}
            control={control}
            disabled={!isEdit}
          />
        }
        action={
          isManager && <ActionButtons isEdit={isEdit} onEdit={handleEdit} onSave={handleSave} onCancel={handleCancel} />
        }
      />
      <Divider />

      {/* 카테고리별 권한 메뉴 */}
      <CardContent>
        {roleCategories.map(({ label, roles }) => (
          <MultiSelect
            key={label}
            label={label}
            options={roles}
            readOnly={!isEdit}
            checkedValues={grantedRoleIds}
            onChange={handleToggleGrantedRoles}
          />
        ))}
      </CardContent>
      <Divider />

      {/* 부여된 권한 리스트 */}
      <CardContent>
        <Chips options={grantedRoles} isDelete={isEdit} onDelete={handleUnGrantedRole} />

        {/* 권한 목록이 없는 케이스 */}
        {!grantedRoles.length && <Chip sx={{ m: 1 }} label={PROVIDER_ROLE_LIST_EMPTY_TEXT} />}
      </CardContent>
    </Card>
  );
};

/**
 * 파트너 계정 권한에서 사용되는 액션 메뉴
 */
const ActionMenu = ({ isEdit, onEdit, onDelete, onSave, onCancel }) => {
  return (
    <>
      {/* 더보기 메뉴 */}
      {!isEdit && (
        <MoreMenu
          items={[
            { label: PROVIDER_ROLE_LIST_ACTION_BUTTON_LABELS.EDIT, action: onEdit },
            { label: PROVIDER_ROLE_LIST_ACTION_BUTTON_LABELS.DELETE, action: onDelete },
          ]}
        />
      )}

      {/* 수정 모드 */}
      {isEdit && (
        <>
          <IconButton title={PROVIDER_ROLE_LIST_ACTION_BUTTON_LABELS.SAVE} icon={<Done />} onClick={onSave} />
          <IconButton title={PROVIDER_ROLE_LIST_ACTION_BUTTON_LABELS.CANCEL} icon={<Close />} onClick={onCancel} />
        </>
      )}
    </>
  );
};

/**
 * 매니저 계정 권한에서 사용되는 액션 버튼
 */
const ActionButtons = ({ isEdit, onEdit, onSave, onCancel }) => {
  return (
    <>
      {/* 수정 버튼 */}
      {!isEdit && <IconButton title={PROVIDER_ROLE_LIST_ACTION_BUTTON_LABELS.EDIT} icon={<Edit />} onClick={onEdit} />}

      {/* 수정 모드 */}
      {isEdit && (
        <>
          <IconButton title={PROVIDER_ROLE_LIST_ACTION_BUTTON_LABELS.SAVE} icon={<Done />} onClick={onSave} />
          <IconButton title={PROVIDER_ROLE_LIST_ACTION_BUTTON_LABELS.CANCEL} icon={<Close />} onClick={onCancel} />
        </>
      )}
    </>
  );
};
