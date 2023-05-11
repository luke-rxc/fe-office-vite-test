import { useCallback } from 'react';
import type { VFC } from 'react';
import { FormProvider } from 'react-hook-form';
import { Box, Typography, Divider } from '@material-ui/core';
import find from 'lodash/find';
import isEmpty from 'lodash/isEmpty';
import { Chips } from '@components/Chips';
import { Modal } from '@components/Modal';
import { TableProps } from '@components/table/Table';
import { useDialog } from '@hooks/useDialog';
import { DialogType } from '@models/DialogModel';
import { GoodsList, GoodsSearchForm } from '../components';
import { GoodsModel } from '../models';
import { useGoodsListService, useProviderService, useBrandService } from '../services';
import { DEAL_GOODS_MAX_NUM, DEAL_GOODS_LIST_TYPE } from '../constants';

/**
 * 상품 검색
 */
export type GoodsListContainerProps = {
  list: GoodsModel[];
  onConfirm: (goodsList: GoodsModel[]) => void;
  onCancel: () => void;
};
export const GoodsListContainer: VFC<GoodsListContainerProps> = ({ list, onConfirm, onCancel }) => {
  const { providerComboList } = useProviderService(); // 입점사 리스트
  const { brandComboList } = useBrandService(); // 브랜드 리스트
  const {
    formMethod,
    goodsList,
    isLoading,
    pagination,
    selectedIds,
    selectedItems,
    handleSearch,
    handleReset,
    handleChangeSelect,
    handleChangeSelectAll,
  } = useGoodsListService(list); // 상품 검색
  const { open: dialogOpen, close: dialogClose } = useDialog();

  /**
   * 상품 등록
   */
  const handleRegister = () => {
    if (selectedItems.length === 0 || selectedItems.length + list.length > DEAL_GOODS_MAX_NUM) {
      dialogOpen({
        title: `상품 등록`,
        content:
          selectedItems.length === 0 ? '선택된 상품이 없습니다.' : `상품은 ${DEAL_GOODS_MAX_NUM}개 등록 가능합니다.`,
        type: DialogType.ALERT,
        onClose: () => {
          dialogClose();
        },
      });
      return;
    }
    // 선택된 상품 추가 등록
    onConfirm([...selectedItems]);
  };

  /**
   * Chip label 렌더 함수
   */
  const getLabel = useCallback(({ goodsId, goodsName }: GoodsModel) => {
    return `${goodsName}(${goodsId})`;
  }, []);

  const rowSelectionProps: Extract<TableProps<GoodsModel>['rowSelection'], object> = {
    selectedRowKeys: selectedIds,
    enableSelectByRowClick: true,
    onChange: (_, items, __, itemId) => {
      if (!!itemId) {
        // 단일 체크/해지
        const id = itemId as unknown as number;
        const item = find(items, (item) => item.goodsId === id);
        handleChangeSelect(id, item);
      } else {
        // 전체 체크/해지
        const isSelectAll = !isEmpty(items);
        handleChangeSelectAll(isSelectAll);
      }
    },
  };

  return (
    <Modal
      title="상품 검색/추가"
      open={true}
      width={1200}
      minHeight={1000}
      maxWidth="initial"
      cancelText="닫기"
      confirmText="상품 등록"
      onConfirm={handleRegister}
      onCancel={onCancel}
      onClose={onCancel}
    >
      <FormProvider {...formMethod}>
        <GoodsSearchForm
          formMethod={formMethod}
          providerComboList={providerComboList}
          brandComboList={brandComboList}
          onSearch={handleSearch}
          onReset={handleReset}
        />
      </FormProvider>

      <Box sx={{ ml: 2, mt: 1, mb: 2 }}>
        <Typography variant="body2" sx={{ display: 'inline' }}>
          * 현재 스토리 콘텐츠에 등록된 상품은 조회 대상 제외된 결과 입니다.
        </Typography>
        <Typography color="secondary" variant="body2" sx={{ ml: 1, display: 'inline' }}>
          (*최대 {DEAL_GOODS_MAX_NUM}개 까지 전시 등록 가능합니다)
        </Typography>
      </Box>
      <Box sx={{ mt: 4 }}>
        {/* 선택한 상품 아이템 */}
        <Chips<GoodsModel>
          dataKey="goodsId"
          emptyText="선택된 상품이 없습니다"
          items={selectedItems}
          getLabel={getLabel}
          onDelete={handleChangeSelect}
        />

        <Divider sx={{ mt: 3, mb: 3 }} />
        <GoodsList
          listType={DEAL_GOODS_LIST_TYPE.SEARCH_LIST}
          items={goodsList}
          isLoading={isLoading}
          pagination={pagination}
          rowKey="goodsId"
          rowSelection={rowSelectionProps}
        />
      </Box>
    </Modal>
  );
};
