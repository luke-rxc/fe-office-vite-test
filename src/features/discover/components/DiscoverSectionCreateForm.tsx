import { FormControlAutoComplete, FormControlSelect, FormControlTextField } from '@components/form';
import { MenuItem } from '@material-ui/core';
import { useMemo } from 'react';
import { useFormContext } from 'react-hook-form';
import { DiscoverSectionDisplayType, DiscoverSectionTypeOptions } from '../constants';
import { DiscoverSectionCreatableTypeModel, KeywordComboItemModel } from '../models';
import { DiscoverSectionCreateFormField } from '../types';
import { FormLayout } from './FormLayout';

interface Props {
  keywordCombo: Array<KeywordComboItemModel>;
  sectionCreatableTypeList: Array<DiscoverSectionCreatableTypeModel>;
}

export const DiscoverSectionCreateForm = ({ keywordCombo, sectionCreatableTypeList }: Props) => {
  const { watch } = useFormContext<DiscoverSectionCreateFormField>();
  const [sectionType, displayType] = watch(['sectionType', 'displayType']);

  const options = useMemo(() => {
    return sectionCreatableTypeList?.find((item) => item.sectionType === sectionType)?.options;
  }, [sectionType, sectionCreatableTypeList]);

  return (
    <>
      <FormLayout label="섹션 타입" required>
        <FormControlSelect<DiscoverSectionCreateFormField>
          name="sectionType"
          options={DiscoverSectionTypeOptions}
          rules={{ required: '섹션 타입을 선택하세요' }}
          sx={{ width: '400px' }}
          showError
          displayEmpty
        >
          <MenuItem disabled value="">
            섹션 타입 선택
          </MenuItem>
        </FormControlSelect>
      </FormLayout>
      <FormLayout label="노출 타입" required>
        <FormControlSelect<DiscoverSectionCreateFormField>
          name="displayType"
          options={options}
          rules={{
            required:
              (options ?? []).length > 0
                ? '노출 타입을 선택하세요'
                : !sectionType
                ? '노출 타입을 선택하세요'
                : '선택 가능한 노출타입이 없습니다.',
          }}
          sx={{ width: '400px' }}
          showError
          displayEmpty
        >
          <MenuItem disabled value="">
            {(options ?? []).length > 0
              ? '노출 타입 선택'
              : !sectionType
              ? '노출 타입 선택'
              : '선택 가능한 노출타입 없음'}
          </MenuItem>
        </FormControlSelect>
      </FormLayout>
      {displayType === DiscoverSectionDisplayType.CURATION && (
        <FormLayout label="키워드" required>
          <FormControlAutoComplete<DiscoverSectionCreateFormField>
            name="keyword"
            options={keywordCombo}
            getOptionLabel={({ label }: KeywordComboItemModel) => label}
            isOptionEqualToValue={(v: KeywordComboItemModel, o: KeywordComboItemModel) => v.value === o.value}
            rules={{ required: '키워드를 선택하세요' }}
            placeholder="키워드 선택"
            sx={{ width: '400px' }}
          />
        </FormLayout>
      )}
      <FormLayout label="섹션 타이틀" required>
        <FormControlTextField<DiscoverSectionCreateFormField>
          name="title"
          sx={{ width: '400px' }}
          maxLength={16}
          showLength
          rules={{
            required: '섹션 타이틀을 입력하세요',
            maxLength: { message: '최대 16자까지 가능합니다.', value: 16 },
          }}
        />
      </FormLayout>
    </>
  );
};
