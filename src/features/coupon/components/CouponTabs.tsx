import styled from '@emotion/styled';
import { Box, Tab, Tabs } from '@material-ui/core';
import { SyntheticEvent } from 'react';
import { TabOrientation } from '../constants';
import { TabItem } from '../types';

interface Props {
  tabName: string;
  disabled?: boolean;
  orientation?: TabOrientation;
  selectedTab: string | number | false;
  tabItems: Array<TabItem>;
  onChangeTab: (value: string | number) => void;
}

interface TabPanelProps {
  children?: React.ReactNode;
  tabName: string;
  orientation?: TabOrientation;
  index: any;
  value: any;
}

const CouponTabPanel = (props: TabPanelProps) => {
  const { children, value, index, tabName, orientation, ...other } = props;

  return (
    <ContentWrapper
      role="tabpanel"
      hidden={value !== index}
      id={`${tabName}-tabpanel-${index}`}
      aria-labelledby={`${tabName}-tab-${index}`}
      vertical={orientation === 'vertical'}
      {...other}
    >
      {value === index && children}
    </ContentWrapper>
  );
};

export const CouponTabs = ({
  tabName,
  disabled = false,
  orientation = 'horizontal',
  tabItems,
  selectedTab,
  onChangeTab,
}: Props) => {
  const a11yProps = (index: string | number) => {
    return {
      id: `${tabName}-tab-${index}`,
      'aria-controls': `${tabName}-tabpanel-${index}`,
    };
  };

  const handleChangeTab = (event: SyntheticEvent<Element, Event>, value: typeof selectedTab) => {
    value && onChangeTab(value);
  };

  return (
    <Wrapper vertical={orientation === 'vertical'}>
      <Box>
        <Tabs
          orientation={orientation}
          centered
          value={selectedTab}
          aria-label={`${tabName} tabs`}
          onChange={handleChangeTab}
          sx={{ backgroundColor: '#0000001a' }}
        >
          {tabItems.map((item) => (
            <Tab
              key={`tab-${item.value}`}
              value={item.value}
              label={item.label}
              disabled={disabled}
              {...a11yProps(item.value)}
            />
          ))}
        </Tabs>
      </Box>
      {tabItems.map((item) => (
        <CouponTabPanel
          key={`${tabName}-${item.value}`}
          tabName={tabName}
          orientation={orientation}
          value={selectedTab}
          index={item.value}
        >
          <Box>{item.children}</Box>
        </CouponTabPanel>
      ))}
    </Wrapper>
  );
};

const Wrapper = styled.div<{ vertical: boolean }>`
  ${({ vertical }) =>
    vertical &&
    `
    display: flex; 
    flex-grow: 1;
  `}
`;

const ContentWrapper = styled.div<{ vertical: boolean }>`
  width: 100%;
  ${({ vertical }) =>
    vertical
      ? `
    padding-left: 20px;
    padding-right: 10px;
    `
      : `
    padding-top: 20px;
    `}
`;
