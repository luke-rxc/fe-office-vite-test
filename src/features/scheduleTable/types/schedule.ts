/**
 * 편성표 검색 params
 */
export interface ScheduleSearchParams {
  endDate: number;
  startDate: number;
}

/**
 * 편성표 수정 form
 */
export interface ScheduleModifyForm {
  title: string;
  subtitle: string;
  bgColor: string;
  // 랜딩 설정 (랜딩 유형)
  landingType: string;
  // 콘텐츠ID (랜딩 스토링 아이디)
  landingStoryId: string;
  // 혜택
  benefits: string;
  // 부가 정보 설정 (배너 유형)
  bannerType: string;
  scheduling: string;
  // 백그라운드 이미지 아이디
  bgImageId: string;
  // 크로마키 이미지 아이디
  chromakeyImageId: string;
  // 배너 버튼명
  bannerButtonText: string;

  bannerImageId: string;
  // 배너 image id (첫번째)
  bannerImage1Id: string;
  // 배너 image id (두번째)
  bannerImage2Id: string;
  // 배너 image id (세번째)
  bannerImage3Id: string;
  // 배너 스킴
  bannerScheme: string;
}

/**
 * option model
 */
export interface OptionModel {
  value: string;
  label: string;
}

/**
 * 편성표 수정 params
 */
export interface ScheduleModifyParams {
  bannerButtonText: string;
  bannerImage1Id: number;
  bannerImage2Id: number;
  bannerImage3Id: number;
  bannerScheme: string;
  bannerType: string;
  benefits: string;
  bgColor: string;
  bgImageId: number;
  chromakeyImageId: number;
  id: number;
  landingStoryId: number;
  landingType: string;
  scheduling: boolean;
  subtitle: string;
  title: string;
}
