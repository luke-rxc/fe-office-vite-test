import { withHookFormController } from '../hocs';
import { RadioGroup, IRadioGroupProps } from './RadioGroup';

/** react-hook-form을 위한 RadioGroup */
export const ControlRadioGroup = withHookFormController<IRadioGroupProps>(RadioGroup, { direction: 'wrap' });
