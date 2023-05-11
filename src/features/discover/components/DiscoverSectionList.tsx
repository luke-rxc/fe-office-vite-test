import { Table, TableColumnProps } from '@components/table/Table';
import { Button } from '@material-ui/core';
import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { DiscoverSectionItemModel } from '../models';
import { ReturnTypeUseDiscoverSectionListService } from '../services';
import { DiscoverSectionTypeChip } from './DiscoverSectionTypeChip';
import { StatusChip } from './StatusChip';

interface Props
  extends Pick<
    ReturnTypeUseDiscoverSectionListService,
    'discoverSectionItems' | 'isLoading' | 'pagination' | 'handleDeleteSectionItem'
  > {}

export const DiscoverSectionList = ({
  discoverSectionItems,
  isLoading,
  pagination,
  handleDeleteSectionItem,
}: Props) => {
  const columns: Array<TableColumnProps<DiscoverSectionItemModel>> = useMemo(
    () => [
      {
        label: '섹션 ID',
        dataKey: 'id',
        align: 'center',
      },
      {
        label: '섹션 타이틀',
        dataKey: 'title',
        align: 'center',
        render: (__, { title, id }) => {
          return <Link to={`/display/discover/section/${id}`}>{title}</Link>;
        },
      },
      {
        label: '섹션 타입',
        dataKey: 'sectionTypeText',
        align: 'center',
        render: (__, { sectionType, sectionTypeText }) => {
          return <DiscoverSectionTypeChip className={sectionType.toLowerCase()} label={sectionTypeText} />;
        },
      },
      {
        label: '노출 타입',
        dataKey: 'displayTypeText',
        align: 'center',
      },
      {
        label: '최초 생성일',
        dataKey: 'createdDateText',
        align: 'center',
      },
      {
        label: '최종 수정일',
        dataKey: 'updatedDateText',
        align: 'center',
      },
      {
        label: '상태',
        dataKey: 'statusText',
        align: 'center',
        render: (_, { openStatusClassName, openStatusText }) => {
          return <StatusChip className={openStatusClassName} label={openStatusText} />;
        },
      },
      {
        label: '관리',
        dataKey: 'manage',
        align: 'center',
        render: (_, { id, isOpen }) => {
          if (isOpen) {
            return null;
          }

          return (
            <Button variant="contained" color="secondary" onClick={handleDeleteSectionItem(id)}>
              삭제
            </Button>
          );
        },
      },
    ],
    [handleDeleteSectionItem],
  );

  return (
    <Table columns={columns} items={discoverSectionItems} isLoading={isLoading} rowKey="id" pagination={pagination} />
  );
};
