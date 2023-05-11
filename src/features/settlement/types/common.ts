import { TableColumnProps } from '@components/table/Table';

/** 테이블 column */
export interface Column<T> extends Omit<TableColumnProps<T>, 'dataKey'> {
  dataKey: keyof T;
}

/** 테이블 row */
export type Row<T> = Column<T>[];
