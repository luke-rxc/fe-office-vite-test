import React from 'react';
import styled from '@emotion/styled';
import { Link } from 'react-router-dom';
import { Card, Box } from '@material-ui/core';
import { Table, TableColumnProps } from '@components/table/Table';
import { BulkType } from '../../constants';
import { BulkDetailTableType } from '../../types';

interface Props {
  type: BulkType;
  list: Record<string, any>[];
  tableColumns: BulkDetailTableType[];
}

const getTableColumns = (columns: BulkDetailTableType[]): Array<TableColumnProps<Record<string, any>>> => {
  return columns.map((column) => {
    let render: TableColumnProps<Record<string, any>>['render'];
    let width: TableColumnProps<Record<string, any>>['width'];
    const { dataKey } = column;

    // 상품 아이디
    if (dataKey === 'goodsId' || dataKey === 'optionId') {
      width = '100px';
    }

    // 상품이름
    if (dataKey === 'name') {
      width = '400px';
      render = (value, item) => (
        <Link to={`/goods/${item.goodsId}`} target="_blank">
          {value}
        </Link>
      );
    }

    // 상품설명
    if (dataKey === 'description') {
      width = '500px';
      render = (value) => <DescriptionStyled>{value}</DescriptionStyled>;
    }

    // 상품 키워드, 검색 태그
    if (dataKey === 'keywords' || dataKey === 'searchTags') {
      render = (value) => {
        if (!value) {
          return null;
        }
        const valueList = value.split(',');
        return (
          <ListStyled>
            {valueList.map((valueItem) => {
              return (
                <div key={valueItem} className="list">
                  {valueItem}
                </div>
              );
            })}
          </ListStyled>
        );
      };
    }

    return {
      ...column,
      align: 'center',
      render,
      width,
    };
  });
};

export const BulkDetailTable: React.FC<Props> = ({ type, list, tableColumns }) => {
  const columns = getTableColumns(tableColumns);

  return (
    <Card
      sx={{
        backgroundColor: 'background.paper',
        minHeight: '100%',
        p: 3,
      }}
    >
      <Box>
        <Table columns={columns} items={list} rowKey="id" pagination={false} />
      </Box>
    </Card>
  );
};

const ListStyled = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  & .list {
    display: flex;
    flex-shrink: 0;
    flex-wrap: wrap;
    align-items: center;
    font-size: 12px;
    padding: 0 8px;
    border-radius: 12px;
    color: #172b4d;
    background: rgba(0, 0, 0, 0.08);
    margin-left: 2px;
    margin: 2px 0 0 2px;
    min-height: 32px;
    max-width: 100px;
    &:first-of-type {
      margin-left: 0;
    }
  }
`;

const DescriptionStyled = styled.p`
  white-space: pre-wrap;
`;
