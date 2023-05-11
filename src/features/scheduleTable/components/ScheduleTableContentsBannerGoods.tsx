import { Grid } from '@material-ui/core';
import { ScheduleTableDetailBannerGoodsModel } from '../models';
import { BannerGoodsContent } from './BannerGoodsContent';

interface Props {
  items: Array<ScheduleTableDetailBannerGoodsModel>;
}

export const ScheduleTableContentsBannerGoods = ({ items }: Props) => {
  return (
    <Grid container spacing={1}>
      {items.map((item) => (
        <Grid item key={item.id} xs={6}>
          <BannerGoodsContent item={item} />
        </Grid>
      ))}
    </Grid>
  );
};
