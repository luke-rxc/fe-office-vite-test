import React, { useState } from 'react';
import {
  Modal,
  Box,
  IconButton,
  Card,
  CardHeader,
  Divider,
  Typography,
  CardContent,
  TextField,
  Button,
} from '@material-ui/core';
import { makeStyles, Theme } from '@material-ui/core/styles';
import XIcon from '@assets/icons/X';
import { OptBatchTitleType, OptBatchFieldNameType } from '../../types';
interface Props {
  isOpen: boolean;
  title: OptBatchTitleType;
  fieldName: OptBatchFieldNameType;
  onClose?: () => void;
  onBatchChange: (value: string, fieldName: OptBatchFieldNameType) => void;
}

const useStyles = makeStyles((theme: Theme) => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    zIndex: 9999,
    maxHeight: 600,
    padding: theme.spacing(2, 4, 3),
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
  },
}));

export const DetailOptionModal: React.FC<Props> = ({
  isOpen,
  title,
  fieldName,
  onClose,
  onBatchChange: handleBatchChange,
}) => {
  const classes = useStyles();
  const [value, setValue] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleApply = () => {
    /** validation 숫자 */
    if (!(!isNaN(+value) && isFinite(+value))) {
      setErrorMessage('숫자로 입력해주세요.');
      return;
    }
    if (!Number.isInteger(+value)) {
      setErrorMessage('정수로 입력해주세요.');
      return;
    }
    if (+value < 0) {
      setErrorMessage('양수로 입력해주세요.');
      return;
    }
    handleBatchChange(value, fieldName);
    handleClose();
  };

  const handleChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    setValue(evt.target.value);
  };

  const handleClose = () => {
    setErrorMessage('');
    setValue('');
    onClose();
  };

  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      className={classes.modal}
      open={isOpen}
      onClose={handleClose}
    >
      <Card square className={classes.paper}>
        <CardHeader
          action={
            <IconButton onClick={handleClose}>
              <XIcon fontSize="small" />
            </IconButton>
          }
          title="옵션상품등록 일괄적용"
        />
        <Divider />
        <CardContent sx={{ display: 'flex', alignItems: 'center', my: 2 }}>
          <Typography color="textSecondary" variant="subtitle1">
            {title}
          </Typography>
          <TextField
            size="small"
            placeholder={`${title} 입력해주세요`}
            value={value}
            error={!!errorMessage}
            helperText={errorMessage ?? ''}
            onChange={handleChange}
            variant="outlined"
            sx={{ ml: 2 }}
          />
        </CardContent>
        <Divider />
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <Button color="primary" size="large" variant="contained" onClick={handleClose}>
            취소
          </Button>
          <Button color="primary" size="large" variant="contained" onClick={handleApply} sx={{ ml: 2 }}>
            일괄적용
          </Button>
        </Box>
      </Card>
    </Modal>
  );
};
