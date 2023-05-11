import { ComponentStory, ComponentMeta } from '@storybook/react';
import { useState } from 'react';
import { ShowtimeTabs } from './ShowtimeTabs';

export default {
  title: 'Features/Showtime/ShowtimeTabs',
  component: ShowtimeTabs,
} as ComponentMeta<typeof ShowtimeTabs>;

const Template: ComponentStory<typeof ShowtimeTabs> = (args) => {
  const [selectedTab, setSelectedTab] = useState<string>('1');

  const tabItems = [
    { label: '채팅방관리', value: '1', children: '채팅방관리 (준비중)' },
    { label: '채팅 모니터링', value: '2', children: '채팅 모니터링 (준비중)' },
    { label: '컨트롤보드', value: '3', children: '컨트롤보드 (준비중)' },
    { label: '앵커포인트', value: '4', children: '앵커포인트 (준비중)' },
    { label: '경매관리', value: '5', children: '경매관리 (준비중)', hide: true },
    { label: '통계', value: '6', children: '통계 (준비중)' },
  ];

  const handleChangeTab = (selectTabValue: string) => {
    setSelectedTab(selectTabValue);
  };

  return (
    <ShowtimeTabs
      {...args}
      tabName="showtime-tabs"
      tabItems={tabItems}
      selectedTab={selectedTab}
      onChangeTab={handleChangeTab}
    />
  );
};

export const Default = Template.bind({});
Default.args = {};
