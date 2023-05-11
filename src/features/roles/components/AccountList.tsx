/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Chip, Tooltip } from '@material-ui/core';
import { default as Label } from '@components/Label';
import { Table, TableColumnProps, PaginationProps } from '@components/table/Table';
import { ACCOUNT_TABLE_DATA_KEYS, ACCOUNT_TABLE_HEADER_LABELS, DETAIL_PAGE_ANCHOR_LABEL } from '../constants';
import { AccountListModel, AccountItemModel } from '../models';

interface IAccountListProps {
  /** 관리 계정 타입 */
  isManager: boolean;
  /** 계정 리스트 */
  accountList: AccountListModel;
  /** 전체 계정 수 */
  accountListTotal: number;
  /** 페이지에 보여질 계정 수 */
  accountListSize: number;
  /** 현재 노출되고 있는 페이지 인덱스 */
  accountListPage: number;
  /** 페이지 인덱스 변경 이벤트 콜백 */
  onChangePagination: (page: number, size: number) => void;
}

/**
 * 계정 리스트 컴포너트
 */
export const AccountList = ({
  isManager,
  accountList: items,
  accountListTotal: total,
  accountListSize: limit,
  accountListPage: page,
  onChangePagination: handleChangePagination,
}: IAccountListProps): JSX.Element => {
  /**
   * 테이블 columns 데이터
   */
  const columns = React.useMemo(() => createColumns(isManager), [isManager]);

  /**
   * 페이지네이션 데이터
   */
  const pagination = React.useMemo<PaginationProps>(() => {
    return { total, limit, page, onChange: handleChangePagination };
  }, [total, limit, page, handleChangePagination]);

  return <Table rowKey={ACCOUNT_TABLE_DATA_KEYS.ID} items={items} columns={columns} pagination={pagination} />;
};

/**
 * 계정 목록 테이블의 Column 정보 생성
 */
const createColumns = (isManager: boolean): Array<TableColumnProps<AccountItemModel>> => {
  return isManager
    ? // 매니저 계정 목록 columns
      [
        // 이메일
        {
          align: 'center',
          label: ACCOUNT_TABLE_HEADER_LABELS.EMAIL,
          dataKey: ACCOUNT_TABLE_DATA_KEYS.EMAIL,
          render: LinkButtonRender,
        },
        // 이름
        {
          align: 'center',
          label: ACCOUNT_TABLE_HEADER_LABELS.NAME,
          dataKey: ACCOUNT_TABLE_DATA_KEYS.NAME,
        },
        // 부서명
        {
          align: 'center',
          label: ACCOUNT_TABLE_HEADER_LABELS.PART_NAME,
          dataKey: ACCOUNT_TABLE_DATA_KEYS.PART_NAME,
        },
        // 생성일
        {
          align: 'center',
          label: ACCOUNT_TABLE_HEADER_LABELS.CREATED_DATE,
          dataKey: ACCOUNT_TABLE_DATA_KEYS.CREATED_DATE,
        },
        // 최고 권한
        {
          align: 'center',
          label: ACCOUNT_TABLE_HEADER_LABELS.IS_ROOT,
          dataKey: ACCOUNT_TABLE_DATA_KEYS.ROOT_YN,
        },
        // 계정 상태
        {
          align: 'center',
          label: ACCOUNT_TABLE_HEADER_LABELS.ACTIVE_STATE,
          dataKey: ACCOUNT_TABLE_DATA_KEYS.ACTIVE_STATE,
          render: AccountStateRender,
        },
      ]
    : //  파트너 계정 목록 columns
      [
        // 이메일
        {
          align: 'center',
          label: ACCOUNT_TABLE_HEADER_LABELS.EMAIL,
          dataKey: ACCOUNT_TABLE_DATA_KEYS.EMAIL,
          render: LinkButtonRender,
        },
        // 이름
        {
          align: 'center',
          label: ACCOUNT_TABLE_HEADER_LABELS.NAME,
          dataKey: ACCOUNT_TABLE_DATA_KEYS.NAME,
        },
        // 회사명
        {
          align: 'center',
          label: ACCOUNT_TABLE_HEADER_LABELS.COMPANY_NAME,
          dataKey: ACCOUNT_TABLE_DATA_KEYS.COMPANY_NAME,
        },
        // 입점사 리스트
        {
          align: 'center',
          label: ACCOUNT_TABLE_HEADER_LABELS.PROVIDER_NAMES,
          dataKey: ACCOUNT_TABLE_DATA_KEYS.PROVIDER_NAMES,
          render: ProviderListRender,
        },
        // 파트너 생성일
        {
          align: 'center',
          label: ACCOUNT_TABLE_HEADER_LABELS.PARTNER_CREATED_DATE,
          dataKey: ACCOUNT_TABLE_DATA_KEYS.CREATED_DATE,
        },
        // 파트너 계정 상태
        {
          align: 'center',
          label: ACCOUNT_TABLE_HEADER_LABELS.PARTNER_ACTIVE_STATE,
          dataKey: ACCOUNT_TABLE_DATA_KEYS.ACTIVE_STATE,
          render: AccountStateRender,
        },
      ];
};

/**
 * 계정 활성화 상태 태그 랜더
 */
const AccountStateRender = (activeState: AccountItemModel['activeState']): JSX.Element => {
  return activeState === '활성화' ? (
    <Label color="success">{activeState}</Label>
  ) : (
    <Label sx={{ backgroundColor: 'rgba(106, 106, 106, .6)' }}>{activeState}</Label>
  );
};

/**
 * 상세보기 링크 랜더
 */
const LinkButtonRender = (text: string, { id }: AccountItemModel): JSX.Element => {
  return (
    <Tooltip title={DETAIL_PAGE_ANCHOR_LABEL}>
      <RouterLink to={`${id}`}>{text}</RouterLink>
    </Tooltip>
  );
};

/**
 * 관리 입점사 렌더
 */
const ProviderListRender = (_: string, { providerNames: providerList }: AccountItemModel) => {
  const maxLength = 5;

  if (providerList.length <= maxLength) {
    return providerList.map((provider) => (
      <Chip variant="outlined" size="small" key={provider} label={provider} sx={{ m: 1 }} />
    ));
  }

  return (
    <>
      {providerList.slice(0, maxLength).map((provider) => (
        <Chip variant="outlined" size="small" key={provider} label={provider} sx={{ m: 1 }} />
      ))}
      ···
      <Chip variant="outlined" size="small" label={`외 ${providerList.length - maxLength}개`} sx={{ m: 1 }} />
    </>
  );
};
