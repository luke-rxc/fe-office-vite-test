import { useState, useCallback, useEffect, Fragment } from 'react';
import type { VFC } from 'react';
import classnames from 'classnames';
import styled from '@emotion/styled';
import { IconButton } from '@material-ui/core';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { CreatePresetModel, CreateListItemModel, MenuItemModel } from '../models';
import { CONTENT_TYPE, ManageList } from '../constants';
import { CreateListItem } from './CreateListItem';
import { CreateDetail } from './CreateDetail';

/**
 * 컴포넌트 추가 뷰
 */
type CreateViewerProps = {
  contentType: CONTENT_TYPE; // 콘텐츠 타입
  menuList: MenuItemModel[]; // 현재 추가된 메뉴 리스트
  onAdd: (compType: CreatePresetModel) => void; // 컴포넌트 추가
};
export const CreateViewer: VFC<CreateViewerProps> = ({ contentType, menuList, onAdd }) => {
  const manageData = ManageList[contentType];

  // 관리 데이터(managerList)를 기준으로 해당 콘텐츠타입에 따라 생성 가능한 컴포넌트 리스트를 관리한다.
  const [createList, setCreateList] = useState<CreateListItemModel[]>(
    manageData.map((item) => {
      const { components } = item;
      return {
        ...item,
        components: components.map((comp) => {
          return {
            ...comp,
            addCount: 0,
          };
        }),
        addCount: 0,
      };
    }),
  );
  const [isDetail, setIsDetail] = useState(false); // 컴포넌트 그룹별 컴포넌트 상세 보기뷰
  const [selectedGroup, setSelectedGroup] = useState<CreateListItemModel>(null);

  /**
   * 컴포넌트 선택시
   */
  const handleSelect = useCallback(
    (selectedComp: CreatePresetModel) => {
      onAdd({ ...selectedComp });
    },
    [onAdd],
  );

  /**
   * 그룹 선택
   */
  const handleGroupSelected = useCallback(
    (selectedItem: CreateListItemModel) => {
      const { componentGroup, components } = selectedItem;
      // 해당 그룹내 컴포넌트가 하나인 경우 바로 컴포넌트 추가
      if (components.length === 1) {
        handleSelect({
          componentGroup: componentGroup,
          componentType: components[0].componentType,
        });
        setSelectedGroup(null);
        return;
      }
      // 그룹내 컴포넌트가 여러개인 경우 상세 보기 뷰 노출
      setSelectedGroup(selectedItem);
      setIsDetail(true);
    },
    [handleSelect],
  );

  /**
   * 상세 보기 내 컴포넌트 선택
   */
  const handleDetailSelected = useCallback(
    (selectedItem: CreatePresetModel) => {
      handleSelect({
        ...selectedItem,
      });
      setIsDetail(false);
    },
    [handleSelect],
  );

  useEffect(() => {
    // 메뉴리스트가 변경될때 추가된 컴포넌트 개수를 체크
    setCreateList((prevList) => {
      return prevList.map((group) => {
        const { componentGroup, components } = group;
        const matchGroup = menuList.filter((menu) => menu.componentGroup === componentGroup);
        return {
          ...group,
          components: components.map((preset) => {
            const matchPreset = menuList.filter(
              (menu) => menu.componentGroup === componentGroup && menu.componentType === preset.componentType,
            );

            return {
              ...preset,
              addCount: matchPreset.length, // 프리셋 별 추가 된 개수
            };
          }),
          addCount: matchGroup.length, // 그룹핑 내 프리셋 총 추가 개수
        };
      });
    });
  }, [menuList]);

  return (
    <CreateViewerStyeld
      className={classnames('', {
        'detall-view': isDetail,
      })}
    >
      <div className="create-wrapper">
        <div className="list-wrapper">
          <div className="inner">
            <p>* 각 컴포넌트를 추가 생성 할 수 있습니다.</p>
            {createList.map((item: CreateListItemModel) => (
              <Fragment key={`${item.componentGroup}`}>
                {!item.required && <CreateListItem item={item} onSelect={handleGroupSelected} />}
              </Fragment>
            ))}
          </div>
        </div>
        <div className="detail-wrapper">
          <IconButton onClick={() => setIsDetail(false)}>
            <ArrowBackIcon /> <span className="txt-nav">BACK</span>
          </IconButton>
          {selectedGroup && (
            <CreateDetail className="detail-box" group={selectedGroup} onSelected={handleDetailSelected}></CreateDetail>
          )}
        </div>
      </div>
    </CreateViewerStyeld>
  );
};

const CreateViewerStyeld = styled.div`
  width: 100%;
  overflow: hidden;
  .create-wrapper {
    display: flex;
    flex-direction: row;
    width: 200%;
    transition: all 0.2s;
    & > .list-wrapper {
      width: 100%;
      & > .inner {
        height: 100%;
        min-height: 500px;
        overflow-y: auto;
      }
    }
    & > .detail-wrapper {
      width: 100%;
      .detail-box {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100%;
      }
      .txt-nav {
        font-size: 15px;
        font-weight: bold;
        color: black;
        margin-left: 5px;
      }
    }
  }

  &.detall-view .create-wrapper {
    transform: translateX(-50%);
  }
`;
