import React, { useState, useEffect, useCallback } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { Grid, ToggleButtonGroup, ToggleButton, Typography } from '@material-ui/core';
import { Modal } from '@components/Modal';
import { ListTitle } from '@components/ListTitle';
import { FormControlCheckbox } from '@components/form';
import { BulkType, BulkTypeOptions } from '../../constants';
import { ListBulkFormField, toReqDataFromCbModel } from '../../models';
import { BulkCbListProps } from '../../types';

interface Props {
  isBulkModalOpen: boolean;
  isBulkDownloading: boolean;
  bulkCbList: BulkCbListProps | null;
  bulkHeaderEntries: Record<string, string>;
  onBulkModalClose: () => void;
  onBulkExcelDownload: (excelBulkType: BulkType, headers: string[]) => void;
}

export const ManagerSearchBulkModal: React.FC<Props> = ({
  isBulkModalOpen,
  isBulkDownloading,
  bulkCbList: { base: bulkBaseCbList, mapping: bulkMappingCbList, option: bulkOptionCbList },
  bulkHeaderEntries,
  onBulkModalClose,
  onBulkExcelDownload: handleBulkExcelDownload,
}) => {
  /** SearchForm Method */
  const methods = useForm({
    defaultValues: {
      all: false,
      baseList: bulkBaseCbList.map(() => false),
      mappingList: bulkMappingCbList.map(() => false),
      optionList: bulkOptionCbList.map(() => false),
    },
  });

  const { getValues, setValue, watch } = methods;
  const [watchBaseList, watchMappingList, watchOptionList] = watch(['baseList', 'mappingList', 'optionList']);

  // 일괄 수정 상품 분류 탭 관리
  const [bulkListDownloadType, setBulkListDownloadType] = useState<BulkType>(BulkType.BASE);

  // 버튼 Disabled
  const [buttonDisabled, setButtonDisabled] = useState<boolean>(true);

  // View Mode
  const viewBase = bulkListDownloadType === BulkType.BASE;
  const viewMapping = bulkListDownloadType === BulkType.MAPPING;
  const viewOption = bulkListDownloadType === BulkType.OPTION;

  /**
   * 일괄수정 탭 변경시 진행
   * @description
   * - 전체 선택 해제
   * - 기존 탭의 리스트들 선택 해제
   */
  const handleBulkListDownloadTypeChange = (evt: React.MouseEvent<HTMLElement>, value: BulkType) => {
    updateAllCb(false);
    updateAllListCb(false);
    setBulkListDownloadType(value);
  };

  /**
   * Modal Close 시
   * @description
   * - Mui Dialog Api interface 준수
   * - backdropClick 이벤트 발생 시 Modal 닫히지 않음
   */
  const handleBulkModalClose = (
    event: React.MouseEvent<Element, MouseEvent> | React.KeyboardEvent<Element>,
    reason?: 'backdropClick' | 'escapeKeyDown',
  ) => {
    if (reason && reason === 'backdropClick') {
      return;
    }
    onBulkModalClose();
  };

  /**
   * Backdrop Click 시 이벤트 버블링 방지
   */
  const handleBackdropClick = (evt: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    evt.stopPropagation();
    return false;
  };

  /**
   * 리스트 전체 선택/해제
   */
  const updateAllListCb = (checked: boolean) => {
    const checkCallback = () => checked;

    if (viewBase) {
      const updateValue = bulkBaseCbList.map(checkCallback);
      setValue('baseList', updateValue);
    }
    if (viewMapping) {
      const updateValue = bulkMappingCbList.map(checkCallback);
      setValue('mappingList', updateValue);
    }
    if (viewOption) {
      const updateValue = bulkOptionCbList.map(checkCallback);
      setValue('optionList', updateValue);
    }
  };

  /**
   * 전체 선택 체크박스 제어
   */
  const updateAllCb = useCallback(
    (checked: boolean) => {
      setValue('all', checked);
    },
    [setValue],
  );

  /**
   * 전체 선택시의 제어
   * - 전체 선택 체크박스 변경
   * - 리스트 전체 선택/해제
   */
  const handleAllSelect = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const { checked } = evt.target;
    updateAllCb(checked);
    updateAllListCb(checked);
  };

  const handleConfirm = () => {
    if (viewBase) {
      const baseList = getValues('baseList');
      handleBulkExcelDownload(BulkType.BASE, toReqDataFromCbModel(baseList, bulkBaseCbList));
    }

    if (viewMapping) {
      const mappingList = getValues('mappingList');
      handleBulkExcelDownload(BulkType.MAPPING, toReqDataFromCbModel(mappingList, bulkMappingCbList));
    }

    if (viewOption) {
      const optionList = getValues('optionList');
      handleBulkExcelDownload(BulkType.OPTION, toReqDataFromCbModel(optionList, bulkOptionCbList));
    }
  };

  /**
   * 각 리스트 선택시의 제어
   * - 전체 선택 체크박스 체크
   * - 확인 버튼 Disabled 여부 체크
   */
  useEffect(() => {
    if (watchBaseList && viewBase) {
      const isNotAll = watchBaseList.includes(false);
      const isSelected = watchBaseList.includes(true);
      updateAllCb(!isNotAll);
      setButtonDisabled(!isSelected);
    }

    if (watchMappingList && viewMapping) {
      const isNotAll = watchMappingList.includes(false);
      const isSelected = watchMappingList.includes(true);
      updateAllCb(!isNotAll);
      setButtonDisabled(!isSelected);
    }

    if (watchOptionList && viewOption) {
      const isNotAll = watchOptionList.includes(false);
      const isSelected = watchOptionList.includes(true);
      updateAllCb(!isNotAll);
      setButtonDisabled(!isSelected);
    }
  }, [viewBase, viewMapping, viewOption, watchBaseList, watchMappingList, watchOptionList, updateAllCb]);

  useEffect(() => {
    if (!isBulkModalOpen) {
      setBulkListDownloadType(BulkType.BASE);
      updateAllCb(false);
      updateAllListCb(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isBulkModalOpen]);

  return (
    <Modal
      title="일괄수정 서식 다운로드"
      open={isBulkModalOpen}
      width={800}
      maxWidth="initial"
      confirmText={isBulkDownloading ? '다운로드 중...' : '확인'}
      onClose={handleBulkModalClose}
      onCancel={handleBulkModalClose}
      onConfirm={handleConfirm}
      onBackdropClick={handleBackdropClick}
      disabled={isBulkDownloading || buttonDisabled}
      disableEscapeKeyDown
    >
      <FormProvider {...methods}>
        <Grid container spacing={3}>
          {/* 분류 */}
          <Grid item md={3} xs={12}>
            <ListTitle name="분류" isRequired />
          </Grid>
          <Grid item md={9} xs={12}>
            <ToggleButtonGroup
              value={bulkListDownloadType}
              color="primary"
              exclusive
              onChange={handleBulkListDownloadTypeChange}
            >
              {BulkTypeOptions.map(({ value, label }) => (
                <ToggleButton key={value} value={value} disabled={value === bulkListDownloadType}>
                  {label}
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
          </Grid>

          {/* 다운로드 항목 */}
          <Grid item md={3} xs={12}>
            <ListTitle name="다운로드 항목" isRequired />
          </Grid>
          <Grid item md={9} xs={12} display="flex" flexWrap="wrap">
            <Grid item md={12} xs={12} sx={{ mb: 1 }} display="flex" alignItems="center">
              <FormControlCheckbox<ListBulkFormField>
                name="all"
                label="전체 선택"
                value={false}
                onChange={handleAllSelect}
              />
              <Typography color="primary" variant="body2">
                * 상품명은 기본으로 포함되며 옵션정보에서는 상품명 수정 불가
              </Typography>
            </Grid>
            {viewBase && (
              <>
                {bulkBaseCbList.map((option, index) => {
                  return (
                    <Grid item md={6} xs={12} key={option}>
                      <FormControlCheckbox<ListBulkFormField>
                        name={`baseList.${index}`}
                        label={bulkHeaderEntries[option]}
                        value={option}
                      />
                    </Grid>
                  );
                })}
              </>
            )}
            {viewMapping && (
              <>
                {bulkMappingCbList.map((option, index) => {
                  return (
                    <Grid item md={6} xs={12} key={option}>
                      <FormControlCheckbox<ListBulkFormField>
                        name={`mappingList.${index}`}
                        label={bulkHeaderEntries[option]}
                        value={option}
                      />
                    </Grid>
                  );
                })}
              </>
            )}
            {viewOption && (
              <>
                {bulkOptionCbList.map((option, index) => {
                  return (
                    <Grid item md={6} xs={12} key={option}>
                      <FormControlCheckbox<ListBulkFormField>
                        name={`optionList.${index}`}
                        label={bulkHeaderEntries[option]}
                        value={option}
                      />
                    </Grid>
                  );
                })}
              </>
            )}
          </Grid>
        </Grid>
      </FormProvider>
    </Modal>
  );
};
