import isEqual from 'lodash/isEqual';
import findLastIndex from 'lodash/findLastIndex';
import { getIsImageType } from '@utils/files';
import { UploadFileType } from '@services/useFileUploader';
import {
  PresetList,
  ManageList,
  CONTENT_TYPE,
  COMPONENT_POSITION,
  FORM_KEY,
  MEDIA_VIEW_RATIO,
  MEDIA_VIEW_RATIO_TYPE,
  PresetGroup,
} from '../constants';
import {
  ManageListModel,
  CountIdModel,
  ContentFormModel,
  MediaFileListModel,
  MenuItemModel,
  FormContentMediaModel,
} from '../models';

/**
 * 컴포넌트 그룹명 조회
 * @param type
 * @returns
 */
export const getComponentGroupName = (type: string): string => {
  switch (type) {
    case PresetList.HEADER.componentGroup:
      return '헤더 컴포넌트';
    case PresetList.MEDIA.componentGroup:
      return '인터렉티브 미디어 컴포넌트';
    case PresetList.MEDIA_VIEWER.componentGroup:
      return '미디어 뷰어 컴포넌트';
    case PresetList.TEXT.componentGroup:
      return '텍스트 컴포넌트';
    case PresetList.CTA.componentGroup:
      return '버튼 컴포넌트';
    case PresetList.DEAL.componentGroup:
      return '상품전시 컴포넌트';
    case PresetList.BLANK.componentGroup:
      return '여백 컴포넌트';
    case PresetList.IMAGE_VIEWER.componentGroup:
      return '이미지 컴포넌트';
    case PresetList.LIVE.componentGroup:
      return '라이브 컴포넌트';
    case PresetList.REPLY.componentGroup:
      return '댓글 컴포넌트';
    case PresetList.FOOTER.componentGroup:
      return '푸터 컴포넌트';
    default:
      return '';
  }
};

/**
 * 필수 컴포넌트 조회
 * @param type
 * @returns
 */
export const getRequiredComponent = (type: CONTENT_TYPE): ManageListModel[] => {
  const manageData = ManageList[type];
  return manageData.filter((list: ManageListModel) => list.required);
};

/**
 * 컴포넌트 아이디를 관리하기 위한 카운팅 데이터
 * @param manageData
 * @returns
 */
export const getInitCountId = (contentType: CONTENT_TYPE): CountIdModel => {
  const manageData = ManageList[contentType];
  const groupCount = new Map<PresetGroup, number>();
  manageData.forEach((manageGroup) => {
    groupCount.set(manageGroup.componentGroup, 0);
  });
  return {
    countId: 0,
    groupCount,
  };
};

/**
 * 등록할 수 있는 컴포넌트 개수
 * @param contentType
 */
export const getMaxNumForComponent = (contentType: CONTENT_TYPE): number | undefined => {
  const manageData = ManageList[contentType];
  const unlimited = manageData.find((data) => !data.maxCount);
  // 관리데이터에서 컴포넌트 최대 등록 가능 개수가 하나라도 미지정인 경우,  전체 컴포넌트 등록 개수는 무제한이다.
  if (unlimited) {
    return undefined;
  }

  return manageData.reduce((prev, curr) => prev + curr.maxCount, 0);
};

/**
 * 타겟 포지션을 기준으로 삽입될 index 를 조회한다.
 * top 인 경우, 배열내 마지막 top 위치 다음으로 삽입
 * bottom 인 경우, 배열내 최초 bottom 이전 위치로 삽입
 * @param arr
 * @param position
 * @returns
 */
export const getIndexForPosition = (arr: any[], position: COMPONENT_POSITION) => {
  let idx = 0;
  if (position === COMPONENT_POSITION.TOP) {
    const topIndex = findLastIndex(arr, (item) => item.position === COMPONENT_POSITION.TOP);
    idx = topIndex < 0 ? 0 : topIndex;
  } else {
    const bottomIndex = arr.findIndex((item) => item.position === COMPONENT_POSITION.BOTTOM);
    idx = bottomIndex < 0 ? arr.length : bottomIndex;
  }

  return idx;
};

/**
 * 타겟 포지션을 기준으로 삽입될 index 를 조회한다.
 * top 인 경우, 배열내 마지막 top 위치 다음으로 삽입
 * bottom 인 경우, 하단 위치로 삽입. bottom이 여러개인 경우 managerList에 정의된 순서로 정렬 된다.
 * @param arr
 * @param position
 * @param menu
 * @param manage
 * @returns
 */
export const getIndexForPositionComponent = (
  arr: any[],
  position: COMPONENT_POSITION,
  menu: MenuItemModel,
  manage: ManageListModel[],
) => {
  let idx = 0;
  if (position === COMPONENT_POSITION.TOP) {
    const topIndex = findLastIndex(arr, (item) => item.position === COMPONENT_POSITION.TOP);
    idx = topIndex < 0 ? 0 : topIndex;
  } else if (position === COMPONENT_POSITION.BOTTOM) {
    // 컴포넌트 관리 데이터에서 position bottom 인 그룹 추출
    const bottomPositionList = manage.filter((item) => item.position === COMPONENT_POSITION.BOTTOM);
    const targetGroupIdx = bottomPositionList.findIndex((item) => item.componentGroup === menu.componentGroup);
    const bottomNextGroupList = bottomPositionList
      .slice(targetGroupIdx + 1, bottomPositionList.length)
      .map((item) => item.componentGroup);
    const bottomIndex = arr.findIndex((item) => bottomNextGroupList.includes(item.componentGroup));
    idx = bottomIndex < 0 ? arr.length : bottomIndex;
  } else {
    // 최초 bottom 인덱스 바로 앞으로 지정.
    const bottomIndex = arr.findIndex((item) => item.position === COMPONENT_POSITION.BOTTOM);
    idx = bottomIndex < 0 ? arr.length : bottomIndex;
  }
  return idx;
};

