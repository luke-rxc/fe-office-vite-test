import styled from '@emotion/styled';
import { Box, Tab, Tabs } from '@material-ui/core';
import classnames from 'classnames';
import { ReactNode, SyntheticEvent } from 'react';

export interface TabItem<T> {
  label: string;
  value: T;
  children: ReactNode;
  hide?: boolean;
}

interface Props<T> {
  variant?: 'fullWidth' | 'standard' | 'scrollable';
  centered?: boolean;
  tabName: string;
  disabled?: boolean;
  selectedTab: T;
  tabItems: Array<TabItem<T>>;
  onChangeTab: (value: T) => void;
}

interface TabPanelProps {
  children?: React.ReactNode;
  tabName: string;
  hidden?: boolean;
  index: any;
  value: any;
}

const ShowtimeTabPanel = (props: TabPanelProps) => {
  const { children, value, hidden = false, index, tabName, ...other } = props;

  return (
    <ContentWrapperStyled
      role="tabpanel"
      hidden={hidden}
      id={`${tabName}-tabpanel-${index}`}
      aria-labelledby={`${tabName}-tab-${index}`}
      {...other}
    >
      {children}
    </ContentWrapperStyled>
  );
};

export const ShowtimeTabs = <T extends string | number>({
  variant = 'fullWidth',
  centered = true,
  tabName,
  disabled = false,
  tabItems,
  selectedTab,
  onChangeTab,
}: Props<T>) => {
  const filteredTabItems = tabItems.filter((item) => !item.hide);
  const a11yProps = (value: T) => {
    return {
      id: `${tabName}-tab-${value}`,
      'aria-controls': `${tabName}-tabpanel-${value}`,
    };
  };

  const handleChangeTab = (event: SyntheticEvent<Element, Event>, value: T) => {
    onChangeTab(value);
  };

  return (
    <Box>
      <TabWrapperStyled>
        <Tabs
          centered={centered}
          value={selectedTab}
          aria-label={`${tabName} tabs`}
          variant={variant}
          onChange={handleChangeTab}
        >
          {filteredTabItems.map((item) => (
            <TabItemStyled
              key={`tab-${item.value}`}
              value={item.value}
              label={item.label}
              disabled={disabled}
              className={classnames({
                active: selectedTab === item.value,
              })}
              {...a11yProps(item.value)}
            />
          ))}
        </Tabs>
      </TabWrapperStyled>
      {filteredTabItems.map((item, index) => (
        <ShowtimeTabPanel
          key={`${tabName}-${item.value}`}
          tabName={tabName}
          value={item.value}
          index={index}
          hidden={selectedTab !== item.value}
        >
          {selectedTab === item.value && <Box>{item.children}</Box>}
        </ShowtimeTabPanel>
      ))}
    </Box>
  );
};

const TabWrapperStyled = styled(Box)`
  background-color: ${({ theme }) => theme.palette.background.paper};

  & .MuiTabs-indicator {
    display: flex;
    justify-content: center;
    background-color: transparent;
  }
`;

const TabItemStyled = styled(Tab)`
  padding: 10px;
  text-transform: none;
  background-color: transparent;
  color: #000000;

  &.active {
    border-bottom: 2px solid ${({ theme }) => theme.palette.primary.main};
  }

  &.Mui-focusVisible {
    background-color: none;
  }
`;

const ContentWrapperStyled = styled.div`
  box-sizing: border-box;
  width: 100%;
  padding: 20px 20px 0 20px;
`;
