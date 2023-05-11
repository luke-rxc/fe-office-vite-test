import { Modal } from '@components/Modal';
import { Typography, Button, Box } from '@material-ui/core';
import { ExcelFileAccept } from '@utils/excel';
import FileUploadIcon from '@material-ui/icons/FileUpload';
import FileDownloadIcon from '@material-ui/icons/FileDownload';
import { ReactNode } from 'react';
import { DiscoverKeywordMappingType, DiscoverKeywordMappingTypeLabel } from '../constants';
import styled from '@emotion/styled';
import { ReturnTypeUseDiscoverKeywordBulkMappingService } from '../services';

interface Props
  extends Omit<ReturnTypeUseDiscoverKeywordBulkMappingService, 'discoverKeywordBulkSummary' | 'handleOpenModal'> {
  children: ReactNode;
  mappingType: DiscoverKeywordMappingType;
}

/**
 * 디스커버 키워드 일괄등록 modal component
 */
export const DiscoverKeywordRegistBulkModal = ({
  children,
  mappingType,
  openDiscoverKeywordBulkMappingModal,
  handleCloseModal,
  handleChangeUpload,
  handleDownloadExcel,
}: Props) => {
  const mappingTypeLabel = DiscoverKeywordMappingTypeLabel[mappingType];
  const onCloseModal = (_: unknown, reason?: 'backdropClick' | 'escapeKeyDown') => {
    if (!!reason) {
      return;
    }
    handleCloseModal();
  };

  return (
    <Modal
      open={openDiscoverKeywordBulkMappingModal}
      title={`키워드 맵핑 ${mappingTypeLabel} 일괄 추가`}
      width="100%"
      minWidth="800px"
      onClose={onCloseModal}
    >
      <Typography variant="h6" gutterBottom component="div">
        키워드에 맵핑할 {mappingTypeLabel}을 일괄 추가 하기 위해 다음과 같은 순서로 진행할 수 있습니다.
      </Typography>
      <Typography variant="body1" gutterBottom mt={2} mb={2}>
        1. 일괄 추가를 위해 <b>{mappingTypeLabel} 템플릿 엑셀</b>을 다운로드 합니다.
      </Typography>
      <Button variant="contained" onClick={handleDownloadExcel} startIcon={<FileDownloadIcon fontSize="small" />}>
        {mappingTypeLabel} 템플릿 엑셀 다운로드
      </Button>
      <Typography variant="body1" gutterBottom mt={2} mb={2}>
        2. 엑셀 파일에서 맵핑하고자 하는 정보를 입력 후 저장 합니다.
        <EmphasisTextStyled>(*저장시 파일 형식은 xlsx 입니다)</EmphasisTextStyled>
      </Typography>
      <Typography variant="body1" gutterBottom mt={1} mb={2}>
        3. 수정한 엑셀 파일을 아래의 <b>일괄 {mappingTypeLabel} 추가 엑셀 업로드</b> 버튼을 선택해서 파일을 업로드
        합니다.
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
          일괄 {mappingTypeLabel} 추가 엑셀 업로드
        </Button>
      </label>

      {children}
    </Modal>
  );
};

const EmphasisTextStyled = styled(Box)`
  display: inline-block;
  color: #ff0000;
`;
