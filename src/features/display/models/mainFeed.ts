import {
  FeedLandingTypeOption,
  FormMainFeedLadingTypeOptions,
  MainFeedLandingTypeFirstCategoryLabel,
  MainFeedLandingTypeLabel,
  MainFeedStatusLabel,
} from '../constants';
import { MainFeedDetailSchema, MainFeedLandingType, MainFeedSchema, UnpublishedMainFeedResponse } from '../schemas';
import { MainFeedDetailFormFields, PostFeedMutationParams } from '../types';
import { fillEmptyStringIfNumber } from '../utils';

export interface MainFeedModel extends MainFeedSchema {
  processed: {
    /** 타입 전체를 표기한 라벨 ex) 콘텐츠(스토리) */
    landingTypeLabel: string;
    /** 대분류 타입까지만 표기한 라벨 ex) 콘텐츠 */
    landingTypeMainLabel: string;
    statusLabel: string;
    thumbnail: MainFeedThumbnailModel;
  };
}

export interface MainFeedThumbnailModel {
  path: string | null;
  label: string;
}

export const getFeedThumbnail = ({ media }: MainFeedSchema): MainFeedThumbnailModel => {
  if (media.fileType === 'IMAGE') {
    return { path: media.path, label: '이미지' };
  }

  if (media.fileType === 'VIDEO') {
    return { path: media?.thumbnailImage?.path ?? null, label: '동영상' };
  }

  return { path: null, label: '기타' };
};

export const toMainFeedModel = (item: MainFeedSchema): MainFeedModel => {
  return {
    ...item,
    processed: {
      landingTypeLabel: MainFeedLandingTypeLabel[item.landingInfo.type],
      landingTypeMainLabel: MainFeedLandingTypeFirstCategoryLabel[item.landingInfo.type],
      statusLabel: MainFeedStatusLabel[item.status],
      thumbnail: getFeedThumbnail(item),
    },
  };
};

export const toMainFeedModels = (items: MainFeedSchema[]): MainFeedModel[] => {
  return items.map(toMainFeedModel);
};

export interface UnpublishedMainFeedModel extends UnpublishedMainFeedResponse {
  content: UnpublishedMainFeedResponse['content'] & MainFeedModel[];
}

export const toUnpublishedMainFeedModel = (item: UnpublishedMainFeedResponse): UnpublishedMainFeedModel => {
  const processed = item.content.map(toMainFeedModel);

  return {
    ...item,
    content: processed,
  };
};

export interface MainFeedDetailModel extends MainFeedDetailSchema {
  processed: {
    form: MainFeedDetailFormFields;
  };
}

export const toMainFeedDetailModel = (item: MainFeedDetailSchema): MainFeedDetailModel => {
  const findOptionByValue = (options: FeedLandingTypeOption[], type: string) => {
    return options.find(({ value }) => value === type);
  };

  const getLandingType = () => {
    const landingType = item.landingInfo.type;

    if (landingType === 'DISCOVER_KEYWORD') {
      return { main: findOptionByValue(FormMainFeedLadingTypeOptions.main, landingType), sub: null };
    }

    const [main, sub] = landingType.split('_');
    return {
      main: findOptionByValue(FormMainFeedLadingTypeOptions.main, main),
      sub: findOptionByValue(FormMainFeedLadingTypeOptions.sub, sub) ?? null,
    };
  };

  return {
    ...item,
    processed: {
      form: {
        landingType: getLandingType(),
        landingId: fillEmptyStringIfNumber(item.landingInfo.referenceId),
        title: item.title,
        description: item.description,
        publishStartDate: fillEmptyStringIfNumber(item.publishStartDate),
        publishEndDate: fillEmptyStringIfNumber(item.publishEndDate),
        sortNum: fillEmptyStringIfNumber(item.sortNum),
        mediaId: fillEmptyStringIfNumber(item.media.id),
        videoRepeatPoint: fillEmptyStringIfNumber(item.videoRepeatPoint),
      },
    },
  };
};

export const toFeedLandingType = (landingType: MainFeedDetailFormFields['landingType']): MainFeedLandingType => {
  if (landingType.main.value === 'CONTENTS') {
    return `${landingType.main.value}_${landingType.sub.value}` as MainFeedLandingType;
  }

  return landingType.main.value as MainFeedLandingType;
};

export const toPostFeedRequestModel = (item: MainFeedDetailFormFields): PostFeedMutationParams => {
  const { videoRepeatPoint, ...rest } = item;

  return {
    ...rest,
    landingType: toFeedLandingType(item.landingType),
    mediaId: Number(item.mediaId),
    publishStartDate: Number(item.publishStartDate),
    publishEndDate: Number(item.publishEndDate),
    referenceId: Number(item.landingId),
    sortNum: Number(item.sortNum),
    ...(videoRepeatPoint && { videoRepeatPoint: Number(videoRepeatPoint) }),
  };
};
