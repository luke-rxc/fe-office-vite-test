import { DatePicker, IDatePickerProps } from '@components/DatePicker';
import { withHookFormController } from '../hocs';

/** react-hook-form을 위한 DatePiker */
export const ControlDatePicker = withHookFormController<IDatePickerProps<number>>(DatePicker, {
  callbackDateConverter: (date) => new Date(date).getTime(),
});