/**
 * 업로드가 필요한 미디어(이미지, 비디오) 데이터 조회
 * @param contentsFormValues
 * @returns
 */
export const getMediaFileList = (contentsFormValues: ContentFormModel): MediaFileListModel[] => {
  const mediaFileList = [];
  for (let key in contentsFormValues) {
    const formValue = contentsFormValues[key];
    if (formValue) {
      const { id, componentType } = formValue;
      const mediaFormValue = formValue?.mediaUploader; // 각 컴포넌트 별 미디어 데이터 set
      if (mediaFormValue) {
        for (let item in mediaFormValue) {
          const media = mediaFormValue[item];
          if (Array.isArray(media)) {
            media.forEach((m, index) => {
              if (m.file) {
                const target: MediaFileListModel = {
                  id,
                  componentType,
                  uploaderKey: `${key}.${FORM_KEY.MEDIA_UPLOADER}.${item}.${index}`,
                  key: `${item}`,
                  index: index,
                  file: m.file,
                };
                mediaFileList.push(target);
              }
            });
          } else {
            // 파일이 새로 등록되었다면, 업로드 리스트로 추가한다.
            if (media?.file) {
              mediaFileList.push({
                id,
                componentType,
                uploaderKey: `${key}.${FORM_KEY.MEDIA_UPLOADER}.${item}`,
                key: `${item}`,
                index: null,
                file: media.file,
              });
            }
          }
        }
      }
    }
  }

  return mediaFileList;
};

/**
 * 미디어 노출 비율 타입 조회
 */
export const getMediaViewRatioType = (ratioInfo: MEDIA_VIEW_RATIO | null): MEDIA_VIEW_RATIO_TYPE => {
  if (!ratioInfo) {
    return MEDIA_VIEW_RATIO_TYPE.ETC;
  }

  if (isEqual(ratioInfo, MEDIA_VIEW_RATIO.SQUARE)) {
    return MEDIA_VIEW_RATIO_TYPE.SQUARE;
  } else if (isEqual(ratioInfo, MEDIA_VIEW_RATIO.RECTANGLE_VERTICAL)) {
    return MEDIA_VIEW_RATIO_TYPE.RECTANGLE_VERTICAL;
  } else if (isEqual(ratioInfo, MEDIA_VIEW_RATIO.RECTANGLE_HORIZONTAL)) {
    return MEDIA_VIEW_RATIO_TYPE.RECTANGLE_HORIZONTAL;
  } else if (isEqual(ratioInfo, MEDIA_VIEW_RATIO.RECTANGLE_16BY9)) {
    return MEDIA_VIEW_RATIO_TYPE.RECTANGLE_16BY9;
  } else {
    return MEDIA_VIEW_RATIO_TYPE.ETC;
  }
};

/**
 * 미디어 노출 비율 조회
 */
export const getMediaViewRatio = (ratioType: MEDIA_VIEW_RATIO_TYPE): MEDIA_VIEW_RATIO | null => {
  if (!ratioType) {
    return null;
  }

  if (isEqual(ratioType, MEDIA_VIEW_RATIO_TYPE.SQUARE)) {
    return MEDIA_VIEW_RATIO.SQUARE;
  } else if (isEqual(ratioType, MEDIA_VIEW_RATIO_TYPE.RECTANGLE_VERTICAL)) {
    return MEDIA_VIEW_RATIO.RECTANGLE_VERTICAL;
  } else if (isEqual(ratioType, MEDIA_VIEW_RATIO_TYPE.RECTANGLE_HORIZONTAL)) {
    return MEDIA_VIEW_RATIO.RECTANGLE_HORIZONTAL;
  } else if (isEqual(ratioType, MEDIA_VIEW_RATIO_TYPE.RECTANGLE_16BY9)) {
    return MEDIA_VIEW_RATIO.RECTANGLE_16BY9;
  } else {
    return null;
  }
};

// 3자리 수마다 . 을 찍어줌
export function formatToAmount(value: number): string {
  return value.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
}

/**
 * 메뉴 이름 조회
 */
export const getMenuItemName = (menuItem: MenuItemModel) => {
  return `${getComponentGroupName(menuItem.componentGroup)} ${
    menuItem.maxCount !== 1 ? `(${menuItem.groupId + 1})` : ''
  }`;
};

/**
 * 미디어 파일 타입 조회
 * type값이 누락될 경우 extension으로 미디어타입 체크
 * @param media
 * @returns
 */
export const getMediaFileType = (media: FormContentMediaModel) => {
  return media.type ? media.type : getIsImageType(media.extension) ? UploadFileType.IMAGE : UploadFileType.VIDEO;
};
