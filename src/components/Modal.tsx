/**
 * Modal 컴포넌트
 *
 * @link https://next.material-ui.com/components/dialogs/
 * @example
 * ```
 * <Modal
 *  title="배송등록"
 *  open={true}
 *  cancelText="닫기"
 *  width={300}
 *  height="200px"
 *  onCancel={()=>{}}
 *  onConfirm={()=>{}}>
 *  {children}
 * </Modal>
 * ```
 */
import type { FC, MouseEvent, ReactNode, KeyboardEvent, ReactNodeArray } from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { ClassNameMap } from '@material-ui/styles/withStyles';
import CloseIcon from '@material-ui/icons/Close';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogProps,
  DialogTitle,
  IconButton,
  Box,
} from '@material-ui/core';

/** 최대 & 최소 사이즈 */
type size = Pick<Props, 'width' | 'height' | 'minWidth' | 'minHeight' | 'maxWidth' | 'maxHeight'>;

const useStyles = makeStyles((theme: Theme) => ({
  /* stylelint-disable */
  root: {
    '& [role="dialog"]': {
      width: (props: size) => (typeof props.width === 'number' ? +props.width : props.width),
      minWidth: (props: size) => (typeof props.minWidth === 'number' ? +props.minWidth : props.minWidth),
      maxWidth: (props: size) => (typeof props.maxWidth === 'number' ? +props.maxWidth : props.maxWidth),
      height: (props: size) => (typeof props.height === 'number' ? +props.height : props.height),
      minHeight: (props: size) => (typeof props.minHeight === 'number' ? +props.minHeight : props.minHeight) || 400,
      maxHeight: (props: size) => (typeof props.maxHeight === 'number' ? +props.maxHeight : props.maxHeight) || 900,
      padding: theme.spacing(3),
    },
  },
  modalHeader: {
    padding: `0 0 ${theme.spacing(2)} 0`,
    borderBottom: '1px solid #999',
  },
  closeButton: {
    position: 'absolute',
    top: theme.spacing(2),
    right: theme.spacing(2),
  },
  modalContent: {
    overflowX: 'hidden',
    padding: `${theme.spacing(2)} 0`,
    '&:first-child': {
      padding: 0,
    },
  },
  modalFooter: {
    justifyContent: 'space-between',
    padding: `${theme.spacing(3)} 0 0 0`,
    borderTop: '1px solid #999',
  },
  otherActions: {
    '& button': {
      minWidth: 100,
      '&:last-child': {
        marginRight: theme.spacing(2),
      },
    },
  },
  button: {
    minWidth: 100,
    '&:last-child': {
      marginLeft: theme.spacing(2),
    },
  },
}));

export interface Props extends Omit<DialogProps, 'onClose' | 'maxWidth'> {
  title?: string;
  disabled?: boolean;
  width?: string | number;
  height?: string | number;
  minWidth?: string | number;
  maxWidth?: string | number;
  minHeight?: string | number;
  maxHeight?: string | number;
  /** 확인, 취소 버튼 외 추가가 필요한 요소 */
  otherAction?: ReactNode;
  /** 취소버튼에 표시할 내용(텍스트) */
  cancelText?: ReactNode;
  /** 확인버튼에 표시할 내용(텍스트) */
  confirmText?: ReactNode | ReactNodeArray;
  /** 취소 이벤트 핸들러 */
  onCancel?: (event: MouseEvent) => void;
  /** 확인 이벤트 핸들러 */
  onConfirm?: (event: MouseEvent) => void;
  /** 닫기 이벤트 핸들러 */
  onClose?: (event: MouseEvent | KeyboardEvent, reason?: 'backdropClick' | 'escapeKeyDown') => void;
}

export const Modal: FC<Props> = ({
  title,
  disabled,
  cancelText,
  confirmText,
  width,
  height,
  minWidth,
  minHeight,
  maxWidth,
  maxHeight,
  otherAction,
  onClose,
  onCancel,
  onConfirm,
  children,
  ...props
}) => {
  const classes: ClassNameMap = useStyles({
    width,
    height,
    minWidth,
    minHeight,
    maxWidth,
    maxHeight,
  });
  return (
    <Dialog className={classes.root} onClose={onClose} {...props}>
      {title && (
        <DialogTitle className={classes.modalHeader}>
          <span style={{ fontSize: '20px' }}>{title}</span>
          {onClose && (
            <IconButton className={classes.closeButton} onClick={onClose}>
              <CloseIcon />
            </IconButton>
          )}
        </DialogTitle>
      )}
      <DialogContent className={classes.modalContent}>{children}</DialogContent>
      {(otherAction || onCancel || onConfirm) && (
        <DialogActions className={classes.modalFooter}>
          <Box className={classes.otherActions}>{otherAction}</Box>
          <Box>
            {onCancel && (
              <Button variant="outlined" className={classes.button} onClick={onCancel}>
                {cancelText || '취소'}
              </Button>
            )}
            {onConfirm && (
              <Button variant="contained" className={classes.button} disabled={disabled} onClick={onConfirm}>
                {confirmText || '확인'}
              </Button>
            )}
          </Box>
        </DialogActions>
      )}
    </Dialog>
  );
};
