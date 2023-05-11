import { Modal } from '@components/Modal';
import { ReturnTypeUseOrderExportBulkBookingDateService } from '@features/order/services';
import { Typography, Button } from '@material-ui/core';
import { ExcelFileAccept } from '@utils/excel';
import FileUploadIcon from '@material-ui/icons/FileUpload';
import FileDownloadIcon from '@material-ui/icons/FileDownload';
import { ReactNode } from 'react';

interface Props extends Partial<Omit<ReturnTypeUseOrderExportBulkBookingDateService, 'handleOpenModal'>> {
  children: ReactNode;
}

/**
 * 출고 일괄 투숙일지정 modal component
 */
export const ExportTicketBulkBookingDateModal = ({
  children,
  openDiscoverKeywordBulkBookingDateModal,
  handleCloseModal,
  handleChangeUpload,
  handleDownloadExcel,
}: Props) => {
  const onCloseModal = (_: unknown, reason?: 'backdropClick' | 'escapeKeyDown') => {
    if (!!reason) {
      return;
    }
    handleCloseModal();
  };

  return (
    <Modal
      open={openDiscoverKeywordBulkBookingDateModal}
      title="출고(티켓) 일괄 투숙일지정 처리"
      width="100%"
      minWidth="900px"
      onClose={onCloseModal}
    >
      <Typography variant="h6" gutterBottom component="div">
        출고(티켓) 일괄 투숙일지정 처리는 다음과 같은 순서로 진행할 수 있습니다.
      </Typography>
      <Typography variant="body1" gutterBottom mt={2}>
        1. 템플릿 엑셀을 다운로드 합니다. (템플릿 엑셀 다운로드 기능이 있을경우)
      </Typography>
      <Button variant="contained" onClick={handleDownloadExcel} startIcon={<FileDownloadIcon fontSize="small" />}>
        템플릿 엑셀 다운로드
      </Button>
      <Typography variant="body1" gutterBottom mt={1} mb={2}>
        2. 엑셀파일에서 출고번호, 주문번호, 투숙일을 입력합니다.
      </Typography>
      <Typography variant="body1" gutterBottom mt={2}>
        3. 수정한 파일을 저장한 후 <b>출고(티켓) 일괄 투숙일지정 엑셀 업로드</b> 버튼을 선택해서 파일을 업로드합니다.
        저장 시 파일 형식은 xlsx 입니다.
      </Typography>
      <Typography variant="body1" gutterBottom mt={1} mb={2}>
        4. 출고(티켓) 일괄 투숙일지정 엑셀 업로드 결과를 확인합니다. 업로드 시 일부 누락되거나 올바르지 않은 정보로
        항목이 실패할 수 있습니다.
      </Typography>
      <input
        accept={ExcelFileAccept}
        style={{ display: 'none' }}
        id="excelUpload"
        type="file"
        onChange={handleChangeUpload}
      />
      <label htmlFor="excelUpload">
        <Button color="primary" variant="contained" component="span" startIcon={<FileUploadIcon fontSize="small" />}>
          출고(티켓) 일괄 투숙일지정 엑셀 업로드
        </Button>
      </label>

      {children}
    </Modal>
  );
};
