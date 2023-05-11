import mapValues from 'lodash/mapValues';
import * as Yup from 'yup';
import { Preset } from '../constants/presetList';
import { BlankValidationSchema } from './validationBlank';
import { CTAValidationSchema } from './validationCTA';
import { DealAValidationSchema } from './validationDealA';
import { DealBValidationSchema } from './validationDealB';
import { FooterValidationSchema } from './validationFooter';
import { HeaderValidationSchema } from './validationHeader';
import { ImageViewerValidationSchema } from './validationImageViewer';
import { LiveValidationSchema } from './validationLive';
import { LiveMultipleValidationSchema } from './validationLiveMultiple';
import { MediaAValidationSchema } from './validationMediaA';
import { MediaBValidationSchema } from './validationMediaB';
import { MediaViewerAValidationSchema } from './validationMediaViewerA';
import { MediaViewerBValidationSchema } from './validationMediaViewerB';
import { ReplyValidationSchema } from './validationReply';
import { TextValidationSchema } from './validationText';

export const validationSchema = Yup.lazy((obj) => {
  return Yup.object(
    mapValues(obj, (value, key) => {
      if (!value) {
        return Yup.mixed().transform(() => 0);
      }
      switch (value.componentType) {
        case Preset.BLANK:
          return BlankValidationSchema.default(undefined);
        case Preset.CTA:
          return CTAValidationSchema.default(undefined);
        case Preset.DEAL_A:
          return DealAValidationSchema.default(undefined);
        case Preset.DEAL_B:
          return DealBValidationSchema.default(undefined);
        case Preset.FOOTER:
          return FooterValidationSchema.default(undefined);
        case Preset.HEADER:
          return HeaderValidationSchema.default(undefined);
        case Preset.IMAGE_VIEWER:
          return ImageViewerValidationSchema.default(undefined);
        case Preset.LIVE:
          return LiveValidationSchema.default(undefined);
        case Preset.LIVE_MULTIPLE:
          return LiveMultipleValidationSchema.default(undefined);
        case Preset.MEDIA_A:
          return MediaAValidationSchema.default(undefined);
        case Preset.MEDIA_B:
          return MediaBValidationSchema.default(undefined);
        case Preset.MEDIA_VIEWER_A:
          return MediaViewerAValidationSchema.default(undefined);
        case Preset.MEDIA_VIEWER_B:
          return MediaViewerBValidationSchema.default(undefined);
        case Preset.REPLY:
          return ReplyValidationSchema.default(undefined);
        case Preset.TEXT:
          return TextValidationSchema.default(undefined);
        default:
          return Yup.mixed().transform(() => 0);
      }
    }),
  );
});
