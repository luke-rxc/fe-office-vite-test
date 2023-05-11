import { useState } from 'react';
import type { FC, ChangeEvent } from 'react';
import { Box, Divider, Tab, Tabs } from '@material-ui/core';
import { Layout } from '@components/Layout';
import SecuritySettingsContainer from './SecuritySettingsContainer';
import GeneralSettingsContainer from './GeneralSettingsContainer';

const tabs = [
  { label: '기본정보', value: 'general' },
  { label: '비밀번호 변경', value: 'security' },
];

export const AccountContainer: FC = () => {
  const [currentTab, setCurrentTab] = useState<string>('general');

  const handleTabsChange = (event: ChangeEvent<{}>, value: string): void => {
    setCurrentTab(value);
  };

  return (
    <Layout title="내 계정 정보" locations={[{ path: '/', text: '일반' }, { text: '내 계정 정보' }]}>
      <Box sx={{ mt: 3 }}>
        <Tabs
          indicatorColor="primary"
          onChange={handleTabsChange}
          scrollButtons="auto"
          textColor="primary"
          value={currentTab}
          variant="scrollable"
        >
          {tabs.map((tab) => (
            <Tab key={tab.value} label={tab.label} value={tab.value} />
          ))}
        </Tabs>
      </Box>
      <Divider />
      <Box sx={{ mt: 3 }}>
        {currentTab === 'general' && <GeneralSettingsContainer />}
        {currentTab === 'security' && <SecuritySettingsContainer />}
      </Box>
    </Layout>
  );
};
