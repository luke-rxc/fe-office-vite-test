import { AutocompleteInputChangeReason, Grid } from '@material-ui/core';
import { SyntheticEvent, useCallback } from 'react';
import { useFormContext } from 'react-hook-form';
import { ControlledComboBox, LabelWrapper } from '.';
import {
  FormMainBannerLadingTypeOptions,
  BannerLandingTypeOption,
  FeedLandingTypeOption,
  FormMainFeedLadingTypeOptions,
} from '../constants';
import { UseMainBannerDetailService, UseMainFeedDetailService } from '../services';
import { MainBannerDetailFormFields, MainFeedDetailFormFields } from '../types';

interface Props {
  getSubLandingTypeOptions:
    | UseMainBannerDetailService['getSubLandingTypeOptions']
    | UseMainFeedDetailService['getSubLandingTypeOptions'];
  disabled?: boolean;
  landingTypeOptions: typeof FormMainBannerLadingTypeOptions | typeof FormMainFeedLadingTypeOptions;
  handleMainTypeChangeCapture?: (event: SyntheticEvent, value: string, reason: AutocompleteInputChangeReason) => void;
}

type LandingTypeOption = BannerLandingTypeOption | FeedLandingTypeOption;

export const LandingTypeComboBox = ({
  getSubLandingTypeOptions,
  disabled = false,
  landingTypeOptions,
  handleMainTypeChangeCapture = () => {},
}: Props) => {
  const { watch } = useFormContext<MainBannerDetailFormFields>();

  const subTypeOptions = getSubLandingTypeOptions(watch('landingType.main'));

  const isOptionEqualToValue = useCallback((option: LandingTypeOption, selected: LandingTypeOption) => {
    if (!option || !selected) return false;

    return option.value === selected.value;
  }, []);

  return (
    <LabelWrapper label="랜딩 타입" required>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <ControlledComboBox<MainBannerDetailFormFields | MainFeedDetailFormFields>
            label="랜딩 타입"
            name="landingType.main"
            options={landingTypeOptions.main}
            isOptionEqualToValue={isOptionEqualToValue}
            disabled={disabled}
            rules={{ required: true }}
            disableClearable
            onInputChange={handleMainTypeChangeCapture}
          />
        </Grid>

        {Boolean(subTypeOptions.length) && (
          <Grid item xs={6}>
            <ControlledComboBox<MainBannerDetailFormFields | MainFeedDetailFormFields>
              label="랜딩 타입(상세)"
              name="landingType.sub"
              options={subTypeOptions}
              isOptionEqualToValue={isOptionEqualToValue}
              disabled={disabled}
              disableClearable
            />
          </Grid>
        )}
      </Grid>
    </LabelWrapper>
  );
};
