import { Button } from '@material-ui/core';

interface Props {
  isFold: boolean;
  onToggleFold: () => void;
}

export const ToggleFoldInfoButton = ({ isFold, onToggleFold: handleToggleFold }: Props) => {
  if (!handleToggleFold) {
    return null;
  }

  return (
    <Button variant="outlined" onClick={handleToggleFold}>
      {isFold ? '모두보기' : '간략히 보기'}
    </Button>
  );
};
