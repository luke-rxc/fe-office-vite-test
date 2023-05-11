import { List } from '@material-ui/core';
import styled from '@emotion/styled';
import { ScheduleItem } from './ScheduleItem';
import { ScheduleTableItemModel } from '../models';

interface Props {
  items: Array<ScheduleTableItemModel>;
  onClickOpenModify?: (id: number) => () => void;
}

export const ScheduleList = ({ items, onClickOpenModify: handleClickOpenModify }: Props) => {
  return (
    <ListStyled>
      {items.map((item) => {
        return <ScheduleItem key={item.id} item={item} onClickOpenModify={handleClickOpenModify} />;
      })}
    </ListStyled>
  );
};

const ListStyled = styled(List)`
  > li {
    &:first-of-type {
      margin-top: 0;
    }
  }
`;
