import React from 'react';
import { Control, Controller, FieldErrors } from 'react-hook-form';
import DeleteIcon from '@material-ui/icons/Delete';
import {
  Autocomplete,
  Box,
  Button,
  CircularProgress,
  Grid,
  InputAdornment,
  TextField,
  Typography,
} from '@material-ui/core';
import AddPhotoAlternateIcon from '@material-ui/icons/AddPhotoAlternate';
import { FileUploader } from '@components/uploader/FileUploader';
import { UploadFileInfo } from '@models/UploadModel';
import { DetailMode } from '../constants';
import type { ComboSchema } from '../schemas';
import { BrandLogoViewer } from './BrandLogoViewer';
import type { BrandDetailForm } from '../types';
import type { UseComboBoxServiceResult } from '../services';

const disabledFieldByMode = {
  [DetailMode.CREATE]: [],
  [DetailMode.READ]: [
    'providerItem',
    'mdItem',
    'amdItem',
    'goodsCnt',
    'name',
    'subName',
    'description',
    'commissionRate',
  ],
  [DetailMode.UPDATE]: ['providerItem', 'goodsCnt'],
};

export interface BrandFormProps {
  mode: DetailMode;
  control: Control<BrandDetailForm>;
  errors?: FieldErrors<BrandDetailForm>;
  fileInfo: UploadFileInfo;
  comboBoxProvider: UseComboBoxServiceResult;
  comboBoxMd: UseComboBoxServiceResult;
  comboBoxAmd: UseComboBoxServiceResult;
  onChangeComboProvider: (event: React.SyntheticEvent<Element, Event>, option: ComboSchema) => void;
  onChangeComboMd: (event: React.SyntheticEvent<Element, Event>, option: ComboSchema) => void;
  onChangeComboAmd: (event: React.SyntheticEvent<Element, Event>, option: ComboSchema) => void;
  onChangeLogoFile: (uploadFilesInfo: UploadFileInfo[]) => Promise<void>;
  onClearLogoFile: () => void;
}

