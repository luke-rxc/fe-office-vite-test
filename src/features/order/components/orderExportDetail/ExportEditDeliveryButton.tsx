import { Button } from '@material-ui/core';

interface Props {
  show: boolean;
  onClick: () => void;
}

export const ExportEditDeliveryButton = ({ show, onClick: handleClick }: Props) => {
  if (!show) {
    return null;
  }

  return (
    <Button variant="contained" onClick={handleClick}>
      운송정보 수정
    </Button>
  );
};
