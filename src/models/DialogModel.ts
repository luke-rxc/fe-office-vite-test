import React from 'react';
import type { DialogProps as DialogMaterialProps } from '@material-ui/core';

export enum DialogType {
  ALERT = 'alert',
  CONFIRM = 'confirm',
}
export interface DialogProps {
  isOpen: boolean;
  content: string | React.ReactNode;
  title?: string;
  iconTitle?: React.ReactNode;
  type?: DialogType;
  dialogProps?: DialogMaterialProps;
  closeText?: string;
  confirmText?: string;
  contentAlign?: 'inherit' | 'right' | 'left' | 'center' | 'justify';
  onClose?: () => void;
  onConfirm?: () => void;
}
