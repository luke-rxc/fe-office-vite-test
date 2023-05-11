import { FormProvider, UseFormReturn } from 'react-hook-form';
import { Grid } from '@material-ui/core';
import { FormControlTextField, FormControlSelect } from '@components/form';
import { SectionFormFields as Fields, SectionFormFieldOptions } from '../types';
import { EditorCard } from './base';

export interface SectionFormProps {
  mode: 'create' | 'edit' | 'read';
  formMethods: UseFormReturn<Omit<Fields, 'contentIds'>>;
  formOptions: SectionFormFieldOptions;
}

export const SectionForm = ({ mode, formMethods, formOptions }: SectionFormProps) => {
  const isReadOnly = mode === 'read';

  return (
    <EditorCard title="섹션 기본 정보">
      <FormProvider {...formMethods}>
        <Grid container spacing={2}>
          <Grid item md={6} xs={12}>
            <FormControlTextField<Fields>
              fullWidth
              required={!isReadOnly}
              type="number"
              name="order"
              label="정렬순서"
              placeholder="숫자를 입력해주세요"
              disabled={isReadOnly}
              inputProps={{ maxLength: 15 }}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item md={6} xs={12}>
            <FormControlSelect<Fields>
              required={!isReadOnly}
              name="status"
              label={`공개상태${!isReadOnly ? ' *' : ''}`}
              placeholder="쇼룸 종류를 선택해주세요"
              disabled={isReadOnly}
              options={formOptions.status}
            />
          </Grid>
          <Grid item md={12} xs={12}>
            <FormControlTextField<Fields>
              fullWidth
              required={!isReadOnly}
              name="name"
              label="섹션 제목"
              placeholder="16자 이내로 입력해주세요"
              disabled={isReadOnly}
              inputProps={{ maxLength: 16 }}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
        </Grid>
      </FormProvider>
    </EditorCard>
  );
};
