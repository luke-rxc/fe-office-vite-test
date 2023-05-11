import { DatePicker } from '@components/DatePicker';
import { IconButton } from '@components/IconButton';
import styled from '@emotion/styled';
import { Box, Button, Typography } from '@material-ui/core';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import { ReturnTypeUseScheduleTableService } from '../services';
interface Props {
  title: ReturnTypeUseScheduleTableService['weekTitle'];
  actions: ReturnTypeUseScheduleTableService['actions'];
}

export const ScheduleHeader = ({
  title,
  actions: { handleIncreaseWeekNumber, handleDecreaseWeekNumber, handleResetWeekNumber, handleChangeWeekNumber },
}: Props) => {
  return (
    <HeaderStyled>
      <Box display="flex" alignItems="center">
        <Typography color="textPrimary" variant="h5">
          {title}
        </Typography>
        <DatePicker
          renderInput={({ inputRef, inputProps, InputProps }) => (
            <Box p="15px 0" ref={inputRef}>
              {InputProps?.endAdornment}
            </Box>
          )}
          onChange={handleChangeWeekNumber}
        />
      </Box>
      <Box>
        <IconButton
          color="primary"
          icon={<ArrowBackIosIcon fontSize="small" />}
          title="전 주"
          onClick={handleDecreaseWeekNumber}
        />
        <Button variant="outlined" onClick={handleResetWeekNumber}>
          오늘
        </Button>
        <IconButton
          color="primary"
          icon={<ArrowForwardIosIcon fontSize="small" />}
          title="다음 주"
          onClick={handleIncreaseWeekNumber}
        />
      </Box>
    </HeaderStyled>
  );
};

const HeaderStyled = styled(Box)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #0000001f;
  padding-bottom: 10px;
  margin-bottom: 10px;
`;
