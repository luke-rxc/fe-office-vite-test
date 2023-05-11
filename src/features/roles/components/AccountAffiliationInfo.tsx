import { Control, FieldErrors } from 'react-hook-form';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { Card, CardHeader, CardContent, Divider } from '@material-ui/core';
import { Table, TableBody, TableRow, TableCell } from '@material-ui/core';
import Done from '@material-ui/icons/Done';
import Close from '@material-ui/icons/Close';
import Edit from '@material-ui/icons/Edit';
import { IconButton } from '@components/IconButton';
import {
  ACCOUNT_INFO_ACTION_LABELS,
  ACCOUNT_AFFILIATION_INFO_TITLE,
  ACCOUNT_AFFILIATION_INFO_LABELS,
  ACCOUNT_AFFILIATION_INFO_FIELD_NAMES,
} from '../constants';
import { AccountAffiliationInfoModel } from '../models';
import { ControlTextField } from '../components/ControlTextField';

const useStyle = makeStyles((theme: Theme) => ({
  card: { paddingTop: theme.spacing(1) },
  label: { width: '40%' },
}));

interface IAccountAffiliationInfoProps {
  /** 계정 정보 수정 모드 */
  isEdit: boolean;
  /** react-hook-form control */
  control: Control<AccountAffiliationInfoModel>;
  /** react-hook-from error */
  errors: FieldErrors<AccountAffiliationInfoModel>;
  /** 소속 정보 수정 저장 이벤트 */
  onSave: () => void;
  /** 소속 정보 수정 이벤트 */
  onEdit: () => void;
  /** 소속 정보 수정 취소 이벤트 */
  onCancel: () => void;
}

/**
 * 소속 정보 컴포넌트
 */
export const AccountAffiliationInfo = ({
  isEdit,
  control,
  errors,
  onSave: handleSave,
  onEdit: handleEdit,
  onCancel: handleCancel,
}: IAccountAffiliationInfoProps): JSX.Element => {
  const styles = useStyle();
  return (
    <Card>
      <CardHeader
        title={ACCOUNT_AFFILIATION_INFO_TITLE}
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
            {/** 회사명 */}
            <TableRow>
              <TableCell>{ACCOUNT_AFFILIATION_INFO_LABELS.COMPANY_NAME}</TableCell>
              <TableCell>
                <ControlTextField
                  size="small"
                  disabled={!isEdit}
                  control={control}
                  name={ACCOUNT_AFFILIATION_INFO_FIELD_NAMES.COMPANY_NAME}
                  error={!!errors.companyName}
                  helperText={errors?.companyName?.message}
                />
              </TableCell>
            </TableRow>

            {/** 담당자 이름 */}
            <TableRow>
              <TableCell>{ACCOUNT_AFFILIATION_INFO_LABELS.NAME}</TableCell>
              <TableCell>
                <ControlTextField
                  size="small"
                  disabled={!isEdit}
                  control={control}
                  name={ACCOUNT_AFFILIATION_INFO_FIELD_NAMES.NAME}
                  error={!!errors.name}
                  helperText={errors?.name?.message}
                />
              </TableCell>
            </TableRow>

            {/** 담당자 연락처 */}
            <TableRow>
              <TableCell>{ACCOUNT_AFFILIATION_INFO_LABELS.CELL_PHONE}</TableCell>
              <TableCell>
                <ControlTextField
                  size="small"
                  disabled={!isEdit}
                  control={control}
                  name={ACCOUNT_AFFILIATION_INFO_FIELD_NAMES.CELL_PHONE}
                  error={!!errors.cellPhone}
                  helperText={errors?.cellPhone?.message}
                />
              </TableCell>
            </TableRow>

            {/** 부서명 */}
            <TableRow>
              <TableCell>{ACCOUNT_AFFILIATION_INFO_LABELS.PART_NAME}</TableCell>
              <TableCell>
                <ControlTextField
                  size="small"
                  disabled={!isEdit}
                  control={control}
                  name={ACCOUNT_AFFILIATION_INFO_FIELD_NAMES.PART_NAME}
                  error={!!errors.partName}
                  helperText={errors?.partName?.message}
                />
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
}: Pick<IAccountAffiliationInfoProps, 'isEdit' | 'onEdit' | 'onSave' | 'onCancel'>) => {
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
