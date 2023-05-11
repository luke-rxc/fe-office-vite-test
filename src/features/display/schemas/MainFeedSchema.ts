import { PaginationResponse } from '@schemas/PaginationSchema';
import { UploadFileSchema } from '@schemas/UploadSchema';
import { UploadFileType } from '@services/useFileUploader';

export interface MainFeedSchema {
  id: number;
  media: MainFeedMediaSchema;
  publishStartDate: number;
  publishEndDate: number;
  landingInfo: MainFeedLandingInfoSchema;
  sortNum: number;
  status: MainFeedStatus;
  title: string;
}

export type MainFeedResponse = MainFeedSchema[];

export interface MainFeedDetailSchema extends Omit<MainFeedSchema, 'status'> {
  description: string;
  videoRepeatPoint: number;
}

export interface MainFeedImageSchema extends UploadFileSchema {}

export interface MainFeedMediaSchema extends MainFeedImageSchema {
  fileType: UploadFileType;
  fileSize: string;
  originalFileName: string;
  thumbnailImage: MainFeedImageSchema;
}

export interface MainFeedLandingInfoSchema {
  name: string;
  referenceId: number;
  showRoomName: string;
  type: MainFeedLandingType;
}

export type MainFeedLandingType =
  | 'CONTENTS_STORY'
  | 'CONTENTS_TEASER'
  | 'DISCOVER_KEYWORD'
  | 'EVENT'
  | 'GOODS'
  | 'LIVE'
  | 'NOTICE'
  | 'SHOWROOM';

export type MainFeedStatus = 'BEFORE_OPEN' | 'FINISHED' | 'OPEN' | 'PUBLISH_ABLE' | 'PUBLISH_UNABLE' | 'STOP';

export interface UnpublishedMainFeedResponse extends PaginationResponse<MainFeedSchema> {
  empty: boolean;
  number: number;
  pageable: {
    sort: {
      sorted: boolean;
      unsorted: boolean;
      empty: boolean;
    };
    pageNumber: number;
    pageSize: number;
    offset: number;
    paged: boolean;
    unpaged: boolean;
  };
  sort: {
    sorted: boolean;
    unsorted: boolean;
    empty: boolean;
  };
}

export interface FeedLandingInfoSchema {
  name: string;
  referenceId: number;
  showRoomName: string;
  type: MainFeedLandingType;
}
