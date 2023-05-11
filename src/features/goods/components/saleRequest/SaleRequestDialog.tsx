import React, { useRef } from 'react';
import styled from '@emotion/styled';
import { Box, TextField } from '@material-ui/core';
import { Dialog } from '@components/Dialog';
import { DialogType } from '@models/DialogModel';

interface Props {
  isOpen: boolean;
  title: string;
  description?: string;
  placeholder?: string;
  onConfirm: (memo: string) => void;
  onClose: () => void;
}

export const SaleRequestDialog: React.FC<Props> = ({
  isOpen,
  title,
  description,
  placeholder,
  onClose: handleClose,
  onConfirm,
}) => {
  const tfRef = useRef<HTMLInputElement>(null);
  const handleConfirm = () => {
    const memo = tfRef.current?.value ?? '';
    onConfirm(memo.trim());
  };

  return (
    <Dialog
      isOpen={isOpen}
      title={title}
      type={DialogType.CONFIRM}
      content={
        <Box sx={{ my: 3, textAlign: 'center' }}>
          <TextField multiline rows={8} fullWidth inputRef={tfRef} placeholder={placeholder} />
          {description && <DescriptionStyled>{description}</DescriptionStyled>}
        </Box>
      }
      confirmText="저장"
      onConfirm={handleConfirm}
      onClose={handleClose}
      dialogProps={{
        open: isOpen,
        fullWidth: true,
      }}
    />
  );
};

const DescriptionStyled = styled.span`
  white-space: pre-wrap;
`;
