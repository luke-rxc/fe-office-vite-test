import { GoodsKind } from '@constants/goods';
import { StateModel } from '../../models';
import { OptRegisterKinds, CommonDetailMessage } from '../../constants';

interface SubmitOptionValidatorReturnProps {
  isSuccess: boolean;
  message: string | null;
}

export const useSubmitCommonService = () => {
  const submitOptionValidator = (values: StateModel): SubmitOptionValidatorReturnProps => {
    const { optionLists, optionRegister } = values;

    if (
      optionRegister === OptRegisterKinds.PROGRESS &&
      optionLists.length <= 1 &&
      values?.goodsKind === GoodsKind.REAL
    ) {
      return {
        isSuccess: false,
        message: CommonDetailMessage.VALID_SUBMIT.INVALID_OPTION_TYPE,
      };
    }

    // 티켓 validation - 전체 Option 중복체크를 하기 위해, 기본 validation(Yup) 마무리 후 진행
    /* if (goodsKind === GoodsKind.TICKET_AGENT && uniqBy(optionLists, 'ticketGoodsId').length !== optionLists.length) {
      return {
        isSuccess: false,
        message: CommonDetailMessage.VALID_SUBMIT.DUPLICATE_TICKET_OPTION,
      };
    } */

    return {
      isSuccess: true,
      message: null,
    };
  };

  return {
    submitOptionValidator,
  };
};
