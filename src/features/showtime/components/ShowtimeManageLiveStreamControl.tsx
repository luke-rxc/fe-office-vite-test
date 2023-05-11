import { Card, CardContent, Divider } from '@material-ui/core';
import { CardHeaderStyled, ShowtimeTabs, TabItem } from '.';
import { BroadcastType } from '../constants';

interface Props {
  tabItems: Array<TabItem<BroadcastType>>;
  selectedTab: BroadcastType;
  onChangeTab: (value: BroadcastType) => void;
}

/**
 * 스트림 및 송출 제어 component
 */
export const ShowtimeManageLiveStreamControl = ({ tabItems, selectedTab, onChangeTab: handleChangeTab }: Props) => {
  return (
    <Card>
      <CardHeaderStyled title="스트림 및 송출 제어" />
      <Divider />
      <CardContent sx={{ padding: '20px 20px' }}>
        <ShowtimeTabs
          centered={false}
          variant="standard"
          tabName="live"
          tabItems={tabItems}
          selectedTab={selectedTab}
          onChangeTab={handleChangeTab}
        />
      </CardContent>
    </Card>
  );
};
