import { useFormContext, useFieldArray } from 'react-hook-form';
import toast from 'react-hot-toast';
import { OptionBase, OptionsLimit } from '../../constants';
import { SelectOptionPropV2 } from '../../types';

// 옵션명 갯수의 Options 생성
const makeOptions = (optionsLimit: number): SelectOptionPropV2[] => {
  return Array(optionsLimit)
    .fill(null)
    .map((_, index) => {
      const optionNum = optionsLimit - index;
      return {
        label: `${optionNum}`,
        value: optionNum,
      };
    })
    .reverse();
};

export const useDetailOptionBaseService = () => {
  const { getValues, control, setValue } = useFormContext();
  const fieldValues = useFieldArray({
    control,
    name: 'optionBases',
  });

  const { fields, append, remove } = fieldValues;

  const handleChangeBaseOption = () => {
    const optionsLen = +getValues('optionsLen') ?? 0;
    const currentFieldsLen = fields.length;
    const makeOptionFieldLen = optionsLen - currentFieldsLen;
    if (makeOptionFieldLen === 0) {
      return;
    }

    if (makeOptionFieldLen > 0) {
      append([...Array(makeOptionFieldLen).fill({ ...OptionBase })]);
    }

    if (makeOptionFieldLen < 0) {
      const removeFieldsLen = Math.abs(makeOptionFieldLen);
      const removeFields = Array(removeFieldsLen)
        .fill(null)
        .map((_, index) => currentFieldsLen - index - 1)
        .reverse();
      remove(removeFields);
    }
  };

  const resetInputBaseOption = (lengthValue: number | string) => {
    setValue('optionsLen', lengthValue);
  };

  const addBaseOption = () => {
    if (fields.length === OptionsLimit) {
      toast.error(`옵션은 최대 ${OptionsLimit}개 까지 생성 가능합니다.`);
      return;
    }

    append({ ...OptionBase });
  };

  return {
    fieldValues,
    makableBaseOptions: makeOptions(OptionsLimit),
    addBaseOption,
    resetInputBaseOption,
    handleChangeBaseOption,
  };
};
