import { useDialog } from '@hooks/useDialog';
import { DialogType } from '@models/DialogModel';
import { Modal } from '@components/Modal';
import { BrandModalTitle, BrandModalCancelText, BrandModalConfirmText, DetailMode } from '../constants';
import { BrandForm } from '../components';
import { useBrandManageService } from '../services';
import { toBrandCreateRequestParams } from '../models';

export const BrandModalContainer = ({
  open,
  mode,
  brandId,
  onChangeMode: handleChangeMode,
  onClose: handleClose,
  ...props
}) => {
  const {
    form: {
      control,
      formState: { errors },
      resetForm,
      handleSubmit,
    },
    upload: { fileInfos, handleChangeLogoFile, handleClearLogoFile },
    comboBoxProvider,
    comboBoxMd,
    comboBoxAmd,
    handleChangeComboProvider,
    handleChangeComboMd,
    handleChangeComboAmd,
    brandInfo,
    handleCreateBrand,
    handleUpdateBrand,
  } = useBrandManageService(open, brandId);

  const { open: openDialog, close: closeDialog } = useDialog();

  /**
   * Create 모드의 Cancel 처리
   */
  const handleCancelCreateBrand = () => {
    openDialog({
      title: '브랜드 신규 생성 취소',
      content: '정말 브랜드 생성을 취소하시나요?\r\n작성된 내용은 저장되지 않습니다.',
      type: DialogType.CONFIRM,
      onConfirm: () => {
        closeDialog();
        handleClose && handleClose();
      },
    });
  };

  /**
   * Update 모드의 Cancel 처리
   */
  const handleCancelUpdateBrand = () => {
    openDialog({
      title: '브랜드 수정 취소',
      content: '브랜드 수정을 취소하시나요?\r\n변경된 내용은 저장되지 않습니다.',
      type: DialogType.CONFIRM,
      onConfirm: () => {
        closeDialog();
        resetForm(brandInfo);
        // 읽기 모드로 전환
        handleChangeMode(DetailMode.READ, brandId);
      },
    });
  };

  /**
   * 모드에 따른 Cancel 처리 모음
   */
  const handleCancelActions = {
    [DetailMode.CREATE]: () => handleCancelCreateBrand(),
    [DetailMode.READ]: () => handleClose(),
    [DetailMode.UPDATE]: () => handleCancelUpdateBrand(),
  };

  /**
   * Create 모드의 Confirm 처리
   */
  const handleConfirmCreateBrand = (values) => {
    handleCreateBrand(toBrandCreateRequestParams(values), {
      onSuccess: () => {
        openDialog({
          title: '브랜드 생성 완료',
          content: '브랜드에 상품을 등록하거나 대표 쇼룸을 설정할 수 있습니다.',
          onClose: () => {
            closeDialog();
            handleClose && handleClose();
          },
        });
      },
      onError: (error) => {
        openDialog({
          title: '브랜드 생성 실패',
          content: error.data?.message ?? '브랜드 생성 실패',
          onClose: () => {
            closeDialog();
          },
        });
      },
    });
  };

  /**
   * Update 모드의 Confirm 처리
   */
  const handleConfirmUpdateBrand = (values) => {
    handleUpdateBrand(values, {
      onSuccess: () => {
        openDialog({
          title: '브랜드 저장 완료',
          content: '브랜드 변경사항이 저장되었습니다.',
          onClose: () => {
            closeDialog();
            handleClose && handleClose();
          },
        });
      },
      onError: (error) => {
        openDialog({
          title: '브랜드 저장 실패',
          content: error.data?.message ?? '브랜드 저장 실패',
          onClose: () => {
            closeDialog();
          },
        });
      },
    });
  };

  /**
   * 모드에 따른 Confirm 처리 모음
   */
  const handleConfirmActions = {
    [DetailMode.CREATE]: handleSubmit(handleConfirmCreateBrand),
    [DetailMode.READ]: () => handleChangeMode(DetailMode.UPDATE, brandId),
    [DetailMode.UPDATE]: handleSubmit(handleConfirmUpdateBrand),
  };

  return (
    <Modal
      title={BrandModalTitle[mode]}
      open={open}
      width={1000}
      maxWidth="initial"
      maxHeight="95%"
      minHeight="80vh"
      cancelText={BrandModalCancelText[mode]}
      confirmText={BrandModalConfirmText[mode]}
      onCancel={handleCancelActions[mode]}
      onConfirm={handleConfirmActions[mode]}
    >
      <BrandForm
        mode={mode}
        control={control}
        errors={errors}
        fileInfo={fileInfos?.[0]}
        comboBoxProvider={comboBoxProvider}
        comboBoxMd={comboBoxMd}
        comboBoxAmd={comboBoxAmd}
        onChangeComboProvider={handleChangeComboProvider}
        onChangeComboMd={handleChangeComboMd}
        onChangeComboAmd={handleChangeComboAmd}
        onChangeLogoFile={handleChangeLogoFile}
        onClearLogoFile={handleClearLogoFile}
      />
    </Modal>
  );
};
