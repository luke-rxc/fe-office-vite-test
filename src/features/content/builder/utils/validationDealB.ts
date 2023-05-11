import * as Yup from 'yup';
import { DEAL_B_DESC_MAX_NUM, DEAL_B_SUBTITLE_MAX_NUM, DEAL_B_TITLE_MAX_NUM } from '../constants';
/**
 * 상품 딜 B 컴포넌트
 */
export const DealBValidationSchema = Yup.object({
  contents: Yup.object().shape({
    useText: Yup.boolean(),
    align: Yup.string(),
    title: Yup.object().shape({
      text: Yup.string().max(DEAL_B_TITLE_MAX_NUM, `최대 ${DEAL_B_TITLE_MAX_NUM}자 이내 입력해 주세요.`),
      bold: Yup.boolean(),
      color: Yup.string(),
    }),
    subTitle: Yup.object().shape({
      text: Yup.string().max(DEAL_B_SUBTITLE_MAX_NUM, `최대 ${DEAL_B_SUBTITLE_MAX_NUM}자 이내 입력해 주세요.`),
      bold: Yup.boolean(),
      color: Yup.string(),
    }),
    description: Yup.object().shape({
      text: Yup.string().max(DEAL_B_DESC_MAX_NUM, `최대 ${DEAL_B_DESC_MAX_NUM}자 이내 입력해 주세요.`),
      bold: Yup.boolean(),
      color: Yup.string(),
    }),
    backgroundType: Yup.string(),
    backgroundColor: Yup.string(),
    backgroundMedia: Yup.object().shape({
      path: Yup.string(),
      id: Yup.number().nullable(),
      type: Yup.string().nullable(),
      width: Yup.number(),
      height: Yup.number(),
      fileSize: Yup.number(),
      extension: Yup.string(),
      posterImage: Yup.string(),
    }),
    isOverlay: Yup.boolean(),
    goodsColor: Yup.string(),
    isGoodsDefaultColor: Yup.string(),
  }),
  goodsList: Yup.array().required().min(1, '상품을 등록해 주세요'),
});
