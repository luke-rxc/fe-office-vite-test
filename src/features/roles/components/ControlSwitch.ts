import { Switch, ISwitchProps } from '@components/Switch';
import { withHookFormController } from '../hocs';

/** react-hook-form을 위한 Switch */
export const ControlSwitch = withHookFormController<ISwitchProps>(Switch);
