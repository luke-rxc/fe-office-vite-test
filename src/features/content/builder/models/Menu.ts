import type { MouseEventHandler } from 'react';
import { COMPONENT_POSITION } from '../constants';
import { CreatePresetModel } from './Common';

/**
 * 메뉴 아이템
 */
export type MenuItemModel = CreatePresetModel & {
  id: number; // 컴포넌트 아이디
  groupId: number; // 그룹내 컴포넌트 아이디
  position: COMPONENT_POSITION; // 고정 위치 정보
  required: boolean; // 필수 컴포넌트 여부
  maxCount: number; // 컴포넌트 생성 가능 개수
  selected: boolean; // 셀렉트 상태
  isValid: boolean; // 현재 컴포넌트 상태가 유효한지 여부
  onClick?: MouseEventHandler<HTMLElement>;
};
