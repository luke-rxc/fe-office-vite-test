import FirstPage from '@material-ui/icons/FirstPage';
import KeyboardArrowDown from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUp from '@material-ui/icons/KeyboardArrowUp';
import { IconButton } from '@components/IconButton';

interface Props {
  disabled: boolean;
  onOrder: (type: string) => () => void;
}

/**
 * 리스트 순서변경 버튼 component
 */
export const DiscoverListRowControlButtons = ({ disabled, onOrder: handleOrder }: Props) => {
  return (
    <>
      <IconButton
        icon={<FirstPage />}
        title="맨 아래로"
        disabled={disabled}
        onClick={handleOrder('bottom')}
        sx={{ transform: 'rotate(270deg)' }}
      />

      <IconButton icon={<KeyboardArrowDown />} title="아래로" disabled={disabled} onClick={handleOrder('down')} />

      <IconButton icon={<KeyboardArrowUp />} title="위로" disabled={disabled} onClick={handleOrder('up')} />

      <IconButton
        icon={<FirstPage />}
        title="맨 위로"
        disabled={disabled}
        onClick={handleOrder('top')}
        sx={{ transform: 'rotate(90deg)' }}
      />
    </>
  );
};