export const BrandForm = ({
  mode,
  control,
  errors,
  fileInfo,
  comboBoxProvider,
  comboBoxMd,
  comboBoxAmd,
  onChangeComboProvider: handleChangeComboProvider,
  onChangeComboMd: handleChangeComboMd,
  onChangeComboAmd: handleChangeComboAmd,
  onChangeLogoFile: handleChangeLogoFile,
  onClearLogoFile: handleClearLogoFile,
}: BrandFormProps) => {
  const isDisabledField = ({ name }: { name: string }) => disabledFieldByMode[mode].includes(name);

  return (
    <Grid container spacing={4}>
      <Grid item md={6} xs={12}>
        <Controller
          control={control}
          name="providerItem"
          rules={{ required: '입점사를 선택해 주세요.' }}
          render={({ field, fieldState: { error } }) => (
            /** @todo 공통화 처리 */
            <Autocomplete
              disabled={isDisabledField(field)}
              fullWidth
              value={field.value}
              open={comboBoxProvider.open}
              onOpen={comboBoxProvider.handleOpenCombo}
              onClose={comboBoxProvider.handleCloseCombo}
              onChange={handleChangeComboProvider}
              options={comboBoxProvider.items}
              getOptionLabel={({ name }: ComboSchema) => name}
              isOptionEqualToValue={(option: ComboSchema, value: ComboSchema) => option.id === value.id}
              renderInput={(params) => (
                <TextField
                  {...params}
                  required
                  label="관리 입점사"
                  error={!!error}
                  helperText={error?.message}
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {comboBoxProvider.isLoading ? <CircularProgress color="inherit" size={20} /> : null}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  }}
                />
              )}
            />
          )}
        />
      </Grid>
      <Grid item md={6}>
        {mode !== DetailMode.CREATE && (
          <Controller
            control={control}
            name="goodsCnt"
            render={({ field }) => (
              <TextField {...field} disabled={isDisabledField(field)} fullWidth label="상품 등록 개수" />
            )}
          />
        )}
      </Grid>
      <Grid item md={6} xs={12}>
        <Controller
          control={control}
          name="mdItem"
          rules={{ required: 'MD를 선택해 주세요.' }}
          render={({ field, fieldState: { error } }) => (
            /** @todo 공통화 처리 */
            <Autocomplete
              disabled={isDisabledField(field)}
              fullWidth
              value={field.value}
              open={comboBoxMd.open}
              onOpen={comboBoxMd.handleOpenCombo}
              onClose={comboBoxMd.handleCloseCombo}
              onChange={handleChangeComboMd}
              options={comboBoxMd.items}
              getOptionLabel={({ name }: ComboSchema) => name}
              isOptionEqualToValue={(option: ComboSchema, value: ComboSchema) => option.id === value.id}
              renderInput={(params) => (
                <TextField
                  {...params}
                  required
                  label="MD"
                  error={!!error}
                  helperText={error?.message}
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {comboBoxMd.isLoading ? <CircularProgress color="inherit" size={20} /> : null}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  }}
                />
              )}
            />
          )}
        />
      </Grid>
      <Grid item md={6} xs={12}>
        <Controller
          control={control}
          name="amdItem"
          rules={{ required: 'AM을 선택해 주세요.' }}
          render={({ field, fieldState: { error } }) => (
            /** @todo 공통화 처리 */
            <Autocomplete
              disabled={isDisabledField(field)}
              fullWidth
              value={field.value}
              open={comboBoxAmd.open}
              onOpen={comboBoxAmd.handleOpenCombo}
              onClose={comboBoxAmd.handleCloseCombo}
              onChange={handleChangeComboAmd}
              options={comboBoxAmd.items}
              getOptionLabel={({ name }: ComboSchema) => name}
              isOptionEqualToValue={(option: ComboSchema, value: ComboSchema) => option.id === value.id}
              renderInput={(params) => (
                <TextField
                  {...params}
                  required
                  label="AM"
                  error={!!error}
                  helperText={error?.message}
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {comboBoxAmd.isLoading ? <CircularProgress color="inherit" size={20} /> : null}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  }}
                />
              )}
            />
          )}
        />
      </Grid>
      <Grid item md={6} xs={12}>
        <Controller
          control={control}
          name="name"
          rules={{ required: '브랜드명을 입력해 주세요.', maxLength: 20 }}
          render={({ field, fieldState: { error } }) => (
            <TextField
              {...field}
              disabled={isDisabledField(field)}
              fullWidth
              required
              label="브랜드명 (메인)"
              error={!!error}
              helperText={error?.message}
              inputProps={{ maxLength: 20 }}
            />
          )}
        />
      </Grid>
      <Grid item md={6} xs={12}>
        <Controller
          control={control}
          name="subName"
          rules={{ maxLength: 20 }}
          render={({ field, fieldState: { error } }) => (
            <TextField
              {...field}
              disabled={isDisabledField(field)}
              fullWidth
              label="브랜드명 (서브)"
              error={!!error}
              helperText={error?.message}
              inputProps={{ maxLength: 20 }}
            />
          )}
        />
      </Grid>
      <Grid item md={12} xs={12}>
        <Controller
          control={control}
          name="description"
          render={({ field }) => (
            <TextField
              {...field}
              disabled={isDisabledField(field)}
              fullWidth
              multiline
              rows={4}
              label="브랜드명 소개"
            />
          )}
        />
      </Grid>
      <Grid item md={6} xs={12}>
        <Controller
          control={control}
          name="commissionRate"
          rules={{
            pattern: { message: '소수점 이하 최대 한자리까지 입력 가능합니다.', value: /^\d+((.)|(.\d{0,1})?)$/ },
            min: { message: '0보다 큰 값을 넣어주세요.', value: 0 },
            max: { message: '수수료는 값이 100을 넘을 수 없습니다.', value: 100 },
          }}
          render={({ field, fieldState: { error } }) => (
            <TextField
              {...field}
              disabled={isDisabledField(field)}
              fullWidth
              label="브랜드 수수료"
              value={field.value || ''}
              error={!!error}
              helperText={error?.message}
              InputProps={{
                endAdornment: <InputAdornment position="end">%</InputAdornment>,
              }}
            />
          )}
        />
      </Grid>
      <Grid item md={6} xs={12}></Grid>
      <Grid item md={4} xs={12}>
        <BrandLogoViewer fileInfo={fileInfo} sx={{ width: 300, height: 300 }} />
        {mode !== DetailMode.READ && fileInfo?.path && (
          <Button
            variant="contained"
            color="secondary"
            size="small"
            startIcon={<DeleteIcon />}
            onClick={handleClearLogoFile}
          >
            브랜드 로고 삭제
          </Button>
        )}
      </Grid>
      <Grid item md={4} xs={12}>
        <Controller
          control={control}
          name="primaryImageFileId"
          render={({ field }) => <input {...field} type="hidden" />}
        />
        {mode !== DetailMode.READ && (
          <FileUploader
            accept="image/svg+xml"
            fileInfos={[]}
            onChange={handleChangeLogoFile}
            width={120}
            height={80}
            sx={{ borderColor: errors?.primaryImageFileId?.message ? 'red' : 'divider' }}
            render={() => (
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  zIndex: 1,
                }}
              >
                <AddPhotoAlternateIcon fontSize="large" color="primary" />
              </Box>
            )}
          />
        )}
        {errors?.primaryImageFileId?.message && (
          <Typography variant="caption" color="error" align="center">
            브랜드 로고 이미지를 업로드해 주세요.
          </Typography>
        )}
        <Box my={2}>
          <Typography color="textSecondary" variant="subtitle2">
            로고 업로드
          </Typography>
          <Typography color="textSecondary" sx={{ ml: 1 }} display="block" variant="caption">
            크기: 최소 24x24 / 최대 208x24
          </Typography>
          <Typography color="textSecondary" sx={{ ml: 1 }} display="block" variant="caption" paragraph={true}>
            파일 형식: SVG{' '}
            <Typography color="secondary" variant="caption">
              (JPG, PNG 불가)
            </Typography>
          </Typography>
        </Box>
      </Grid>
      <Grid item md={4} xs={12}></Grid>
    </Grid>
  );
};
