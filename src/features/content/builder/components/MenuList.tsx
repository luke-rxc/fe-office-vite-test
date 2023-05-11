import { useEffect, useState, useCallback } from 'react';
import type { VFC } from 'react';
import styled from '@emotion/styled';
import { Divider, Box } from '@material-ui/core';
import { MenuItemModel } from '../models';
import { getIndexForPosition } from '../utils';
import { COMPONENT_POSITION, SORT_TYPE } from '../constants';
import { MenuItem } from './MenuItem';
import { SortButtons } from './SortButtons';

/**
 * 컴포넌트 리스트 메뉴
 */
type MenuListProps = {
  menuList: MenuItemModel[]; // 메뉴 리스트
  availableComponentNum: number | undefined; // 등록가능한 총 컴포넌트 개수
  onAdd: () => void; // 컴포넌트 추가
  onRemove: () => void; // 컴포넌트 삭제
  onSort: (sortType: SORT_TYPE) => void; // 컴포넌트 정렬
  onSelected: (menu: MenuItemModel, isCtrlKey: boolean) => void; // 컴포넌트 선택
};

export const MenuList: VFC<MenuListProps> = ({
  menuList,
  availableComponentNum,
  onAdd,
  onRemove,
  onSort,
  onSelected,
}) => {
  const [addBtnIndex, setAddBtnIndex] = useState<number>(0); // 컴포넌트 추가 버튼 렌더링 될 위치
  const [isMaxCount, setIsMaxCount] = useState<boolean>(false); // 등록된 컴포넌트 개수가 최대인지 여부

  /**
   * 삭제
   * @returns
   */
  const handleRemove = useCallback(() => {
    onRemove();
  }, [onRemove]);

  /**
   * 순서 변경
   * @param selectedList
   * @returns
   */
  const handleSort = useCallback(
    (sortType: SORT_TYPE) => {
      onSort(sortType);
    },
    [onSort],
  );

  /**
   * 메뉴 선택시
   */
  const handleSelect = useCallback(
    (menu: MenuItemModel, isCtrlKey) => {
      onSelected(menu, isCtrlKey);
    },
    [onSelected],
  );

  useEffect(() => {
    // 위치가 bottom인 컴포넌트가 있을 경우, bottom 위에 컴포넌트 추가버튼 노출
    const bottomIndex = getIndexForPosition(menuList, COMPONENT_POSITION.BOTTOM);
    setAddBtnIndex(bottomIndex < 0 ? menuList.length - 1 : bottomIndex - 1);
    setIsMaxCount(menuList.length === availableComponentNum);
  }, [availableComponentNum, menuList]);

  return (
    <MenuLayoutStyled>
      {/* 메뉴 순서 제어, 삭제 추가 컨트롤 영역 */}
      <div className="control-box">
        <BtnAddFillStyled
          type="button"
          onClick={() => onAdd()}
          className={isMaxCount && 'disabled'}
          disabled={isMaxCount}
        >
          + 컴포넌트 추가
        </BtnAddFillStyled>
        <Divider />
        <Box sx={{ pt: 1, pb: 1, width: '100%' }}>
          <SortButtons onSort={handleSort} />
        </Box>
        <BtnRemoveStyled type="button" onClick={() => handleRemove()}>
          선택한 컴포넌트 삭제
        </BtnRemoveStyled>
      </div>

      {/* 메뉴 리스트 */}
      <div className="menu-box">
        <div className="inner">
          {menuList.map((menu: MenuItemModel, index: number) => {
            return (
              <span key={index}>
                {addBtnIndex < 0 && (
                  <BtnAddStyled
                    type="button"
                    onClick={() => onAdd()}
                    className={isMaxCount && 'disabled'}
                    disabled={isMaxCount}
                  >
                    +
                  </BtnAddStyled>
                )}
                <MenuItem
                  onClick={(e) => {
                    const isCtrlKey = e.ctrlKey || e.metaKey;
                    handleSelect(menu, isCtrlKey);
                  }}
                  {...menu}
                />
                {addBtnIndex === index && (
                  <BtnAddStyled
                    type="button"
                    onClick={() => onAdd()}
                    className={isMaxCount && 'disabled'}
                    disabled={isMaxCount}
                  >
                    +
                  </BtnAddStyled>
                )}
              </span>
            );
          })}
          {menuList.length === 0 && (
            <BtnAddStyled
              type="button"
              onClick={() => onAdd()}
              className={isMaxCount && 'disabled'}
              disabled={isMaxCount}
            >
              +
            </BtnAddStyled>
          )}
        </div>
      </div>
    </MenuLayoutStyled>
  );
};
const MenuLayoutStyled = styled.div`
  height: 100%;
  .control-box {
    background: #fff;
    border-top: 1px solid #e0e0e0;
    height: 210px;
    overflow-y: auto;
  }
  .menu-box {
    position: relative;
    border-top: 1px solid #e0e0e0;
    height: calc(100% - 210px);
    overflow-y: auto;
    box-sizing: border-box;
    padding: 10px 0 40px 0;
  }
`;
const BtnStyled = styled.button`
  margin: 3%;
  position: relative;
  display: block;
  text-align: center;
  width: 94%;
  height: 50px;
  border-radius: 5px;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
`;
const BtnAddStyled = styled(BtnStyled)`
  border: 1px dashed #8cbae7;
  background: white;
  color: #1976d2;
  &:hover:not(.disabled) {
    background: #f5f5f5;
  }
  &.disabled {
    color: #34495e;
    opacity: 0.3;
  }
`;
const BtnAddFillStyled = styled(BtnStyled)`
  border: none;
  background: #34495e;
  color: white;
  &:hover:not(.disabled) {
    background: #3a5168;
  }
  &.disabled {
    opacity: 0.3;
  }
`;

const BtnRemoveStyled = styled(BtnStyled)`
  border: 1px solid #dfdfe1;
  background: #ffffff;
  color: #34495e;
  &:hover {
    background: #f3f3f3;
  }
`;
