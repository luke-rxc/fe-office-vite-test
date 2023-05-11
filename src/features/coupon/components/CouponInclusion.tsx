import { FormControl, FormControlLabel, Grid, Radio, RadioGroup } from '@material-ui/core';
import { ChangeEvent } from 'react';
import { AllowType } from '../constants';
import { TabItem } from '../types';
import { CouponTabs } from './CouponTabs';
import { FormLayout } from './FormLayout';

interface Props {
  isAllowAll: AllowType;
  onChangeAllowAll: (value: AllowType) => void;
  selectedInclusionTab: string | false;
  inclusionTabItems: Array<TabItem>;
  onChangeTab: (value: string | number | false) => void;
}

/**
 * 쿠폰 적용 component
 */
export const CouponInclusion = ({
  isAllowAll,
  onChangeAllowAll,
  selectedInclusionTab,
  inclusionTabItems,
  onChangeTab: handleChangeTab,
}: Props) => {
  const handleChangeAllowAll = (event: ChangeEvent<HTMLInputElement>, value: string) => {
    onChangeAllowAll(value as AllowType);
  };

  return (
    <>
      <Grid container direction="row" justifyContent="flex-start" alignItems="flex-start" sx={{ marginBottom: '20px' }}>
        <Grid item sm={12}>
          <FormLayout label="쿠폰 전체적용">
            <FormControl component="fieldset">
              <RadioGroup
                row
                aria-label="allowAll"
                name="row-radio-buttons-group"
                value={isAllowAll}
                onChange={handleChangeAllowAll}
              >
                <FormControlLabel value={AllowType.ALL} control={<Radio />} label="전체적용" />
                <FormControlLabel value={AllowType.CASE} control={<Radio />} label="조건별적용" />
              </RadioGroup>
            </FormControl>
          </FormLayout>
        </Grid>
      </Grid>
      <CouponTabs
        tabName="vertical"
        orientation="vertical"
        disabled={isAllowAll === AllowType.ALL}
        selectedTab={selectedInclusionTab}
        tabItems={inclusionTabItems}
        onChangeTab={handleChangeTab}
      />
    </>
  );
};
