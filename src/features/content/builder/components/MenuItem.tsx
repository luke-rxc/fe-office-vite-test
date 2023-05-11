import { useEffect, useState } from 'react';
import type { VFC } from 'react';
import styled from '@emotion/styled';
import ErrorIcon from '@material-ui/icons/Error';
import AccessTimeSharpIcon from '@material-ui/icons/AccessTimeSharp';
import { useFormContext } from 'react-hook-form';
import { MenuItemModel } from '../models';
import { FORM_KEY } from '../constants';
import { getMenuItemName } from '../utils';

/**
 * 컴포넌트 리스트 메뉴 - 항목
 */
type MenuItemProps = MenuItemModel;

export const MenuItem: VFC<MenuItemProps> = (props) => {
  const { id, position, required, selected, isValid, onClick } = props;
  const desc = `${required === true ? '필수' : ''}${position ? '고정' : ''}`;
  const { watch } = useFormContext();
  // 노출 기간 설정 사용여부
  const useDisplayDateTimeValue = watch(`${id}.${FORM_KEY.CONTENTS}.useDisplayDateTime`);
  const [useDisplayDateTime, setUseDisplayDateTime] = useState(useDisplayDateTimeValue);
  useEffect(() => {
    setUseDisplayDateTime(useDisplayDateTimeValue);
  }, [id, useDisplayDateTime, useDisplayDateTimeValue]);

  return (
    <MenuStyled type="button" className={`${selected && 'selected'} ${!isValid && 'error'}`} onClick={onClick}>
      <div className="inner">
        {!isValid && <ErrorIcon className="alert" color="error" />}
        <span className="name">
          {required && <>*</>}
          {getMenuItemName(props)}
          {desc && <span className="desc">{desc}</span>}
        </span>
        {useDisplayDateTime && <AccessTimeSharpIcon sx={{ ml: 1, mt: 0.3 }} fontSize="small" />}
      </div>
    </MenuStyled>
  );
};
const MenuStyled = styled.button`
  position: relative;
  display: block;
  text-align: center;
  width: 100%;
  height: 60px;
  background: white;
  border-radius: 5px;
  border: 1px solid #8cbae7;
  cursor: pointer;
  color: #1976d2;
  &.selected {
    border: 1px solid #8cbae7;
    background: #1976d2;
    color: #fff;
  }
  &.error {
    border: 1px solid red;
    background: rgba(255, 0, 0, 0.05);
    color: #1976d2 !important;
    &.selected {
      background: rgba(255, 0, 0, 0.3);
    }
  }
  &:hover:not(.selected) {
    border: 1px solid #1976d2;
    background: #e6f2ff;
    color: #1976d2;
  }
  > .inner {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 14px;
    font-weight: bold;
    & > .alert {
      margin-right: 8px;
    }
    & > .name {
      line-height: 20px;
    }
  }
  .desc {
    margin-left: 3px;
    font-size: 12px;
    font-weight: normal;
  }
`;
