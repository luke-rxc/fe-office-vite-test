import { FormControlAutoComplete, FormControlSelect, FormControlTextField } from '@components/form';
import { Chip, Grid } from '@material-ui/core';
import { DiscoverSectionDisplayType, DiscoverSectionOpenOptions } from '../constants';
import { KeywordComboItemModel } from '../models';
import { ReturnTypeUseDiscoverSectionModifyService } from '../services';
import { DiscoverSectionModifyFormField } from '../types';
import { DiscoverSectionTypeChip } from './DiscoverSectionTypeChip';
import { FormLayout } from './FormLayout';

interface Props {
  isEdit: ReturnTypeUseDiscoverSectionModifyService['isEdit'];
  discoverSectionItem: ReturnTypeUseDiscoverSectionModifyService['discoverSectionItem'];
  keywordCombo: ReturnTypeUseDiscoverSectionModifyService['keywordComboList'];
}

export const DiscoverSectionDetail = ({ isEdit, discoverSectionItem, keywordCombo }: Props) => {
  if (!discoverSectionItem) {
    return null;
  }

  const { sectionType, sectionTypeText, displayType, displayTypeText } = discoverSectionItem;

  return (
    <Grid container>
      <Grid item xs={6}>
        <FormLayout label="섹션 타입">
          <DiscoverSectionTypeChip className={sectionType.toLowerCase()} label={sectionTypeText} />
        </FormLayout>
      </Grid>
      <Grid item xs={6}>
        <FormLayout label="노출 타입">{displayTypeText}</FormLayout>
      </Grid>
      <Grid item xs={6}>
        <FormLayout label="섹션 타이틀" required>
          <FormControlTextField<DiscoverSectionModifyFormField>
            name="title"
            rules={{
              required: '섹션 타이틀을 입력하세요',
              maxLength: { message: '최대 16자까지 가능합니다.', value: 16 },
            }}
            disabled={!isEdit}
            showLength
            maxLength={16}
            sx={{ width: '400px' }}
          />
        </FormLayout>
      </Grid>
      {displayType === DiscoverSectionDisplayType.CURATION && (
        <FormLayout label="키워드" required>
          <FormControlAutoComplete<DiscoverSectionModifyFormField>
            name="keyword"
            options={keywordCombo}
            getOptionLabel={({ label }: KeywordComboItemModel) => label}
            isOptionEqualToValue={(v: KeywordComboItemModel, o: KeywordComboItemModel) => v.value === o.value}
            rules={{ required: '키워드를 선택하세요' }}
            placeholder="키워드 선택"
            disabled={!isEdit}
            renderTags={(tagValue, getTagProps) => {
              return tagValue.map((option, index) => (
                <Chip label={option.label} {...getTagProps({ index })} {...(!isEdit ? { onDelete: undefined } : {})} />
              ));
            }}
            sx={{ width: '400px' }}
          />
        </FormLayout>
      )}
      <Grid item xs={6}>
        <FormLayout label="공개 여부" required>
          <FormControlSelect<DiscoverSectionModifyFormField>
            name="isOpen"
            options={DiscoverSectionOpenOptions}
            rules={{ required: '공개 여부를 입력하세요' }}
            disabled={!isEdit}
            sx={{ width: '200px' }}
          />
        </FormLayout>
      </Grid>
    </Grid>
  );
};
