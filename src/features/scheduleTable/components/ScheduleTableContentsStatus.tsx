import { FormControlSelect } from '@components/form';
import { SchedulingStatusLabel, SchedulingStatus } from '../constants';
import { ScheduleModifyForm } from '../types';

/**
 * 공개상태 옵션
 */
const schedulingStatusOptions: Array<{ label: string; value: string }> = [
  { label: SchedulingStatusLabel[SchedulingStatus.OPENED], value: SchedulingStatus.OPENED },
  { label: SchedulingStatusLabel[SchedulingStatus.CLOSED], value: SchedulingStatus.CLOSED },
];

export const ScheduleTableContentsStatus = () => {
  return (
    <FormControlSelect<ScheduleModifyForm>
      name="scheduling"
      options={schedulingStatusOptions}
      sx={{ width: '200px' }}
    />
  );
};
