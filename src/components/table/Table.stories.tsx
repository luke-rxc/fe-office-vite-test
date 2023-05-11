import { SortOrderType } from '@constants/table';
import { Button, Link } from '@material-ui/core';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { useState } from 'react';
import { Table } from './Table';

export default {
  title: 'Components/Table',
  component: Table,
} as ComponentMeta<typeof Table>;

interface Item {
  id: string;
  email: string;
  name: string;
  company: string;
  partnerName: string;
  showroomName: string;
  createDate: string;
  status: string;
}

const columns = [
  {
    label: (dataKey: string) => {
      const onClick = () => window.console.log(`${dataKey} 클릭!!`);
      return (
        <>
          Test
          <Button onClick={onClick}>클릭</Button>
        </>
      );
    },
    dataKey: 'id',
  },
  {
    label: '이름',
    dataKey: 'name',
  },
  {
    label: '회사/단체명',
    dataKey: 'company',
  },
  {
    label: '관리입점사',
    dataKey: 'partnerName',
    useSort: true,
  },
  {
    label: '관리 쇼룸',
    dataKey: 'showroomName',
  },
  {
    label: '생성일',
    dataKey: 'createDate',
  },
  {
    label: '회원상태',
    dataKey: 'status',
    useSort: true,
  },
  {
    label: '',
    dataKey: 'etc',
    render: () => {
      return <Link>상세정보</Link>;
    },
  },
];

const hideColumns = [
  {
    label: '이름',
    dataKey: 'name',
    hide: true,
  },
  {
    label: '회사/단체명',
    dataKey: 'company',
  },
  {
    label: '관리입점사',
    dataKey: 'partnerName',
  },
  {
    label: '관리 쇼룸',
    dataKey: 'showroomName',
  },
];

const Template: ComponentStory<typeof Table> = (args) => {
  const [orderType, setOrderType] = useState<SortOrderType | undefined>(undefined);
  const [orderKey, setOrderKey] = useState<string>('');
  const [selectedRowKeys, setSelectedRowKeys] = useState<Array<string>>([]);

  const handleSort = (orderKey: string, orderType: SortOrderType) => {
    setOrderKey(orderKey);
    setOrderType(orderType);
  };

  const handleChangeRowSelect = (selectedRowKeys, selectedItems, selectedIndexs) => {
    setSelectedRowKeys(selectedRowKeys as Array<string>);
    window.console.log(selectedRowKeys, selectedItems, selectedIndexs);
  };

  return (
    <Table
      {...{
        ...args,
        sort: {
          orderKey,
          orderType,
          handleSort,
        },
        rowSelection: {
          ...args.rowSelection,
          selectedRowKeys,
          onChange: handleChangeRowSelect,
        },
      }}
    />
  );
};

export const 기본 = Template.bind({});
기본.args = {
  columns,
  items: new Array(10).fill(true).map((_, index) => {
    return {
      id: `id_${index + 1}`,
      email: 'lucas@rxc.co.kr',
      name: '홍길동',
      company: '(주) 나이키코리아',
      partnerName: '(주) 나이키코리아',
      showroomName: '나이키 골프, 나이키코리아',
      createDate: '2021-08-01 10:00',
      status: 'Active',
    };
  }),
  sort: {
    orderType: undefined,
    orderKey: '',
    handleSort: (datakey: string, orderType: SortOrderType) => {
      window.console.log(datakey, orderType);
    },
  },
  rowKey: 'id',
};

export const 로딩처리 = Template.bind({});
로딩처리.args = {
  columns,
  isLoading: true,
  items: [],
  rowKey: 'id',
};

export const 페이지네이션_비노출 = Template.bind({});
페이지네이션_비노출.args = {
  columns,
  items: new Array(10).fill(true).map((_, index) => {
    return {
      id: `id_${index + 1}`,
      email: 'lucas@rxc.co.kr',
      name: '홍길동',
      company: '(주) 나이키코리아',
      partnerName: '(주) 나이키코리아',
      showroomName: '나이키 골프, 나이키코리아',
      createDate: '2021-08-01 10:00',
      status: 'Active',
    };
  }),
  pagination: false,
  sort: {
    orderType: undefined,
    orderKey: '',
    handleSort: (datakey: string, orderType: SortOrderType) => {
      window.console.log(datakey, orderType);
    },
  },
  rowKey: 'id',
};

