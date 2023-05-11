import { useEffect, useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { OptListLimit, PageType } from '../../constants';
import { v4 as uuidv4 } from 'uuid';
import { OptListModel, OptBasesModel, OptionsInfoProp, OptionListProp } from '../../models';
import { useFormContextHelper, usePageType } from '../../hooks';

/**
 * 입력한 각각의 옵션 기준(variants)들을 조합하여 나올 수 있는 옵션 리스트를 추출
 *
 * @param {OptionListProp} variants getOptionVariants 함수에서 추출된 Return e.g. { option1: ["1"], option2: ["2"]}
 * @return {*}
 * @example
 *  const variants = { option1: ["1"], option2: ["2"]};
 *  const options = optionGenerator(variants);
 *  console.log(options) // [{option1: 1, option2: 2}]
 */
const optionGenerator = (variants: OptionListProp): OptionListProp[] => {
  return (function recurse(keys) {
    if (!keys.length) return [{}];
    let result = recurse(keys.slice(1));
    return variants[keys[0]].reduce(
      (acc, value) => acc.concat(result.map((item) => Object.assign({}, item, { [keys[0]]: value }))),
      [],
    );
  })(Object.keys(variants));
};

/**
 * 입력한 옵션 기준 값을, 옵션 리스트로 Generator 하기 위한 variants 값 추출
 * - optionGenerator 내의 variants 인자를 구하기 위한 함수
 *
 * @param {OptBasesModel[]} opts 옵션명(title), 옵션값(value) 로 이루어진 Array
 * @return {OptionListProp}
 *
 * @example
 *  const opts = [{title: "a", value: "1"}, {title: "b", value: "2"}];
 *  const variants = getOptionVariants(opts);
 *  console.log(variants) // { option1: ["1"], option2: ["2"]}
 */
const getOptionVariants = (optionBases: OptBasesModel[]): OptionListProp => {
  return optionBases.reduce((obj, opt, index) => {
    const key = `option${index + 1}`;
    return {
      ...obj,
      [key]: opt.value.replace(/^,+|,+$/gm, '').split(','),
    };
  }, {});
};

const getOptionBaseVariants = (optionLength: number): OptionListProp => {
  return Array(optionLength)
    .fill(null)
    .reduce((obj, _, index) => {
      const key = `option${index + 1}`;
      return { ...obj, [key]: '' };
    }, {});
};

// 옵션 리스트 생성 (Single)
const makeOptionItem = (option: OptionListProp, commissionRate?: number) => {
  const { ticketGoodsId, ...otherOptions } = option;
  return {
    key: uuidv4(),
    id: '',
    consumerPrice: 0,
    price: 0,
    discountRate: 0,
    stock: 0,
    commissionRate: commissionRate ?? 0,
    ticketGoodsId: ticketGoodsId ?? '',
    bookingDate: null,
    depositPrice: 0,
    ...otherOptions,
  };
};

// 옵션 리스트들 생성 (Multi, Generator)
const makeOptionItems = (options: OptionListProp[], commissionRateParam?: number) => {
  return options.map((option, index) => {
    const optionItem = makeOptionItem(option, commissionRateParam);
    return {
      ...optionItem,
      idx: index,
    };
  });
};

const validOptionLists = (optionBases: OptBasesModel[]) => {
  const validOpts = optionBases.map(({ title }) => {
    return title.trim() === '';
  });

  return !validOpts.includes(true);
};

const validAbleMakeToOptionList = (optionListLength: number, ableMakeToOptListLimit: number) =>
  optionListLength < ableMakeToOptListLimit;

interface Props {
  commissionRate: number;
  initOptionTitles?: string[];
  initOptionLists?: OptListModel[];
  manualOptListLimit: number | null;
}

export const useDetailOptionManageService = ({
  commissionRate,
  initOptionTitles,
  initOptionLists,
  manualOptListLimit,
}: Props) => {
  const { type: pageType } = usePageType();
  const {
    control,
    getValues,
    setValue,
    formState: { errors },
  } = useFormContext();
  const { clearError } = useFormContextHelper();
  // option info
  const [optionsInfo, setOptionsInfo] = useState<OptionsInfoProp>({
    optionLists: [],
    optionTitles: [],
  });
  // getOptionState(getValues('optionBases'), getValues('optionLists')),

  // field Array
  const optionListsFieldArray = useFieldArray({
    control,
    name: 'optionLists',
  });

  const makeSingleOption = () => {
    const optionTitles = [];
    const options = [
      {
        option1: null,
      },
    ];
    const items = makeOptionItems(options, commissionRate);
    setValue('optionLists', []);
    updateOptionsInfo({
      optionTitles,
      optionLists: [...items],
    });
  };

  const makeOptionLists = () => {
    const optionBases = getValues('optionBases');
    if (!validOptionLists(optionBases)) {
      toast.error('옵션명을 입력해주세요');
      return null;
    }

    const optionVariants = getOptionVariants(optionBases);
    const ableMakeToOptListLimit = manualOptListLimit ?? OptListLimit;
    const options = optionGenerator(optionVariants).slice(0, ableMakeToOptListLimit);
    const optionTitles = optionBases.map((opt) => opt.title.trim());
    const items = makeOptionItems(options, commissionRate);
    setValue('optionLists', []);
    clearError('optionLists');
    updateOptionsInfo({
      optionTitles,
      optionLists: [...items],
    });
  };

  const updateOptions = (optionName: string, value: any) => {
    const { optionLists } = optionsInfo;
    if (optionLists.length > 0) {
      const updateOptionLists = optionLists.map((option) => ({
        ...option,
        [optionName]: value,
      }));
      updateOptionsInfo((prevOptionsInfo) => ({
        ...prevOptionsInfo,
        optionLists: updateOptionLists,
      }));
    }
  };

  const updateOptionsInfo = (info: OptionsInfoProp | React.SetStateAction<OptionsInfoProp>) => {
    setOptionsInfo(info);
  };

  const addOptionList = useCallback(() => {
    const { optionTitles } = optionsInfo;
    const optionLists = getValues('optionLists');
    const ableMakeToOptListLimit = manualOptListLimit ?? OptListLimit;

    if (!validAbleMakeToOptionList(optionLists.length, ableMakeToOptListLimit)) {
      /** @todo 줄바꿈 이슈 해결 */
      toast.error(`옵션을 더 이상 추가할 수 없습니다.\r\n최대 ${ableMakeToOptListLimit}개까지 추가 가능합니다`);
      return;
    }

    const optionVariants = getOptionBaseVariants(optionTitles.length);
    const items = makeOptionItems([optionVariants], commissionRate);
    const addOptionList = { ...items[0], idx: optionLists.length };
    optionListsFieldArray.prepend(addOptionList);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // modify option init
  useEffect(() => {
    if (initOptionLists && !!initOptionLists.length) {
      const optionLists = initOptionLists.map((list) => {
        return {
          ...list,
          key: list.id ?? uuidv4(),
        };
      });

      updateOptionsInfo((prev) => {
        return {
          ...prev,
          optionTitles: [...initOptionTitles],
          optionLists,
        };
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initOptionLists, initOptionTitles]);

  useEffect(() => {
    if (pageType === PageType.CREATE) {
      // update commissionRate (수수료)
      updateOptions('commissionRate', commissionRate ?? 0);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [commissionRate]);

  useEffect(() => {
    const { optionLists, optionTitles } = optionsInfo;
    setValue('optionTitles', [...optionTitles]);
    // setValue('optionLists', []);
    optionListsFieldArray.prepend(optionLists);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [optionsInfo, setValue]);

  useEffect(() => {
    if (errors.optionLists && errors.optionLists.message) {
      /** @todo message 로 처리 필요 */
      toast.error(errors.optionLists.message);
    }
  }, [errors]);

  return {
    optionsInfo,
    optionListsFieldArray,
    addOptionList,
    updateOptionsInfo,
    makeSingleOption,
    makeOptionLists,
  };
};
