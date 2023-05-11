import { Modal } from '@components/Modal';
import { Typography, Button } from '@material-ui/core';
import { ExcelFileAccept } from '@utils/excel';
import FileUploadIcon from '@material-ui/icons/FileUpload';
import FileDownloadIcon from '@material-ui/icons/FileDownload';
import { ReturnTypeUseRaffleEventBulkTargetUploadService } from '../services';

interface Props {
  open: boolean;
  onCloseRaffleEventModel: ReturnTypeUseRaffleEventBulkTargetUploadService['onCloseRaffleEventModel'];
  onDownloadRaffleEventUserTemplateExcel: ReturnTypeUseRaffleEventBulkTargetUploadService['onDownloadRaffleEventUserTemplateExcel'];
  onUploadRaffleEventUserExcelData: ReturnTypeUseRaffleEventBulkTargetUploadService['onUploadRaffleEventUserExcelData'];
}

/**
 * 이벤트 응모 대상 파일 업로드 modal component
 */
export const RaffleEventUserUploadModal = ({
  open,
  onCloseRaffleEventModel: handleCloseRaffleEventModel,
  onDownloadRaffleEventUserTemplateExcel: handleDownloadRaffleEventUserTemplateExcel,
  onUploadRaffleEventUserExcelData: handleUploadRaffleEventUserExcelData,
}: Props) => {
  const onCloseModal = (_: unknown, reason?: 'backdropClick' | 'escapeKeyDown') => {
    if (!!reason) {
      return;
    }
    handleCloseRaffleEventModel();
  };

  return (
    <Modal open={open} title="이벤트 응모 대상 파일 업로드" width="100%" minWidth="800px" onClose={onCloseModal}>
      <Typography variant="h6" gutterBottom component="div">
        이벤트 응모 대상을 일괄 추가 하기 위해 다음과 같은 순서로 진행할 수 있습니다.
      </Typography>
      <Typography variant="body1" gutterBottom mt={2}>
        1. 일괄 추가를 위해 <b>템플릿 엑셀</b>을 다운로드 합니다.
      </Typography>
      <Button
        variant="contained"
        onClick={handleDownloadRaffleEventUserTemplateExcel}
        startIcon={<FileDownloadIcon fontSize="small" />}
      >
        템플릿 엑셀 다운로드
      </Button>
      <Typography variant="body1" gutterBottom mt={2}>
        2. 엑셀 파일에서 지정하고자 하는 <b>사용자 정보(이메일)</b>를 입력 후 저장 합니다.{' '}
        <span>(*저장시 파일 형식은 xlsx 입니다)</span>
      </Typography>
      <Typography variant="body1" gutterBottom mt={1} mb={2}>
        3. 수정한 엑셀 파일을 아래의 <b>일괄 추가 엑셀 업로드 버튼</b>을 선택해서 파일을 업로드 합니다.
      </Typography>
      <input
        accept={ExcelFileAccept}
        style={{ display: 'none' }}
        id="excelUpload"
        type="file"
        onChange={handleUploadRaffleEventUserExcelData}
      />
      <label htmlFor="excelUpload">
        <Button color="primary" variant="contained" component="span" startIcon={<FileUploadIcon fontSize="small" />}>
          일괄 추가 엑셀 업로드
        </Button>
      </label>
    </Modal>
  );
};
