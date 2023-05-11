import { useCallback, useState, useRef, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { useDialog } from '@hooks/useDialog';
import { DialogType } from '@models/DialogModel';
import {
  CountIdModel,
  MenuItemModel,
  ContentFormModel,
  ContentModel,
  ManageListModel,
  ContentDefaultModel,
  ContentShowroomModel,
  ContentComponentModel,
  getInitFormValue,
  getInitFormLiveList,
  ContentManageModel,
  getInitFormGoodsList,
} from '../models';
import { SORT_TYPE, CONTENT_STATUS, CONTENT_TYPE, ManageList, COMPONENT_POSITION } from '../constants';
import {
  getMaxNumForComponent,
  getIndexForPositionComponent,
  getRequiredComponent,
  getInitCountId,
  getMenuItemName,
} from '../utils';
import { useContentContext } from '../hooks';
import { useListService } from './useListService';
import { useFormValueService } from './useFormValueService';

/**
 * 전체 콘텐츠 정보 관리
 */
export const useContentService = (contentData: ContentManageModel) => {
  const { formState, setValue, getValues, unregister } = useFormContext();
  const { addContent, removeContent, updateSortContent } = useContentContext();
  const { handleToFirst, handleToLast, handleToFront, handleToBack } = useListService();
  const { handleResetMedia: handleResetMediaFormValue } = useFormValueService();
  const { open: dialogOpen, close: dialogClose } = useDialog();

  const managerData = useRef<ManageListModel[]>([]); // 관리데이터
  const countIdSet = useRef<CountIdModel>(); // 컴포넌트별 id를 관리하기 위한 카운터 정보
  const [availableComponentNum, setAvailableComponentNum] = useState<number>(); // 총 등록가능한 컴포넌트 개수
  const [contentType, setContentType] = useState<CONTENT_TYPE>(CONTENT_TYPE.STORY); // 전체 콘텐츠 타입
  // 콘텐츠 기본정보
  const [contentDefaultInfo, setContentDefaultInfo] = useState<ContentDefaultModel>({
    contentName: '',
    type: CONTENT_TYPE.STORY,
    publicEndDate: null,
    publicStartDate: null,
    status: CONTENT_STATUS.PRIVATE,
  });
  // 콘텐츠 쇼룸 정보
  const [contentShowroom, setContentShowroom] = useState<ContentShowroomModel>({
    id: null,
    brandId: null,
    brandName: '',
    brandImage: '',
    name: '',
  });
  const [menuList, setMenuList] = useState<MenuItemModel[]>([]); // 메뉴 리스트
  const [selectedList, setSelectedList] = useState<MenuItemModel[]>([]); // 선택된 메뉴 리스트
  const [viewId, setViewId] = useState<number>(); // 활성화 컴포넌트 id
  const [isInit, setIsInit] = useState<boolean>(true);

  /**
   * - 컴포넌트 추가시,
   * - @param compType: 컴포넌트 그룹정보, 타입 정보
   * - @param contentData : response 기준 컴포넌트 추가될때 기존 콘텐츠 정보
   */
  const handleAdd = useCallback(
    ({ componentGroup, componentType, contents, goodsList = [], liveList = [] }: ContentComponentModel) => {
      const manage = managerData.current;
      const targetManageGroup = manage.find((preset) => preset.componentGroup === componentGroup);
      // 관리데이터에서 관리되지 않는 컴포넌트 그룹은 추가 X
      if (!targetManageGroup) {
        return;
      }
      const { position, required, maxCount } = targetManageGroup; // 추가 할 컴포넌트의 기본 위치정보 / 필수여부 / 등록 가능한 개수 체크
      const { countId, groupCount } = countIdSet.current; // 추가시 고유 id 부과
      const groupCountId = groupCount.get(componentGroup);

      // 메뉴 정보
      const menu: MenuItemModel = {
        componentGroup,
        componentType,
        id: countId,
        groupId: groupCountId,
        position,
        required,
        maxCount,
        selected: false,
        isValid: true,
      };
      // 메뉴 리스트 업데이트
      setMenuList((prevList) => {
        const targetIndex = getIndexForPositionComponent(prevList, position, menu, manage);
        const newList = [...prevList];
        newList.splice(targetIndex, 0, menu);
        return [...newList];
      });

      // 콘텐츠 컨텍스트 데이터 정보
      const contentsDisplayContent: ContentModel = {
        id: countId,
        componentGroup,
        componentType,
        sortNum: 0,
        goodsList,
        liveList,
      };
      // 콘텐츠 컨텍스트 데이터 업데이트
      addContent(contentsDisplayContent);

      // 폼 데이터
      const formData: ContentFormModel = {
        id: countId,
        componentType,
        ...getInitFormValue(componentType, contents), // contents, media upload 정보
        goodsList: getInitFormGoodsList(goodsList),
        liveList: getInitFormLiveList(liveList),
      };
      // 폼 데이터 업데이트
      setValue(`${countId}`, formData);

      // id 처리를 위한 카운트 정보 업데이트
      countIdSet.current.countId += 1; // 컴포넌트 총개수
      groupCount.set(componentGroup, groupCountId + 1); // 그룹별 컴포넌트 개수
    },
    [addContent, setValue],
  );

  /**
   * 삭제
   * - @param selectedList
   * - @returns
   */
  const handleRemove = useCallback(() => {
    if (selectedList.length === 0) {
      dialogOpen({
        title: '컴포넌트 삭제',
        content: '컴포넌트를 선택해 주세요.',
        type: DialogType.ALERT,
        onClose: () => {
          dialogClose();
        },
      });
      return;
    }

    if (selectedList.filter((menu) => menu.required).length > 0) {
      dialogOpen({
        title: `컴포넌트 삭제`,
        content: '필수 컴포넌트는 삭제 할 수 없습니다.',
        type: DialogType.ALERT,
        onClose: () => {
          dialogClose();
        },
      });
      return;
    }

    const selectListName = selectedList.map((menu) => getMenuItemName(menu));

    dialogOpen({
      title: '컴포넌트 삭제',
      content: `${selectListName.join('\n')}\n\n정말 삭제 하시겠습니까?`,
      type: DialogType.CONFIRM,
      onConfirm: () => {
        const targetSelectedList = [...selectedList];
        targetSelectedList.forEach((menu) => {
          const { required, id } = menu;
          // 필수 컴포넌트인 경우는 제거불가
          if (required) {
            return;
          }
          // 메뉴 리스트 업데이트
          setMenuList((menus) => menus.filter((menu: MenuItemModel) => menu.id !== id));
          // 현재 선택된 리스트 업데이트
          setSelectedList((menus) => menus.filter((menu: MenuItemModel) => menu.id !== id));
          // 콘텐츠 콘텐츠 데이터 업데이트
          removeContent(id);
          // 폼 데이터 업데이트
          unregister(`${id}`);
        });

        dialogClose();
      },
      onClose: dialogClose,
    });
  }, [dialogClose, dialogOpen, removeContent, selectedList, unregister]);

  /**
   * 순서변경
   * - @param selectedList
   * - @param sort
   * - @returns
   */
  const handleSort = useCallback(
    (sortType: SORT_TYPE) => {
      if (selectedList.length === 0) {
        dialogOpen({
          title: `컴포넌트 정렬`,
          content: '컴포넌트를 선택해 주세요.',
          type: DialogType.ALERT,
          onClose: () => {
            dialogClose();
          },
        });
        return;
      }

      // 위치 고정인 메뉴는 sort 제외
      const targetList = selectedList.filter(
        (menu) => menu.position !== COMPONENT_POSITION.TOP && menu.position !== COMPONENT_POSITION.BOTTOM,
      );
      const selectedRowKeys = targetList.map((menu) => menu.id);
      if (selectedRowKeys.length === 0) {
        return;
      }
      const keyList = menuList.map((menu) => menu.id);
      let sortKeyList = [];
      switch (sortType) {
        case SORT_TYPE.TOP:
          sortKeyList = handleToFirst(keyList, selectedRowKeys);
          break;
        case SORT_TYPE.UP:
          sortKeyList = handleToFront(keyList, selectedRowKeys);
          break;
        case SORT_TYPE.DOWN:
          sortKeyList = handleToBack(keyList, selectedRowKeys);
          break;
        case SORT_TYPE.BOTTOM:
          sortKeyList = handleToLast(keyList, selectedRowKeys);
          break;
        default:
          break;
      }

      const sortList = sortKeyList.map((keyNum) => {
        return menuList.find((menu) => menu.id === keyNum);
      });
      const topList = [];
      const middleList = [];
      const bottomList = [];
      sortList.forEach((menu) => {
        // top, bottom 고정된 메뉴는 변경 x
        if (menu.position === COMPONENT_POSITION.TOP) {
          topList.push(menu);
        } else if (menu.position === COMPONENT_POSITION.BOTTOM) {
          bottomList.push(menu);
        } else {
          middleList.push(menu);
        }
      });
      const newList = [...topList, ...middleList, ...bottomList];
      setMenuList(newList);
    },
    [dialogClose, dialogOpen, handleToBack, handleToFirst, handleToFront, handleToLast, menuList, selectedList],
  );

  /**
   * 메뉴 선택시
   */
  const handleSelect = useCallback(
    (selectedMenu: MenuItemModel, isCtrlKey: boolean) => {
      const targetMenu = menuList.find((menu) => menu.id === selectedMenu.id);

      // select 리스트 업데이트
      const newSelectedItem: MenuItemModel = { ...selectedMenu };
      let newSelectedList = [];
      // 셀렉트 메뉴에 포함되어 있지 않을 경우 신규 추가
      if (!targetMenu || !targetMenu.selected) {
        newSelectedList = isCtrlKey ? [...selectedList, newSelectedItem] : [newSelectedItem];
      } else {
        newSelectedList =
          selectedList.length > 1 && !isCtrlKey
            ? [newSelectedItem]
            : selectedList.filter((item) => item.id !== selectedMenu.id);
      }

      const updatedSelectedList = [];
      const updatedMenuList = [];
      menuList.forEach((menu) => {
        const { id } = menu;
        const targetSelectedMenu = newSelectedList.find((selectItem) => selectItem.id === id);
        if (targetSelectedMenu) {
          updatedSelectedList.push(targetSelectedMenu);
        }
        updatedMenuList.push({
          ...menu,
          selected: !!targetSelectedMenu,
        });
      });
      // 메뉴 순서대로 셀렉트 리스트 정렬
      setSelectedList([...updatedSelectedList]);
      // menu 리스트 업데이트
      setMenuList(updatedMenuList);
    },
    [menuList, selectedList],
  );

  /**
   * 컴포넌트 별 미디어 리셋
   */
  const handleResetComponentMedia = useCallback(
    (id) => {
      handleResetMediaFormValue(id);
      const prevViewId = viewId;
      if (prevViewId !== null) {
        setViewId(null);
        // rerender
        setTimeout(() => setViewId(prevViewId), 1);
      }
    },
    [handleResetMediaFormValue, viewId],
  );

  /**
   * 전체 컴포넌트 미디어 리셋
   */
  const handleAllResetComponentMedia = useCallback(() => {
    const formValues = getValues();
    for (const id in formValues) {
      handleResetMediaFormValue(id);
    }

    const prevViewId = viewId;
    if (prevViewId !== null) {
      setViewId(null);
      // rerender
      setTimeout(() => setViewId(prevViewId), 1);
    }
  }, [getValues, handleResetMediaFormValue, viewId]);

  useEffect(() => {
    if (contentData) {
      const { contentDefault, showroom, componentList } = contentData;
      const contentsType = contentDefault.type;
      managerData.current = ManageList[contentsType];
      countIdSet.current = getInitCountId(contentsType);
      setAvailableComponentNum(getMaxNumForComponent(contentsType)); // 전체 등록 가능한 총 컴포넌트 개수
      setContentType(contentsType); // 콘텐츠 타입
      setContentDefaultInfo({ ...contentDefault }); // 콘텐츠 기본정보
      setContentShowroom({ ...showroom }); // 쇼룸 정보

      if (componentList.length) {
        // 초기 response 기준 리스트 셋팅
        componentList.forEach((comp: ContentComponentModel) => {
          handleAdd(comp);
        });
      }
      // required 인 컴포넌트 추가
      const requiredList = getRequiredComponent(contentsType);
      requiredList.forEach((requiredComp: ManageListModel) => {
        if (!componentList.find((comp) => comp.componentGroup === requiredComp.componentGroup)) {
          const { componentGroup, components } = requiredComp;
          handleAdd({ componentGroup, componentType: components[0].componentType }); // 필수 컴포넌트 추가
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [handleAdd, contentData]);

  useEffect(() => {
    /**
     * 메뉴를 변경 할때, 같은 타입의 컴포넌트를 연속해서 선택 할 경우,
     * contentsViewer에서 form요소에 바인딩된 id값을 제대로 인식하지 못하는 경우가 있어 formValue가 overwrite되는 케이스 발생.
     * 리렌더 처리가 제대로 될 수 있도록, 강제로 비동기 처리함.
     */
    setViewId(null);
    setTimeout(() => {
      setViewId((prevId) => {
        return selectedList.length === 1 ? selectedList[0].id : selectedList.length > 1 ? prevId : null;
      });
    }, 1);
  }, [selectedList]);

  useEffect(() => {
    // 메뉴 리스트 변경될때, 메뉴리스트에 순서에 맞추어 콘텐츠 콘텐츠 데이터의 sortNum값 업데이트
    menuList.forEach((menu, index) => {
      const { id } = menu;
      updateSortContent(id, index);
    });
  }, [menuList, updateSortContent]);

  useEffect(() => {
    // validate 에러 발생시 메뉴에 체크 표시
    if (formState.errors) {
      const { errors } = formState;
      setMenuList((prev) => {
        return prev.map((menu) => {
          return {
            ...menu,
            isValid: !errors.hasOwnProperty(menu.id),
          };
        });
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formState.errors]);

  useEffect(() => {
    // default 컴포넌트 노출
    if (menuList.length > 0 && isInit) {
      handleSelect(menuList[0], false);
      setIsInit(false);
    }
  }, [handleSelect, isInit, menuList]);

  return {
    contentType,
    contentDefaultInfo,
    contentShowroom,
    menuList,
    availableComponentNum,
    viewId,
    handleAdd,
    handleRemove,
    handleSort,
    handleSelect,
    handleResetComponentMedia,
    handleAllResetComponentMedia,
  };
};
