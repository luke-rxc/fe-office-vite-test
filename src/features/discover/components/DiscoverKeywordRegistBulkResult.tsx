import { Table, TableColumnProps } from '@components/table/Table';
import { Box, Typography, Chip } from '@material-ui/core';
import { useMemo } from 'react';
import { DiscoverKeywordMappingType, DiscoverKeywordMappingTypeLabel } from '../constants';
import { ReturnTypeUseDiscoverKeywordBulkMappingService } from '../services';
import { DiscoverKeywordRegistResponse } from '../types';

interface Props {
  mappingType: DiscoverKeywordMappingType;
  discoverKeywordBulkSummary: ReturnTypeUseDiscoverKeywordBulkMappingService['discoverKeywordBulkSummary'];
}

/**
 * 키워드 맵핑 일괄등록 결과 component
 */
export const DiscoverKeywordRegistBulkResult = ({ mappingType, discoverKeywordBulkSummary }: Props) => {
  const columns: Array<TableColumnProps<DiscoverKeywordRegistResponse<unknown>>> = useMemo(() => {
    return [
      {
        label: '처리결과',
        dataKey: 'success',
        align: 'center',
        render: (_, { success }) => {
          return (
            <Chip label={success ? '성공' : '실패'} color={success ? 'primary' : 'secondary'} variant="outlined" />
          );
        },
      },
      {
        label: `${DiscoverKeywordMappingTypeLabel[mappingType]}ID`,
        dataKey: 'id',
        width: '150px',
        align: 'center',
      },
      {
        label: '에러메세지',
        dataKey: 'message',
        align: 'left',
        render: (text) => {
          if (!text) {
            return '-';
          }
          return text;
        },
      },
    ];
  }, [mappingType]);

  if (!discoverKeywordBulkSummary) {
    return null;
  }

  const { total, success, items } = discoverKeywordBulkSummary;

  return (
    <Box sx={{ p: '10px', mt: '20px', border: '1px solid #e8e8e8' }}>
      <Typography variant="h5" gutterBottom mb={2}>
        키워드 맵핑 일괄등록 처리 결과
      </Typography>
      <Box mb="10px">
        <Chip label={`요청건: ${total}건`} color="default" variant="outlined" sx={{ mr: '10px' }} />
        <Chip label={`성공건: ${success}건`} color="primary" variant="outlined" sx={{ mr: '10px' }} />
        <Chip label={`실패건: ${total - success}건`} color="secondary" variant="outlined" sx={{ mr: '10px' }} />
      </Box>
      <Table columns={columns} items={items} rowKey="id" />
    </Box>
  );
};
