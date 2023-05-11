import { Typography, Divider } from '@material-ui/core';
import { PolicyTab } from '../constants';
import { TabItem } from '../types';
import { CouponTabs } from './CouponTabs';

interface Props {
  tabItems: Array<TabItem>;
  selectedTab: PolicyTab;
  onChangeTab: (selectTabValue: PolicyTab) => void;
}

export const CouponPolicy = ({ tabItems, selectedTab, onChangeTab }: Props) => {
  const handleChangeTab = (selectTabValue: string) => {
    onChangeTab(selectTabValue as PolicyTab);
  };

  return (
    <>
      <Typography variant="h6" gutterBottom sx={{ mt: '20px' }}>
        쿠폰 적용 대상
      </Typography>
      <Divider sx={{ mb: '20px' }} />
      <CouponTabs tabName="policy" tabItems={tabItems} selectedTab={selectedTab} onChangeTab={handleChangeTab} />
    </>
  );
};
