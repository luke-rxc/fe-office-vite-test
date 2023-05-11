import React, { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import differenceInMinutes from 'date-fns/differenceInMinutes';
import styled from '@emotion/styled';
import { Typography, Box, Button, Grid, FormControl, FormGroup, FormLabel } from '@material-ui/core';
import FileUploadIcon from '@material-ui/icons/FileUpload';
import { Modal } from '@components/Modal';
import {
  FormControlSelect,
  FormControlTextField,
  FormControlDatePickerLocal,
  FormControlRadioGroup,
} from '@components/form';
import { ExcelFileAccept } from '@utils/excel';
import { BulkUploadField } from '../../models';
import { BulkTypeOptions, BulkReservationOptions, BulkReservationType } from '../../constants';
import { callbackDateConverter } from '../../utils';

interface Props {
  isOpen: boolean;
  registeredExcelFileName: string | null;
  onCloseModal: () => void;
  onSubmit: (value: BulkUploadField) => void;
  onExcelUpload: (e: React.ChangeEvent<HTMLInputElement>) => Promise<unknown>;
}

export const BulkUploadModal: React.FC<Props> = ({
  isOpen,
  registeredExcelFileName,
  onCloseModal: handleCloseModal,
  onSubmit: handleExcelUploadSubmit,
  onExcelUpload: handleExcelUpload,
}) => {
  const { handleSubmit, watch, setValue } = useFormContext();
  const [watchReservationType] = watch(['reservationType']);

  useEffect(() => {
    if (watchReservationType === BulkReservationType.DIRECT) {
      setValue('reservationDate', null);
    }
  }, [watchReservationType, setValue]);

  return (
    <Modal open={isOpen} title="상품 일괄수정 엑셀 업로드" width="100%" minWidth="900px" onClose={handleCloseModal}>
      <form onSubmit={handleSubmit(handleExcelUploadSubmit)}>
        <GridWrapperStyled container spacing={3}>
          {/* 분류 */}
          <Grid item md={12} xs={12}>
            <FormControlStyled>
              <FormLabel>분류</FormLabel>
              <FormGroup row>
                <FormControlSelect<BulkUploadField>
                  name="uploadBulkType"
                  inputProps={{ 'aria-label': 'uploadBulkType' }}
                  options={BulkTypeOptions}
                  displayEmpty
                  sx={{ width: '300px' }}
                />
              </FormGroup>
            </FormControlStyled>
          </Grid>

          {/* 수정 사유 */}
          <Grid item md={12} xs={12}>
            <FormControlStyled fullWidth>
              <FormLabel>수정 사유</FormLabel>
              <FormControlTextField<BulkUploadField>
                name="title"
                label=""
                fullWidth
                placeholder="수정 사유를 입력해 주세요"
                rules={{
                  required: '수정 사유를 입력하세요',
                }}
              />
            </FormControlStyled>
          </Grid>

          {/* 파일 업로드 */}
          <input
            accept={ExcelFileAccept}
            style={{ display: 'none' }}
            id="excelUpload"
            type="file"
            onChange={handleExcelUpload}
          />
          <Grid item md={12} xs={12}>
            <FormControlStyled>
              <FormLabel>파일</FormLabel>
              <label htmlFor="excelUpload">
                <Button
                  color="primary"
                  variant="contained"
                  component="span"
                  startIcon={<FileUploadIcon fontSize="small" />}
                  sx={{ width: 120, mr: 2 }}
                >
                  파일 등록
                </Button>
              </label>
              <Box sx={{ ml: 5 }}>
                {registeredExcelFileName ? (
                  <Typography variant="subtitle2">{registeredExcelFileName}</Typography>
                ) : (
                  <Typography variant="subtitle2" color="secondary">
                    파일을 등록해 주세요
                  </Typography>
                )}
              </Box>
            </FormControlStyled>
          </Grid>

          {/* 예약시기 */}
          <Grid item md={12} xs={12}>
            <FormControlStyled>
              <FormLabel>반영 시기</FormLabel>
              <FormControlRadioGroup<BulkUploadField>
                name="reservationType"
                options={BulkReservationOptions}
                rules={{ required: true }}
              />
              <FormControlDatePickerLocal<BulkUploadField>
                name="reservationDate"
                label="처리 예약 시간"
                disabled={watchReservationType === BulkReservationType.DIRECT}
                InputLabelProps={{
                  shrink: true,
                }}
                rules={{
                  required: watchReservationType !== BulkReservationType.DIRECT ? '처리 예약 시간을 입력하세요' : false,
                  validate: (value: Date | string) => {
                    if (watchReservationType !== BulkReservationType.DIRECT) {
                      const nowTime = new Date().getTime();
                      const valueTime = callbackDateConverter(value as Date);
                      const diffTime = differenceInMinutes(valueTime, nowTime);

                      if (diffTime < 5) {
                        return '처리 예약시간은 현재 시간보다 5분 이상이여야 합니다.';
                      }
                    }
                    return true;
                  },
                }}
              />
            </FormControlStyled>
          </Grid>
        </GridWrapperStyled>

        {/* Submit */}
        <Box p={2} display="flex" justifyContent="center" alignContent="center">
          <Button
            type="button"
            variant="contained"
            color="secondary"
            onClick={handleCloseModal}
            sx={{ marginRight: '10px' }}
          >
            취소
          </Button>
          <Button size="large" type="submit" color="primary" variant="contained">
            등록
          </Button>
        </Box>
      </form>
    </Modal>
  );
};

const GridWrapperStyled = styled(Grid)`
  padding: 24px 0;
`;

const FormControlStyled = styled(FormControl)`
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;

  & > label {
    width: 80px;
    margin-right: 20px;
    flex-shrink: 0;
  }
`;
