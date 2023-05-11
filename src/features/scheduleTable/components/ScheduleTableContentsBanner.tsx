import { FormControlRadioGroup } from '@components/form';
import { Box } from '@material-ui/core';
import { ReactNode, useMemo } from 'react';
import { useFormContext } from 'react-hook-form';
import { ScheduleBannerTypeLabel, ScheduleBannerType } from '../constants';
import { ScheduleTableDetailBannerGoodsModel } from '../models';
import { ScheduleModifyForm } from '../types';
import { ScheduleTableContentsBannerCTA } from './ScheduleTableContentsBannerCTA';
import { ScheduleTableContentsBannerGoods } from './ScheduleTableContentsBannerGoods';

interface Props {
  items: Array<ScheduleTableDetailBannerGoodsModel>;
  bannerImagesComponent: ReactNode;
}

/**
 * 배너 타입(부가정보) 옵션
 */
const bannerTypeOptions: Array<{ label: string; value: string }> = [
  { label: ScheduleBannerTypeLabel[ScheduleBannerType.NONE], value: ScheduleBannerType.NONE },
  { label: ScheduleBannerTypeLabel[ScheduleBannerType.GOODS], value: ScheduleBannerType.GOODS },
  { label: ScheduleBannerTypeLabel[ScheduleBannerType.BUTTON], value: ScheduleBannerType.BUTTON },
];

/**
 * 부가 정보 설정 component
 */
export const ScheduleTableContentsBanner = ({ items, bannerImagesComponent }: Props) => {
  const { watch } = useFormContext<ScheduleModifyForm>();
  const currentBannerType = watch('bannerType');

  const optionComponent = useMemo(() => {
    if (currentBannerType === ScheduleBannerType.NONE) {
      return null;
    }

    switch (currentBannerType) {
      case ScheduleBannerType.GOODS:
        return <ScheduleTableContentsBannerGoods items={items} />;
      case ScheduleBannerType.BUTTON:
        return <ScheduleTableContentsBannerCTA>{bannerImagesComponent}</ScheduleTableContentsBannerCTA>;
    }
  }, [bannerImagesComponent, currentBannerType, items]);

  return (
    <>
      <FormControlRadioGroup<ScheduleModifyForm> name="bannerType" row options={bannerTypeOptions} />
      <Box p="5px" />
      {optionComponent}
    </>
  );
};
