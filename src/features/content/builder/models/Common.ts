import {
  ContentSchema,
  ShowroomSchema,
  GoodsSchema,
  LiveSchema,
  ComponentSchema,
  ContentRequestParams,
  ComponentReqSchema,
} from '../schemas';
import { CONTENT_STATUS, CONTENT_TYPE, COMPONENT_POSITION, PresetGroup, Preset } from '../constants';
import { ContentFormModel, ContentModel, DisplayContentModel, getSubmitContent } from './Content';

/**
 * 프리셋 생성 타입 정보
 */
export type CreatePresetModel = {
  componentGroup: PresetGroup; // 컴포넌트의 그룹정보
  componentType: Preset; // 컴포넌트 타입 정보
};

/**
 * 컴포넌트 관리 리스트
 */
export type ManageListModel = PresetListModel & {
  maxCount: number; // 컴포넌트 그룹단위로 최대 등록 가능 개수
  position: COMPONENT_POSITION; // 컴포넌트 고정 위치
  required: boolean; // 컴포넌트 필수 여부
};

export type PresetListModel = {
  componentGroup: PresetGroup; // 컴포넌트 그룹핑 정보
  components: PresetItemModel[];
};

export type PresetItemModel = {
  componentType: Preset; // 그룹핑 내 하위 컴포넌트 리스트
  description: string;
  guideImage: string;
  maxCount?: number | null; // 컴포넌트 허용 개수
  addCount?: number; // 추가된 컴포넌트 개수
};

/**
 * id 관리를 위한 카운트 정보
 */
export type CountIdModel = {
  countId: number; // 모든 컴포넌트에 대해, 컴포넌트 생성시마다 카운팅 하여 ID를 고유값 부과
  groupCount: Map<PresetGroup, number>; // 컴포넌트 그룹별로, 컴포넌트 생성시마다 카운팅 하여 넘버 체크
};

/**
 * 라이브 모델
 */
export type LiveModel = Omit<LiveSchema, 'sortNumber' | 'goodsCount'>;

/**
 * 상품 모델
 */
export type GoodsModel = Omit<GoodsSchema, 'sortNumber'>;

/**
 *  컨텐츠 관리
 */
export type ContentManageModel = {
  contentDefault: ContentDefaultModel; // 기본정보
  showroom: ContentShowroomModel; // 쇼룸 정보
  componentList: ContentComponentModel[]; // 컴포넌트 리스트 정보
};

/**
 * 컨텐츠 기본 정보
 */
export type ContentDefaultModel = {
  contentName: string; // 컨텐츠명
  type: CONTENT_TYPE; // 컨텐츠 종류
  publicEndDate: number; // 공개 시작일
  publicStartDate: number; // 공개 종료일
  status: CONTENT_STATUS; // 공개상태
};

/**
 * 컨텐츠 쇼룸 정보
 */
export type ContentShowroomModel = {
  id: number;
  name: string; // 쇼룸 네임
  brandId: number; // 브랜드 id
  brandName: string; // 브랜드명
  brandImage: string; // 브랜드 이미지
};

/**
 * 컨텐츠 컴포넌트 리스트
 */
export type ContentComponentModel = {
  componentGroup: PresetGroup; // 그룹 정보
  componentType: Preset; // 컴포넌트 타입 정보
  goodsList?: GoodsModel[]; // 상품 정보
  liveList?: LiveModel[]; // 라이브 정보
  contents?: DisplayContentModel; //  프론트화면 구성 정보
};

/**
 * 컨텐츠 전체 모델 매핑
 * @param data
 * @returns
 */
export const toContentModel = (data: ContentSchema): ContentManageModel => {
  const { contentName, type, publicStartDate, publicEndDate, status, showroom, componentList } = data;
  return {
    contentDefault: {
      contentName: contentName,
      type,
      publicStartDate,
      publicEndDate,
      status,
    },
    showroom: toShowroom(showroom),
    componentList: toComponentList(componentList),
  };
};

/**
 * 컨텐츠 쇼룸 모델 매핑
 * @param showroom
 * @returns
 */
const toShowroom = (showroom: ShowroomSchema): ContentShowroomModel => {
  const { id, brandId, brandName, coverImage, name } = showroom;
  return {
    id,
    brandId,
    brandName,
    brandImage: coverImage?.path,
    name,
  };
};

/**
 * 컨텐츠 컴포넌트 모델 매핑
 * @param list
 * @returns
 */
const toComponentList = (list: ComponentSchema[]): ContentComponentModel[] => {
  return list.map((comp: ComponentSchema) => {
    const { componentGroup, componentType, contents, goodsList, liveList } = comp;
    return {
      componentGroup: componentGroup as PresetGroup,
      componentType: componentType as Preset,
      contents: toContents(contents),
      goodsList: toGoods(goodsList),
      liveList: toLive(liveList),
    };
  });
};

/**
 * 컨텐츠 contents(디스플레이 정보) 매핑
 * @param contents
 * @returns
 */
const toContents = (contents: string): DisplayContentModel => {
  return JSON.parse(contents);
};

const toGoods = (goodsList: GoodsSchema[]): GoodsModel[] => {
  return goodsList.map((goods: GoodsSchema) => {
    const {
      brandName,
      consumerPrice,
      price,
      displayStartDate,
      goodsId,
      goodsName,
      providerName,
      salesStartDate,
      salesEndDate,
      salesStatus,
      goodsType,
      goodsImage,
    } = goods;
    return {
      brandName,
      consumerPrice,
      price,
      displayStartDate,
      goodsId,
      goodsName,
      providerName,
      salesStartDate,
      salesEndDate,
      salesStatus,
      goodsType,
      goodsImage,
    };
  });
};

/**
 * 라이브 모델 매핑
 * @param liveList
 * @returns
 */
const toLive = (liveList: LiveSchema[]): LiveModel[] => {
  return liveList.map((live: LiveSchema) => {
    const {
      contentsType,
      goodsCount,
      goodsName,
      id,
      liveStartDate,
      liveStatus,
      openStatus,
      primaryImage,
      showRoomName,
      title,
    } = live;
    return {
      contentsType,
      goodsCount,
      goodsName,
      id,
      liveStartDate,
      liveStatus,
      openStatus,
      primaryImage,
      showRoomName,
      title,
    };
  });
};

/**
 * submit request 파라미터 매핑
 * @param formValue
 */
export const toComponentReqParam = (
  formValues: ContentFormModel,
  contentData: Map<number, ContentModel>,
): ContentRequestParams => {
  const reqComponent = new Array(Object.keys(formValues).length);
  for (const [key, value] of Object.entries(formValues)) {
    const { componentGroup, componentType, sortNum } = contentData.get(+key);
    const formValue = value as ContentFormModel;
    const newContent: ComponentReqSchema = {
      componentGroup,
      componentType,
      contents: JSON.stringify(getSubmitContent(formValue)),
      goodsList: formValue.goodsList,
      liveList: formValue.liveList,
      sortNumber: sortNum,
      hide: false,
    };
    reqComponent[sortNum] = newContent;
  }

  return {
    componentList: reqComponent,
  };
};
