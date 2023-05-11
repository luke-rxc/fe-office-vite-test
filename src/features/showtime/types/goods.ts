/**
 * 검색 form field
 */
export interface SearchFormField {
  keyword: string;
}

/**
 * 상품검색 form field
 */
export interface SearchGoodsFormField {
  searchType: string;
  value: string;
}

/**
 * 상품 item
 */
export interface GoodsItem {
  consumerPrice: number;
  consumerPriceText: string;
  id: number;
  name: string;
  price: number;
  priceText: string;
  primaryImagePath?: string;
}

/**
 * 쇼타임 상품 interface
 */
export interface ShowtimeGoodsProps {
  addedGoodsItems: Array<GoodsItem>;
  handleUpdateGoodsItem: (items: Array<GoodsItem>) => void;
  handleRemoveGoodsItem: (id: number) => void;
}

/**
 * 쇼타임 상품 Modal interface
 */
export interface ShowtimeGoodsModalProps {
  showModal: boolean;
  handleOpenModal: () => void;
  handleCloseModal: () => void;
}
