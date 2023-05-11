import { TextField, TextFieldProps } from '@material-ui/core';
import { withHookFormController } from '../hocs';

/** react-hook-form을 위한 TextField */
export const ControlTextField = withHookFormController<TextFieldProps>(TextField, { fullWidth: true });
