export const searchTypeOptions = [
  {
    label: '이메일',
    value: 'EMAIL',
  },
  {
    label: '닉네임',
    value: 'NICKNAME',
  },
  {
    label: '이름',
    value: 'NAME',
  },
  {
    label: '연락처',
    value: 'PHONE',
  },
];

export const statusOptions = [
  {
    label: '활성',
    value: 'ACTIVE',
  },
  {
    label: '탈퇴',
    value: 'DROP_OUT',
  },
];

export const DEFAULT_PAGE_SIZE = 10;
export const DEFAULT_PAGE_OFFSET = 1;
export const EXCEL_DOWNLOAD_SIZE = 1000;
export const EXCEL_HEADER_LIST = [
  '회원ID',
  '이메일',
  '닉네임',
  '이름',
  '연락처',
  '휴대폰 인증여부',
  '성인 인증여부',
  '소셜가입',
  '상태',
  '가입일',
  '최종방문일',
];

export const QueryKey = {
  BlackListLog: 'member/blackList/log',
} as const;
