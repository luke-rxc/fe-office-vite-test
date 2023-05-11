export interface BulkDetailTableType {
  dataKey: string;
  label: string;
}

/**
 * Response 로 받은 header 정보를 테이블로 구성하기위해 bulkHeaders 를 참조하여 매핑
 * @param bulkHeaders getExportBulkHeader 로 받은 header 기본 정보 Set
 * @param headers 상세 API에서 받은 header 정보
 * @returns
 */
export const toBulkDetailTable = (bulkHeaders: Record<string, string>, headers: string[]): BulkDetailTableType[] => {
  return headers.map((header) => {
    return {
      dataKey: header,
      label: bulkHeaders[header],
    };
  });
};
