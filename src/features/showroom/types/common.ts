import { TOption } from '@components/Select';
import { UploadFileInfo } from '@models/UploadModel';
import { TableColumnProps } from '@components/table/Table';

/**
 * Promise의 response 데이터 타입 추출
 */
export type Awaited<T> = T extends PromiseLike<infer U> ? Awaited<U> : T;

/**
 * 배열 item(element)의 타입 추출
 */
export type ArrayElement<A> = A extends readonly (infer T)[] ? T : never;

/**
 * table row 타입
 */
export type Row<T> = Column<T>[];

/**
 * table column 타입
 */
export type Column<T> = Omit<TableColumnProps<T>, 'dataKey'> & { dataKey: keyof T };

/**
 * 제네릭타입의 select option props
 */
export type SelectFieldOption<T = number | string> = Omit<TOption, 'value'> & { value: T };

/**
 * AutoCompleteField 옵션 타입
 */
export type AutoCompleteFieldOption<T = number> = { id: T; name: string };

/**
 * AutoCompleteField value 타입
 */
export type AutoCompleteFieldValue<T = number> = AutoCompleteFieldOption<T>;

/**
 * FileField value 타입
 */
export type FileFieldValue = UploadFileInfo[];
