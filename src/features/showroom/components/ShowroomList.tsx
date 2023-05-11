import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Box, Card, Chip, Tabs, Tab } from '@material-ui/core';
import { default as Label } from '@components/Label';
import { Row, ShowroomListItem, ShowroomSearchFields } from '../types';
import { ShowroomTypeOptionsForSearch, ShowroomStatusLabel, ShowroomStatusColor } from '../constants';
import { Table } from './base';

export interface ShowroomListProps {
  items: ShowroomListItem[];
  type: ShowroomSearchFields['type'];
  page: ShowroomSearchFields['page'];
  size: ShowroomSearchFields['size'];
  total: number;
  isLoading: boolean;
  onChangePage: (page: number, size: number) => void;
  onChangeType: (value: ShowroomSearchFields['type']) => void;
}

/**
 * 쇼룸 검색 결과 목록
 */
export const ShowroomList: React.FC<ShowroomListProps> = ({
  items,
  page = 1,
  size: limit = 10,
  type,
  total = 0,
  isLoading,
  onChangePage: handleChangePage,
  onChangeType: handleChangeType,
}) => {
  const rowFormat = useMemo<Row<ShowroomListItem>>(
    () => [
      {
        label: '쇼룸ID',
        align: 'center',
        dataKey: 'id',
      },
      {
        label: '쇼룸코드',
        align: 'center',
        dataKey: 'code',
      },
      {
        label: '쇼룸명',
        align: 'center',
        dataKey: 'name',
        render: (name, { id }) => <Link to={`${id}`} children={name} />,
      },
      {
        label: '입점사',
        align: 'center',
        dataKey: 'providerName',
      },
      {
        label: '브랜드',
        align: 'center',
        dataKey: 'brandName',
      },
      {
        label: '키워드',
        align: 'center',
        dataKey: 'keywords',
        render: (_, { keywords = [] }) => {
          return keywords.map((keyword) => (
            <Chip key={keyword} label={keyword} sx={{ m: 1 }} variant="outlined" size="small" />
          ));
        },
      },
      {
        label: '최초 생성일',
        align: 'center',
        dataKey: 'createdDate',
      },
      {
        label: '최종 편집일',
        align: 'center',
        dataKey: 'updatedDate',
      },
      {
        label: '공개 상태',
        align: 'center',
        dataKey: 'status',
        render: (_, { status }) => <Label color={ShowroomStatusColor[status]} children={ShowroomStatusLabel[status]} />,
      },
    ],
    [],
  );

  return (
    <Card sx={{ backgroundColor: 'background.paper', minHeight: '200px', mt: 4 }}>
      {/* 쇼룸 타입 탭 */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={type}>
          {ShowroomTypeOptionsForSearch.map(({ label, value }) => (
            <Tab
              key={value}
              label={label}
              value={value}
              sx={{ py: 2 }}
              id={`tab-${value}`}
              aria-controls={`tabpanel-${value}`}
              onClick={() => handleChangeType(value)}
            />
          ))}
        </Tabs>
      </Box>

      {/* 검색 결과 테이블 */}
      <Box role="tabpanel" id={`tabpanel-${type}`} aria-labelledby={`tab-${type}`} sx={{ px: 2, pt: 4, pb: 0 }}>
        <Table<ShowroomListItem>
          rowKey="id"
          items={items}
          columns={rowFormat}
          isLoading={isLoading}
          pagination={{ page, limit, total, onChange: handleChangePage }}
        />
      </Box>
    </Card>
  );
};
