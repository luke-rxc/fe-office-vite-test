import React, { useEffect } from 'react';
import { Button, Divider, Grid } from '@material-ui/core';
import { FormControlSelect } from '@components/form';
import { DetailOptionBaseList } from './DetailOptionBaseList';
import { SelectOptionPropV2 } from '../../types';
import { StateModel } from '../../models';

interface Props {
  options: SelectOptionPropV2[];
  fieldValues: any;
  onChange: any;
  onAddOption: () => void;
  onApplyOption: () => void;
  onResetInputOption: (lengthValue: number | string) => void;
}

export const DetailOptionBase: React.FC<Props> = ({
  options,
  fieldValues,
  onChange: handleChange,
  onAddOption: handleAddOption,
  onApplyOption: handleApplyOption,
  onResetInputOption: handleResetInputOption,
}) => {
  const { fields, remove } = fieldValues;

  useEffect(() => {
    handleResetInputOption(fields.length || '');
  }, [fields, handleResetInputOption]);

  return (
    <Grid container justifyContent="flex-start" alignItems="center" flexWrap="nowrap">
      {/* 옵션명갯수 */}
      <Grid item display="flex" alignItems="center" md={1} xs={12}>
        <FormControlSelect<StateModel>
          label="갯수"
          name="optionsLen"
          options={options}
          onChange={handleChange}
          sx={{ width: 100 }}
        />
      </Grid>
      {/* // 옵션명갯수 */}

      {/* 옵션 추가 */}
      {!!fields.length && (
        <>
          <Divider />
          <Grid item md={10} xs={12} sx={{ my: 2 }}>
            <DetailOptionBaseList items={fields} onRemove={remove} />
          </Grid>
          <Grid item md={2} xs={12} sx={{ my: 2 }}>
            <ButtonWrapper variant="outlined" name="옵션추가" onClick={handleAddOption} />
            <ButtonWrapper name="적용" onClick={handleApplyOption} />
          </Grid>
        </>
      )}
    </Grid>
  );
};

const ButtonWrapper = ({ name, ...props }) => (
  <Button color="primary" size="large" variant="contained" sx={{ display: 'block', width: 100, my: 1 }} {...props}>
    {name}
  </Button>
);
