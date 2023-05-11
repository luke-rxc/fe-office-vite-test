import {
  BannerLandingTypeOption,
  FormMainBannerLadingTypeOptions,
  MainBannerLandingTypeLabel,
  MainBannerStatusLabel,
} from '../constants';
import {
  MainBannerDetailSchema,
  MainBannerLandingType,
  MainBannerSchema,
  UnpublishedMainBannerResponse,
} from '../schemas';
import { MainBannerDetailFormFields, PostBannerMutationParams } from '../types';
import { fillEmptyStringIfNumber } from '../utils';

export interface MainBannerModel extends MainBannerSchema {
  processed: {
    /** 타입 전체를 표기한 라벨 ex) 콘텐츠(스토리) */
    landingTypeLabel: string;
    statusLabel: string;
    thumbnail: MainBannerThumbnailModel;
  };
}

export interface MainBannerThumbnailModel {
  path: string | null;
  label: string;
}

const getBannerThumbnail = ({ media }: MainBannerSchema): MainBannerThumbnailModel => {
  if (media.fileType === 'IMAGE') {
    return { path: media.path, label: '이미지' };
  }

  if (media.fileType === 'VIDEO') {
    return { path: media?.thumbnailImage?.path ?? null, label: '동영상' };
  }

  return { path: null, label: '기타' };
};

export const toMainBannerModel = (item: MainBannerSchema): MainBannerModel => {
  return {
    ...item,
    processed: {
      landingTypeLabel: MainBannerLandingTypeLabel[item.landingInfo.type],
      statusLabel: MainBannerStatusLabel[item.status],
      thumbnail: getBannerThumbnail(item),
    },
  };
};

export const toMainBannerModels = (items: MainBannerSchema[]): MainBannerModel[] => {
  return items.map(toMainBannerModel);
};

export interface UnpublishedMainBannerModel extends UnpublishedMainBannerResponse {
  content: UnpublishedMainBannerResponse['content'] & MainBannerModel[];
}

export const toUnpublishedMainBannerModel = (item: UnpublishedMainBannerResponse): UnpublishedMainBannerModel => {
  const processed = item.content.map(toMainBannerModel);

  return {
    ...item,
    content: processed,
  };
};

export interface MainBannerDetailModel extends MainBannerDetailSchema {
  processed: {
    form: MainBannerDetailFormFields;
  };
}

export const toMainBannerDetailModel = (item: MainBannerDetailSchema): MainBannerDetailModel => {
  const findOptionByValue = (options: BannerLandingTypeOption[], type: string) => {
    return options.find(({ value }) => value === type);
  };

  const getLandingType = () => {
    const landingType = item.landingInfo.type;

    if (landingType === 'DISCOVER_KEYWORD') {
      return { main: findOptionByValue(FormMainBannerLadingTypeOptions.main, landingType), sub: null };
    }

    const [main, sub] = landingType.split('_');
    return {
      main: findOptionByValue(FormMainBannerLadingTypeOptions.main, main),
      sub: findOptionByValue(FormMainBannerLadingTypeOptions.sub, sub) ?? null,
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

export const toBannerLandingType = (landingType: MainBannerDetailFormFields['landingType']): MainBannerLandingType => {
  const dividedTypes = ['CONTENTS'];

  if (dividedTypes.includes(landingType.main.value)) {
    return `${landingType.main.value}_${landingType.sub.value}` as MainBannerLandingType;
  }

  return landingType.main.value as MainBannerLandingType;
};

export const toPostBannerRequestModel = (item: MainBannerDetailFormFields): PostBannerMutationParams => {
  const { videoRepeatPoint, ...rest } = item;

  return {
    ...rest,
    landingType: toBannerLandingType(item.landingType),
    mediaId: Number(item.mediaId),
    publishStartDate: Number(item.publishStartDate),
    publishEndDate: Number(item.publishEndDate),
    referenceId: Number(item.landingId),
    sortNum: Number(item.sortNum),
    ...(videoRepeatPoint && { videoRepeatPoint: Number(videoRepeatPoint) }),
  };
};
