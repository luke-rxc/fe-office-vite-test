import React, { useState } from 'react';
import type { VFC } from 'react';
import { useFormContext, useFieldArray } from 'react-hook-form';
import { List, Box, Checkbox, Divider, Typography } from '@material-ui/core';
import { ProviderDetailFormFieldModel } from '../models';
import { FormControlTextField } from './form';
import { ListItemWrapper } from './Styled';

/**
 * 입점사 담당자
 */
type ProviderPersonProps = {};
export const ProviderPerson: VFC<ProviderPersonProps> = () => {
  const { control, setValue, getValues } = useFormContext();
  const { fields } = useFieldArray({
    control,
    name: 'person',
  });
  const [checked, setChecked] = useState(Array(4).fill(false));
  const labels = fields.map((_, index) => {
    return getValues(`person.${index}.typeKor`);
  });

  /**
   * 상품 담당자 정보 동일 처리
   */
  const handleCopyMd = (e, n: number) => {
    setChecked((prev) => prev.map((check, index) => (index === n ? e.target.checked : check)));

    if (e.target.checked) {
      const mdInfo = getValues('person.0');
      setValue(`person.${n}.name`, mdInfo?.name);
      setValue(`person.${n}.phone`, mdInfo?.phone);
      setValue(`person.${n}.email`, mdInfo?.email);
    }
  };

  /**
   * 상품 담당자 정보 변경
   */
  const handleChangeMd = (e, type: string, index: number) => {
    if (index !== 0) {
      return;
    }
    const value = e.target.value;
    checked.forEach((check, index) => {
      if (check) {
        setValue(`person.${index}.${type}`, value);
      }
    });
  };

  return (
    <>
      {fields.map((person, index) => (
        <React.Fragment key={index}>
          <Typography color="textPrimary" variant="h6">
            {labels[index]}
          </Typography>
          <List sx={{ display: 'flex', flexWrap: 'wrap' }}>
            <ListItemWrapper listTitleName="담당자명" isRequired sx={{ width: '50%' }}>
              <Box sx={{ width: '100%' }}>
                <FormControlTextField<ProviderDetailFormFieldModel>
                  name={`person.${index}.name`}
                  label="담당자명"
                  sx={{ width: '100%' }}
                  disabled={checked[index]}
                  onChangeText={(e) => handleChangeMd(e, 'name', index)}
                />
              </Box>
            </ListItemWrapper>
            <ListItemWrapper listTitleName="연락처" isRequired sx={{ width: '50%' }}>
              <Box sx={{ width: '100%' }}>
                <FormControlTextField<ProviderDetailFormFieldModel>
                  name={`person.${index}.phone`}
                  label="연락처"
                  sx={{ width: '100%' }}
                  disabled={checked[index]}
                  onChangeText={(e) => handleChangeMd(e, 'phone', index)}
                />
              </Box>
            </ListItemWrapper>
            <ListItemWrapper listTitleName="E-mail" isRequired sx={{ width: '50%' }}>
              <Box sx={{ width: '100%' }}>
                <FormControlTextField<ProviderDetailFormFieldModel>
                  name={`person.${index}.email`}
                  label="E-mail"
                  sx={{ width: '100%' }}
                  disabled={checked[index]}
                  onChangeText={(e) => handleChangeMd(e, 'email', index)}
                />
              </Box>
            </ListItemWrapper>
            {index !== 0 && (
              <ListItemWrapper listTitleName="상품담당자와 동일" sx={{ width: '50%' }}>
                <Box sx={{ width: '100%' }}>
                  <Checkbox checked={checked[index]} color="primary" onChange={(e) => handleCopyMd(e, index)} />
                </Box>
              </ListItemWrapper>
            )}
          </List>
          {index !== fields.length - 1 && <Divider sx={{ mt: 3, mb: 3 }} />}
        </React.Fragment>
      ))}
    </>
  );
};