const SeverTemplate: ComponentStory<typeof Table> = (args) => {
  const getItem = (page: number, limit: number): Array<Item> => {
    return new Array(limit).fill(true).map((_, index) => {
      return {
        id: `id_${(page - 1) * limit + index + 1}`,
        email: 'lucas@rxc.co.kr',
        name: '홍길동',
        company: '(주) 나이키코리아',
        partnerName: '(주) 나이키코리아',
        showroomName: '나이키 골프, 나이키코리아',
        createDate: '2021-08-01 10:00',
        status: 'Active',
      };
    });
  };

  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [items, setItems] = useState<Array<Item>>(getItem(page, limit));
  const [selectedRowKeys, setSelectedRowKeys] = useState<Array<string>>([]);

  const onChange = (page: number, limit: number) => {
    setPage(page);
    setLimit(limit);
    setItems(getItem(page, limit));
  };

  const [orderType, setOrderType] = useState<SortOrderType | undefined>(undefined);
  const [orderKey, setOrderKey] = useState<string>('');
  const handleSort = (orderKey: string, orderType: SortOrderType) => {
    setOrderKey(orderKey);
    setOrderType(orderType);
  };

  const handleChangeRowSelect = (selectedRowKeys, selectedItems, selectedIndexs) => {
    setSelectedRowKeys(selectedRowKeys as Array<string>);
    window.console.log(selectedRowKeys, selectedItems, selectedIndexs);
  };

  return (
    <Table
      {...{
        ...args,
        items,
        pagination: {
          page,
          limit,
          total: 200,
          onChange,
        },
        sort: {
          orderKey,
          orderType,
          handleSort,
        },
        rowSelection: {
          ...args.rowSelection,
          selectedRowKeys,
          onChange: handleChangeRowSelect,
        },
      }}
    />
  );
};

export const 서버_데이터_처리 = SeverTemplate.bind({});
서버_데이터_처리.args = {
  columns: columns,
  pagination: {
    page: 1,
    total: 100,
    limit: 10,
    onChange: (page: number, limit: number) => window.console.log(`page: ${page}, limit: ${limit}`),
  },
  rowsPerPageOptions: [10, 20, 30, 40],
  sort: {
    orderType: undefined,
    orderKey: '',
    handleSort: (datakey: string, orderType: SortOrderType) => {
      window.console.log(datakey, orderType);
    },
  },
  rowKey: 'id',
};

export const 체크박스_props_예제 = SeverTemplate.bind({});
체크박스_props_예제.args = {
  columns: columns,
  pagination: {
    page: 1,
    total: 100,
    limit: 10,
    onChange: (page: number, limit: number) => window.console.log(`page: ${page}, limit: ${limit}`),
  },
  rowsPerPageOptions: [10, 20, 30, 40],
  sort: {
    orderType: undefined,
    orderKey: '',
    handleSort: (datakey: string, orderType: SortOrderType) => {
      window.console.log(datakey, orderType);
    },
  },
  rowSelection: {
    getCheckboxProps: (item: Item) => {
      const idIndex = Number(item.id.split('_')[1]);
      return {
        disabled: idIndex < 5,
      };
    },
  },
  rowKey: 'id',
};

const columnsByRowSpan = [
  {
    label: '주문명',
    dataKey: 'name',
  },
  {
    label: '배송비',
    dataKey: 'shippingCost',
    rowSpan: (_, index) => {
      return index % 2 === 0 ? 2 : undefined;
    },
  },
];

const RowSpanTemplate: ComponentStory<typeof Table> = (args) => {
  return <Table {...args} />;
};

export const RowSpan_예제 = RowSpanTemplate.bind({});
RowSpan_예제.args = {
  columns: columnsByRowSpan,
  items: new Array(10).fill(true).map((_, index) => {
    return {
      id: `id_${index + 1}`,
      name: `상품_${index + 1}`,
      shippingCost: '2,000원',
    };
  }),
  rowKey: 'id',
};

export const 전체선택미사용및라벨설정 = Template.bind({});
전체선택미사용및라벨설정.args = {
  columns,
  items: new Array(10).fill(true).map((_, index) => {
    return {
      id: `id_${index + 1}`,
      email: 'lucas@rxc.co.kr',
      name: '홍길동',
      company: '(주) 나이키코리아',
      partnerName: '(주) 나이키코리아',
      showroomName: '나이키 골프, 나이키코리아',
      createDate: '2021-08-01 10:00',
      status: 'Active',
    };
  }),
  pagination: false,
  rowKey: 'id',
  hideAllSelect: true,
  allSelectionLabel: '선택',
};

export const 전체선택위치변경 = Template.bind({});
전체선택위치변경.args = {
  columns,
  items: new Array(10).fill(true).map((_, index) => {
    return {
      id: `id_${index + 1}`,
      email: 'lucas@rxc.co.kr',
      name: '홍길동',
      company: '(주) 나이키코리아',
      partnerName: '(주) 나이키코리아',
      showroomName: '나이키 골프, 나이키코리아',
      createDate: '2021-08-01 10:00',
      status: 'Active',
    };
  }),
  pagination: false,
  rowKey: 'id',
  rowSelection: {
    rowSelectionColumnIndex: 2,
  },
};

export const Column숨김처리 = Template.bind({});
Column숨김처리.args = {
  columns: hideColumns,
  items: new Array(10).fill(true).map((_, index) => {
    return {
      id: `id_${index + 1}`,
      email: 'lucas@rxc.co.kr',
      name: '홍길동',
      company: '(주) 나이키코리아',
      partnerName: '(주) 나이키코리아',
      showroomName: '나이키 골프, 나이키코리아',
      createDate: '2021-08-01 10:00',
      status: 'Active',
    };
  }),
  rowKey: 'id',
};
