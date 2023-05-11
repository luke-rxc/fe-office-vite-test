import { Select, ISelectProps } from '@components/Select';
import { withHookFormController } from '../hocs';

/** react-hook-form을 위한 Select */
export const ControlSelect = withHookFormController<ISelectProps>(Select);
