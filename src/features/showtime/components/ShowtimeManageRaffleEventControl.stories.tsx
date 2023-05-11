import { Checkbox } from '@components/Checkbox';
import { Box, Button } from '@material-ui/core';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { useState } from 'react';
import { RaffleEventStatus, RaffleEventStatusLabel } from '../constants';
import { toShowtimeRaffleEventDetailItemModel } from '../models';
import { showtimeRaffleEventDetailItemSchemaMock } from '../__mocks__/showtimeRaffleEventItemSchemaMock';
import { ShowtimeManageRaffleEventControl } from './ShowtimeManageRaffleEventControl';

export default {
  title: 'Features/Showtime/ShowtimeManageRaffleEventControl',
  component: ShowtimeManageRaffleEventControl,
} as ComponentMeta<typeof ShowtimeManageRaffleEventControl>;

const statusButtons = [RaffleEventStatus.STANDBY, RaffleEventStatus.DRAW, RaffleEventStatus.COMPLETED];

const Template: ComponentStory<typeof ShowtimeManageRaffleEventControl> = (args) => {
  const [raffleEventStatus, setRaffleEventStatus] = useState<RaffleEventStatus>(RaffleEventStatus.STANDBY);
  const [extracting, setExtracting] = useState<boolean>(false);

  const item = toShowtimeRaffleEventDetailItemModel(showtimeRaffleEventDetailItemSchemaMock);

  const handleClick = (status: RaffleEventStatus) => {
    return () => {
      setRaffleEventStatus(status);
    };
  };

  const handleChange = () => {
    setExtracting((prev) => !prev);
  };

  return (
    <>
      <Box mb="10px">
        {statusButtons.map((status) => {
          return (
            <Button
              variant="contained"
              color={raffleEventStatus === status ? 'primary' : 'inherit'}
              sx={{ ml: '10px' }}
              onClick={handleClick(status)}
            >
              {RaffleEventStatusLabel[status]}({status})
            </Button>
          );
        })}
        <Checkbox label="로딩여부" value={extracting} checked={extracting} onChange={handleChange} />
      </Box>
      <ShowtimeManageRaffleEventControl {...args} {...item} extracting={extracting} />
    </>
  );
};

export const Default = Template.bind({});
Default.args = {};
