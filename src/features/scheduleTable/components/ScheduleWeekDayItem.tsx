import styled from '@emotion/styled';
import { Card, CardContent, CardHeader, Divider } from '@material-ui/core';
import { ScheduleTableWeekDayModel } from '../models';
import { ScheduleList } from './ScheduleList';

interface Props {
  scheduleItem: ScheduleTableWeekDayModel;
  onClickOpenModify?: (id: number) => () => void;
}

export const ScheduleWeekDayItem = ({
  scheduleItem: { title, weekdayText, items },
  onClickOpenModify: handleClickOpenModify,
}: Props) => {
  return (
    <CardStyled>
      <CardHeaderStyled title={title} subheader={weekdayText} />
      <CardContentStyled>
        <Divider />
        <ScheduleList items={items} onClickOpenModify={handleClickOpenModify} />
      </CardContentStyled>
    </CardStyled>
  );
};

const CardStyled = styled(Card)`
  height: 100%;
  border-radius: 0px;
  box-shadow: none;
  background-color: rgb(244, 245, 247);
`;

const CardHeaderStyled = styled(CardHeader)`
  text-align: center;
  padding: 10px 10px 2px;

  .MuiCardHeader-title {
    font-size: 12px;
  }

  .MuiCardHeader-subheader {
    font-size: 24px;
  }
`;

const CardContentStyled = styled(CardContent)`
  padding: 2px 10px;

  &:last-child {
    padding-bottom: 5px;
  }
`;
