import { Checkbox, ICheckboxProps } from '@components/Checkbox';
import { withHookFormController } from '../hocs';

/** react-hook-form을 위한 Checkbox */
export const ControlCheckbox = withHookFormController<ICheckboxProps>(Checkbox);
