import { useState } from 'react';
import { DiscoverSectionItemModel } from '../models';

/**
 * 섹션 리스트 hook
 */
export const useSectionList = () => {
  const [sections, setSections] = useState<Array<DiscoverSectionItemModel>>([]);

  /**
   * 섹션 리스트 업데이트
   */
  const handleUpdateSections = (
    updateSections: Array<DiscoverSectionItemModel>,
    type: 'renew' | 'append' = 'renew',
  ) => {
    if (type === 'renew') {
      setSections(updateSections);
    } else {
      setSections((prev) => {
        const updateList = [...prev, ...updateSections];
        return updateList.map((item, index) => {
          return { ...item, sortNum: index + 1 };
        });
      });
    }
  };

  /**
   * 선택한 섹션 리스트 삭제
   */
  const handleDeleteSections = (selectedRowKeys: Array<string>) => {
    setSections((prevSections) => {
      return prevSections.reduce<{ sortNum: number; items: Array<DiscoverSectionItemModel> }>(
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

  return { sections, handleUpdateSections, handleDeleteSections };
};
