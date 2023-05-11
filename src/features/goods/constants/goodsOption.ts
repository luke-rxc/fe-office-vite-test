// 상품등록 모드
export const OptRegisterKinds = {
  PROGRESS: 'progress',
  STOP: 'stop',
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type OptRegisterKinds = ValueOf<typeof OptRegisterKinds>;

export const OptRegisterModeOptions = [
  { label: '사용함', value: OptRegisterKinds.PROGRESS },
  { label: '사용안함', value: OptRegisterKinds.STOP },
];

// 옵션 최대 입력 개수
export const OptionsLimit = 3;

// 옵션 기본 Table 노출할 수 있는 최대 개수
// 50개가 넘으면 TableLight 를 사용하며, 50개 기준으로 OptListMore 를 계속 렌더링 진행
export const OptListLimit = 50;

// 옵션 등록가능 최대 개수
export const OptListRegisterLimit = 3000;

// 옵션 테이블 라이트 버전의 추가 로드 갯수
export const OptListMore = 50;

// 테이블 Max Height Info
export const OptTableMaxHeightInfo = {
  // 옵션리스트 개수가 LIMIT 초과일때 Max Height 설정
  LIMIT: 9,
  // Height 설정
  HEIGHT: 880,
};

// 옵션 개수 기본 Value
export const OptionBase = {
  title: '',
  value: '',
};

export const OptionTableType = {
  NORMAL: 'NORMAL',
  LIMIT: 'LIMIT',
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type OptionTableType = typeof OptionTableType[keyof typeof OptionTableType];
