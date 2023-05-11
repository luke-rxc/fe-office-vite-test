import { IconButton } from '@components/IconButton';
import { Box, Button } from '@material-ui/core';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import { DiscoverFeedPaginationProps } from '../types';

interface Props {
  show: boolean;
  pagination: DiscoverFeedPaginationProps;
}

export const DiscoverFeedListHeader = ({
  show,
  pagination: { enabledPrev, enabledNext, onCurrent: handleCurrent, onPrev: handlePrev, onNext: handleNext },
}: Props) => {
  if (!show) {
    return null;
  }
  return (
    <Box display="flex" justifyContent="center" alignItems="center">
      <IconButton
        color="primary"
        icon={<ArrowBackIosIcon fontSize="small" />}
        title="이전"
        disabled={!enabledPrev}
        onClick={handlePrev}
      />
      <Button variant="outlined" onClick={handleCurrent}>
        현재 전시그룹
      </Button>
      <IconButton
        color="primary"
        icon={<ArrowForwardIosIcon fontSize="small" />}
        title="다음"
        disabled={!enabledNext}
        onClick={handleNext}
      />
    </Box>
  );
};
