import { useCallback, useEffect, useState } from 'react';
import { useDiscoverFeedRegisteredSectionListQuery, useModal } from '../hooks';
import { DiscoverSectionItemModel } from '../models';

export type ReturnTypeUseDiscoverFeedAddSectionService = ReturnType<typeof useDiscoverFeedAddSectionService>;

interface Props {
  sections: Array<DiscoverSectionItemModel>;
  handleUpdateSections: (updateSections: Array<DiscoverSectionItemModel>, type: 'renew' | 'append') => void;
}

/**
 * 디스커버 피드 섹션 추가 관련 service
 *
 * @param {Array<DiscoverSectionItemModel>} sections 추가된 섹션 리스트
 * @param {function} handleUpdateSections 섹션 리스트 업데이트
 */
export const useDiscoverFeedAddSectionService = ({ sections, handleUpdateSections }: Props) => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<Array<string>>([]);
  const { isOpenModal, handleOpenModal, handleCloseModal } = useModal();

  const { data: sectionList, isLoading } = useDiscoverFeedRegisteredSectionListQuery({
    enabled: isOpenModal,
  });

  useEffect(() => {
    return () => {
      setSelectedRowKeys([]);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpenModal]);

  /**
   * 섹션 리스트 항목선택 키 업데이트
   */
  const handleChangeRowSelect = (selectedRowKeys: Array<string>) => {
    setSelectedRowKeys(selectedRowKeys);
  };

  /**
   * 선택한 섹션 리스트 등록
   */
  const handleClickRegistSections = () => {
    const addSections = selectedRowKeys.map((key) => (sectionList ?? []).find((section) => section.rowKey === key));
    handleUpdateSections(addSections, 'append');
    handleCloseModal();
  };

  /**
   * 섹션리스트 선택 disabled 옵션 처리
   */
  const getCheckboxProps = useCallback(
    (item: DiscoverSectionItemModel) => ({
      disabled: sections.map((item) => item.rowKey).includes(item.rowKey),
    }),
    [sections],
  );

  return {
    isOpenModal,
    sectionList,
    addedSectionIds: sections.map((item) => item.rowKey),
    isLoading,
    rowSelection: {
      selectedRowKeys,
      onChange: handleChangeRowSelect,
      getCheckboxProps,
    },
    handleOpenModal,
    handleCloseModal,
    handleClickRegistSections,
  };
};
