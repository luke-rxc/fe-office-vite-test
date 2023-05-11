import { Modal } from '@components/Modal';
import { ReturnTypeUseOrderBulkExportService } from '@features/order/services';
import { Typography, Button } from '@material-ui/core';
import { ExcelFileAccept } from '@utils/excel';
import FileUploadIcon from '@material-ui/icons/FileUpload';
import FileDownloadIcon from '@material-ui/icons/FileDownload';
import { ReactNode } from 'react';

interface Props {
  open: boolean;
  children: ReactNode;
  onCloseOrderExportModel: ReturnTypeUseOrderBulkExportService['handleCloseOrderExportModel'];
  onDownloadDeliveryCompanies: ReturnTypeUseOrderBulkExportService['handleDownloadDeliveryCompanies'];
  onUploadExportExcelData: ReturnTypeUseOrderBulkExportService['handleUploadExportExcelData'];
}

/**
 * 주문 일괄출고 modal component
 */
export const OrderBulkExportModal = ({
  open,
  children,
  onDownloadDeliveryCompanies,
  onUploadExportExcelData,
  onCloseOrderExportModel,
}: Props) => {
  const onCloseModal = (_: unknown, reason?: 'backdropClick' | 'escapeKeyDown') => {
    if (!!reason) {
      return;
    }
    onCloseOrderExportModel();
  };

  return (
    <Modal open={open} title="출고 일괄 업로드" width="100%" minWidth="800px" onClose={onCloseModal}>
      <Typography variant="h6" gutterBottom component="div">
        출고 처리는 다음과 같은 순서로 진행할 수 있습니다.
      </Typography>
      <Typography variant="body1" gutterBottom mt={2}>
        1. 주문 목록의 <b>출고 다운로드</b>를 선택하여 파일을 다운로드 합니다. <b>출고 다운로드</b> 버튼은 주문상태가{' '}
        <b>출고 가능 주문상태(상품준비, 부분출고준비, 부분배송중, 부분배송완료)</b>로만 검색된 경우에 노출됩니다.
      </Typography>
      <Typography variant="body1" gutterBottom mt={1} mb={2}>
        2. 엑셀파일에서 출고 그룹별로 출고일, 택배사, 운송장번호 입력합니다. 정보가 일부라도 누락된 경우 출고 처리가
        되지 않습니다 택배사 입력 정보는 아래 안내를 참고하여 입력합니다.
      </Typography>
      <Button
        variant="contained"
        onClick={onDownloadDeliveryCompanies}
        startIcon={<FileDownloadIcon fontSize="small" />}
      >
        택배사 목록 다운로드
      </Button>
      <Typography variant="body1" gutterBottom mt={2}>
        3. 수정한 파일을 저장한 후 <b>출고일괄 업로드</b> 메뉴를 선택해서 파일을 업로드합니다. 저장 시 파일 형식은 xlsx
        입니다.
      </Typography>
      <Typography variant="body1" gutterBottom mt={1} mb={2}>
        4. 출고일괄 업로드 결과를 확인합니다. 업로드 시 일부 누락되거나 올바르지 않은 정보로 항목이 실패할 수 있습니다.
      </Typography>
      <input
        accept={ExcelFileAccept}
        style={{ display: 'none' }}
        id="excelUpload"
        type="file"
        onChange={onUploadExportExcelData}
      />
      <label htmlFor="excelUpload">
        <Button color="primary" variant="contained" component="span" startIcon={<FileUploadIcon fontSize="small" />}>
          출고파일 등록
        </Button>
      </label>

      {children}
    </Modal>
  );
};
