import { useState } from 'react';
import { useOrder } from './useOrder';
import sortBy from 'lodash/sortBy';
import { syncSortNumber } from '../utils';

interface Props<T> {
  getCheckboxProps: (rowItem: T) => Object;
}

/**
 * 디스커버 키워드 맵핑 리스트 관련 hook
 */
export const useDiscoverKeywordMappingList = <T extends { rowKey: string; sortNum: number }>({
  getCheckboxProps,
}: Props<T>) => {
  const [list, setList] = useState<Array<T>>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<Array<string>>([]);
  const { order } = useOrder<T>();

  /**
   * 리스트 항목선택 키 업데이트
   */
  const handleChangeRowSelect = (selectedRowKeys: Array<string>) => {
    setSelectedRowKeys(sortBy(selectedRowKeys, 'sortNum'));
  };

  /**
   * 리스트 업데이트
   */
  const handleUpdateList = (updateSections: Array<T>, type: 'renew' | 'append' = 'renew') => {
    if (type === 'renew') {
      setList(updateSections);
    } else {
      setList((prev) => {
        return [...prev, ...updateSections].map((item, index) => {
          item.sortNum = index + 1;
          return item;
        });
      });
    }
  };

  /**
   * 선택한 리스트 삭제
   */
  const handleDeleteList = () => {
    setList((prevSections) => {
      return prevSections.reduce<{ sortNum: number; items: Array<T> }>(
        (target, item) => {
          if (!selectedRowKeys.includes(item.rowKey)) {
            target.items.push({ ...item, sortNum: target.sortNum });
            target.sortNum += 1;
          }
          return target;
        },
        { sortNum: 1, items: [] },
      ).items;
    });
    setSelectedRowKeys([]);
  };

  /**
   * 리스트 순서 변경
   */
  const handleOrder = (direction: string) => {
    return () => {
      handleUpdateList(syncSortNumber(order(direction, list, selectedRowKeys, 'rowKey')));
    };
  };

  const handleGetIdList = () => {
    return list.map((item) => Number(item.rowKey));
  };

  return {
    list,
    rowSelection: {
      selectedRowKeys,
      onChange: handleChangeRowSelect,
      getCheckboxProps,
    },
    handleUpdateList,
    handleDeleteList,
    handleOrder,
    handleGetIdList,
    handleChangeRowSelect,
  };
};
