import React from 'react';
import { Control, FieldErrors } from 'react-hook-form';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { Card, CardHeader, CardContent, Divider, Table, TableBody, TableRow, TableCell } from '@material-ui/core';
import Done from '@material-ui/icons/Done';
import Close from '@material-ui/icons/Close';
import Edit from '@material-ui/icons/Edit';
import { IconButton } from '@components/IconButton';
import { ControlTextField } from '../components';
import { GeneralDetailModel } from '../models';

const useStyle = makeStyles((theme: Theme) => ({
  card: { paddingTop: theme.spacing(1) },
  label: { width: '40%' },
}));

interface Props extends GeneralDetailModel {
  isEdit: boolean;
  control: Control<GeneralDetailModel>;
  errors: FieldErrors<GeneralDetailModel>;
  onSave: () => void;
  onEdit: () => void;
  onCancel: () => void;
}

export const GeneralInfoDetail: React.FC<Props> = ({
  companyName,
  name,
  cellPhone,
  partName,
  isEdit,
  control,
  errors,
  onSave: handleSave,
  onEdit: handleEdit,
  onCancel: handleCancel,
}) => {
  const styles = useStyle();
  return (
    <Card>
      <CardHeader
        title="소속 정보"
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
            {/** 회사/단체명 */}
            <TableRow>
              <TableCell>회사/단체명</TableCell>
              <TableCell>{companyName}</TableCell>
            </TableRow>

            {/** 이름 */}
            <TableRow>
              <TableCell>이름</TableCell>
              <TableCell>
                <ControlTextField
                  size="small"
                  disabled={!isEdit}
                  control={control}
                  name="name"
                  error={!!errors.name}
                  helperText={errors?.name?.message}
                />
              </TableCell>
            </TableRow>

            {/** 연락처 */}
            <TableRow>
              <TableCell>연락처</TableCell>
              <TableCell>
                <ControlTextField
                  size="small"
                  disabled={!isEdit}
                  control={control}
                  name="cellPhone"
                  error={!!errors.cellPhone}
                  helperText={errors?.cellPhone?.message}
                />
              </TableCell>
            </TableRow>

            {/** 부서명 */}
            <TableRow>
              <TableCell>부서명</TableCell>
              <TableCell>
                <ControlTextField size="small" disabled={!isEdit} control={control} name="partName" />
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
}: Pick<Props, 'isEdit' | 'onEdit' | 'onSave' | 'onCancel'>) => {
  return isEdit ? (
    <>
      <IconButton icon={<Done />} title="저장" onClick={handleSave} />
      <IconButton icon={<Close />} title="취소" onClick={handleCancel} />
    </>
  ) : (
    <>
      {' '}
      <IconButton icon={<Edit />} title="수정" onClick={handleEdit} />
    </>
  );
};
