import styled from '@emotion/styled';
import { Box, Grid } from '@material-ui/core';
import { ReturnTypeUseScheduleModifyService, ReturnTypeUseScheduleTableService } from '../services';
import { ScheduleWeekDayItem } from './ScheduleWeekDayItem';

interface Props {
  scheduleItems: ReturnTypeUseScheduleTableService['scheduleItems'];
  onClickOpenModify?: ReturnTypeUseScheduleModifyService['actions']['handleClickOpenModifySchedule'];
}

export const ScheduleWeekDays = ({ scheduleItems, onClickOpenModify: handleClickOpenModify }: Props) => {
  if (!scheduleItems) {
    return null;
  }

  return (
    <Box sx={{ overflow: 'auto', pb: '10px' }}>
      <Grid container sx={{ minWidth: '1800px' }}>
        {scheduleItems.map((item) => (
          <GridItemStyled item xs={12} md key={item.weekdayText}>
            <ScheduleWeekDayItem scheduleItem={item} onClickOpenModify={handleClickOpenModify} />
          </GridItemStyled>
        ))}
      </Grid>
    </Box>
  );
};

const GridItemStyled = styled(Grid)`
  border-left: 1px solid #0000001f;
  min-height: 800px;

  &:first-of-type {
    border-left: none;
  }
`;
