export interface DetailNoticeTmplSchema {
  title: string;
  contents: string;
}

export interface DetailNoticeInfoSchema {
  id: number;
  name: string;
  details: DetailNoticeTmplSchema[];
}

export interface DetailDetailNoticeSchema {
  informationNotices: DetailNoticeInfoSchema[];
}
