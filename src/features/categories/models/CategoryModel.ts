export enum CategoryMoveMessage {
  SUCCESS = '카테고리 순서가 변경되었습니다.',
  FAIL = '카테고리 순서변경에 실패하였습니다.',
  WRONG = '다른 카테고리 분류로 이동할 수 없습니다.',
}

export enum CategoryCreateMessage {
  SUCCESS = '카테고리 추가가 완료되었습니다.',
  FAIL = '카테고리 추가에 실패하였습니다.',
  PARENT_CATEGORY_NOT_SELECTED = '부모 카테고리를 선택해주세요.',
}

export enum CategoryUpdateMessage {
  SUCCESS = '카테고리 수정이 완료되었습니다.',
  FAIL = '카테고리 수정에 실패하였습니다.',
}
