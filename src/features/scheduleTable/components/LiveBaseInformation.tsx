import styled from '@emotion/styled';
import { Grid, Link } from '@material-ui/core';
import { ScheduleTableDetailBaseInfo, ScheduleTableDetailBaseInfoLabel } from '../constants';
import { ScheduleTableDetailItemModel } from '../models';
import { FormLayout } from './FormLayout';

interface Props {
  item: ScheduleTableDetailItemModel;
}

export const LiveBaseInformation = ({ item }: Props) => {
  if (!item) {
    return null;
  }

  return (
    <Grid container direction="row" justifyContent="flex-start" alignItems="flex-start">
      {Object.keys(ScheduleTableDetailBaseInfo).map((key) => {
        const fieldId = ScheduleTableDetailBaseInfo[key];
        return (
          <GridStyled item md={6} xs={12} key={fieldId}>
            <FormLayout label={ScheduleTableDetailBaseInfoLabel[fieldId]}>{item.liveContents?.[fieldId]}</FormLayout>
          </GridStyled>
        );
      })}
      <LinkStyled href={item.liveContents.liveContentsPath} target="_blank" rel="noopener">
        라이브 콘텐츠 상세 페이지 열기 &gt;
      </LinkStyled>
    </Grid>
  );
};

const GridStyled = styled(Grid)`
  margin-bottom: 10px;
`;

const LinkStyled = styled(Link)`
  font-size: 14px;
  margin-left: 40px;
`;
