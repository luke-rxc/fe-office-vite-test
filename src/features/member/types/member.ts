export interface MemberSearchFormField {
  searchType: string;
  keyword: string;
  userStatus: string;
  joinFromDate: string;
  joinToDate: string;
  loginFromDate: string;
  loginToDate: string;
  isBlack: boolean;
}

export interface MemberListQueryState extends Record<string, string>, Omit<MemberSearchFormField, 'isBlack'> {
  size: string;
  page: string;
  isBlack: string;
}

export interface MemberDetailQueryState extends Record<string, string> {
  mileagePage: string;
  mileageSize: string;
  couponPage: string;
  couponSize: string;
  orderPage: string;
  orderSize: string;
  nickNamePage: string;
  nickNameSize: string;
}
