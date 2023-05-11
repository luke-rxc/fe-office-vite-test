import { useState } from 'react';
import { Box, Divider, Tab, Tabs } from '@material-ui/core';
import { Theme, makeStyles } from '@material-ui/core/styles';
import { DetailTabs, PartnerDetailTabs, DetailTabType } from '../../constants';
import { usePageType } from '../../hooks';

interface Props {
  isTabFixed: boolean;
  onTabChange: (value: DetailTabType) => void;
}

const useStyles = makeStyles((theme: Theme) => ({
  fixedTab: {
    position: 'fixed',
    top: 40,
    right: 0,
    left: '280px',
    zIndex: 100,
    background: theme.palette.background.default,
    [theme.breakpoints.down('lg')]: {
      left: 0,
    },
  },
}));

export const DetailTab: React.FC<Props> = ({ isTabFixed, onTabChange }) => {
  const classes = useStyles();
  const { isPartnerSite } = usePageType();
  const tabs = isPartnerSite ? PartnerDetailTabs : DetailTabs;
  const [currentTab, setCurrentTab] = useState<DetailTabType>(tabs[0].value);

  const handleTabChange = (event: React.SyntheticEvent<Element, Event>, newValue: DetailTabType) => {
    setCurrentTab(newValue);
    onTabChange(newValue);
  };

  return (
    <Box className={isTabFixed ? classes.fixedTab : ''} sx={{ mt: 3 }}>
      <Tabs onChange={handleTabChange} value={currentTab} variant="fullWidth" selectionFollowsFocus={false}>
        {tabs.map(({ value, label }) => (
          <Tab key={value} label={label} value={value} />
        ))}
      </Tabs>
      <Divider />
    </Box>
  );
};
