import { useState } from 'react';
import { GoodsModel } from '../models';

/**
 * 상품 리스트 hook
 */
export const useGoodsList = () => {
  const [goodsList, setGoodsList] = useState<Array<GoodsModel>>([]);

  /**
   * 상품 리스트 업데이트
   */
  const handleUpdateGoodsList = (updateSections: Array<GoodsModel>, type: 'renew' | 'append' = 'renew') => {
    if (type === 'renew') {
      setGoodsList(updateSections);
    } else {
      setGoodsList((prev) => {
        const updateList = [...prev, ...updateSections];
        return updateList.map((item, index) => {
          return { ...item, sortNum: index + 1 };
        });
      });
    }
  };

  /**
   * 선택한 상품 리스트 삭제
   */
  const handleDeleteGoodsList = (selectedRowKeys: Array<string>) => {
    setGoodsList((prevSections) => {
      return prevSections.reduce<{ sortNum: number; items: Array<GoodsModel> }>(
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
  };

  return { goodsList, handleUpdateGoodsList, handleDeleteGoodsList };
};
