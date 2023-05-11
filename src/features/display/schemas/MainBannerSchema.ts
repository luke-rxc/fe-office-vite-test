import { PaginationResponse } from '@schemas/PaginationSchema';
import { UploadFileSchema } from '@schemas/UploadSchema';
import { UploadFileType } from '@services/useFileUploader';

export interface MainBannerSchema {
  id: number;
  media: MainBannerMediaSchema;
  publishStartDate: number;
  publishEndDate: number;
  landingInfo: MainBannerLandingInfoSchema;
  sortNum: number;
  status: MainBannerStatus;
  title: string;
}

export type MainBannerResponse = MainBannerSchema[];

export interface MainBannerDetailSchema extends Omit<MainBannerSchema, 'status'> {
  description: string;
  videoRepeatPoint: number;
}

export interface MainBannerImageSchema extends UploadFileSchema {}

export interface MainBannerMediaSchema extends MainBannerImageSchema {
  fileType: UploadFileType;
  fileSize: string;
  originalFileName: string;
  thumbnailImage: MainBannerImageSchema;
}

export interface MainBannerLandingInfoSchema {
  name: string;
  referenceId: number;
  showRoomName: string;
  type: MainBannerLandingType;
}

export type MainBannerLandingType =
  | 'CONTENTS_STORY'
  | 'CONTENTS_TEASER'
  | 'DISCOVER_KEYWORD'
  | 'EVENT'
  | 'GOODS'
  | 'LIVE'
  | 'NOTICE'
  | 'SHOWROOM';

export type MainBannerStatus = 'BEFORE_OPEN' | 'FINISHED' | 'OPEN' | 'PUBLISH_ABLE' | 'PUBLISH_UNABLE' | 'STOP';

export interface UnpublishedMainBannerResponse extends PaginationResponse<MainBannerSchema> {
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

export interface BannerLandingInfoSchema {
  name: string;
  referenceId: number;
  showRoomName: string;
  type: MainBannerLandingType;
}
