import { Control } from 'react-hook-form';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { Table, TableBody, TableRow, TableCell } from '@material-ui/core';
import { Button, Card, CardHeader, CardContent, Divider } from '@material-ui/core';
import Done from '@material-ui/icons/Done';
import Close from '@material-ui/icons/Close';
import Edit from '@material-ui/icons/Edit';
import { IconButton } from '@components/IconButton';
import {
  ACCOUNT_INFO_ACTION_LABELS,
  ACCOUNT_PRIMARY_INFO_TITLE,
  ACCOUNT_PRIMARY_INFO_LABELS,
  ACCOUNT_PRIMARY_INFO_FIELD_NAMES,
} from '../constants';
import { primaryInfoStatusFieldOptions, AccountPrimaryInfoModel } from '../models';
import { ControlSelect } from './ControlSelect';

const useStyle = makeStyles((theme: Theme) => ({
  card: { paddingTop: theme.spacing(1) },
  label: { width: '40%' },
}));

interface IAccountPrimaryInfoProps {
  /** 계정 관리 타입 */
  isManager: boolean;
  /** 계정 정보 수정 모드 */
  isEdit: boolean;
  /** 계정 기본 정보 */
  primaryInfo: AccountPrimaryInfoModel;
  /** react-hook-form control */
  control: Control<Pick<AccountPrimaryInfoModel, 'enabled'>>;
  /** 기본정보 수정 저장 이벤트 */
  onSave: () => void;
  /** 기본정보 수정 이벤트 */
  onEdit: () => void;
  /** 기본정보 수정 취소 이벤트 */
  onCancel: () => void;
  /** 비밀번호 초기화 이벤트 */
  onResetPassword: () => void;
}

/**
 * 기본 정보 컴포넌트
 */
export const AccountPrimaryInfo = ({
  isManager,
  isEdit,
  primaryInfo,
  control,
  onSave: handleSave,
  onEdit: handleEdit,
  onCancel: handleCancel,
  onResetPassword,
}: IAccountPrimaryInfoProps): JSX.Element => {
  const styles = useStyle();
  return (
    <Card>
      <CardHeader
        title={ACCOUNT_PRIMARY_INFO_TITLE}
        action={<ActionButtons isEdit={isEdit} onSave={handleSave} onEdit={handleEdit} onCancel={handleCancel} />}
      />
      <Divider />
      <CardContent className={styles.card}>
        <Table>
          <colgroup>
            <col className={styles.label} />
            <col />
          </colgroup>

          <TableBody>
            {/** 이메일 */}
            <TableRow>
              <TableCell>{ACCOUNT_PRIMARY_INFO_LABELS.EMAIL}</TableCell>
              <TableCell>{primaryInfo.email}</TableCell>
            </TableRow>

            {/** 매니저 계정 생성일 */}
            <TableRow>
              <TableCell>
                {isManager
                  ? ACCOUNT_PRIMARY_INFO_LABELS.MANAGER_CREATED_DATE
                  : ACCOUNT_PRIMARY_INFO_LABELS.PARTNER_CREATED_DATE}
              </TableCell>
              <TableCell>{primaryInfo.createdDate}</TableCell>
            </TableRow>

            {/** 마지막 로그인 시간 */}
            <TableRow>
              <TableCell>{ACCOUNT_PRIMARY_INFO_LABELS.LAST_LOGIN_DATE}</TableCell>
              <TableCell>{primaryInfo.lastLoginDate}</TableCell>
            </TableRow>

            {/** 매니저 계정 상태 */}
            <TableRow>
              <TableCell>
                {isManager ? ACCOUNT_PRIMARY_INFO_LABELS.MANAGER_STATUS : ACCOUNT_PRIMARY_INFO_LABELS.PARTNER_STATUS}
              </TableCell>
              <TableCell>
                <ControlSelect
                  size="small"
                  disabled={!isEdit}
                  control={control}
                  options={primaryInfoStatusFieldOptions}
                  name={ACCOUNT_PRIMARY_INFO_FIELD_NAMES.STATUS}
                />
              </TableCell>
            </TableRow>

            {/** 비밀번호 변경 */}
            <TableRow>
              <TableCell colSpan={2}>
                <Button fullWidth variant="outlined" onClick={onResetPassword}>
                  {ACCOUNT_PRIMARY_INFO_LABELS.RESET_PASSWORD}
                </Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

/**
 * 기본 정보 수정/취소/저장 액션 컴포넌트
 */
const ActionButtons = ({
  isEdit,
  onEdit: handleEdit,
  onSave: handleSave,
  onCancel: handleCancel,
}: Pick<IAccountPrimaryInfoProps, 'isEdit' | 'onEdit' | 'onSave' | 'onCancel'>) => {
  return isEdit ? (
    <>
      <IconButton icon={<Done />} title={ACCOUNT_INFO_ACTION_LABELS.SAVE} onClick={handleSave} />
      <IconButton icon={<Close />} title={ACCOUNT_INFO_ACTION_LABELS.CANCEL} onClick={handleCancel} />
    </>
  ) : (
    <>
      {' '}
      <IconButton icon={<Edit />} title={ACCOUNT_INFO_ACTION_LABELS.EDIT} onClick={handleEdit} />
    </>
  );
};
