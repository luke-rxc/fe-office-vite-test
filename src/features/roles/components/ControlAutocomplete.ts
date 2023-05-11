import { Autocomplete, IAutocompleteProps } from '@components/Autocomplete';
import { withHookFormController } from '../hocs';

/** react-hook-form을 위한 Checkbox */
export const ControlAutocomplete = withHookFormController<IAutocompleteProps>(Autocomplete);
