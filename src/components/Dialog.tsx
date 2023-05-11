/**
 * Dialog Component
 *
 * @since 210714 - draft
 * @author jeff@rxc.co.kr
 * @implements DialogProps (from @models/DialogModel)
 * @file
 *  - hook : @hooks/useDialog
 *  - context : @contexts/DialogContext
 *  - model, type : @models/DialogModel

 * @param {string} title 타이틀 {Universal}
 * @param {string} iconTitle 타이틀 icon {Universal}
 * @param {string} content 메시지 {Required}
 * @param {string(DialogType)} type ALERT, CONFIRM (Universal, 기본값은 ALERT)
 * @param {function} onConfirm type 이 CONFIRM 일 경우 Dialog 가 닫히기 전에 호출 (Universal)
 * @param {function} onClose type 이 ALERT(확인), CONFIRM(취소) 일 경우 Dialog 가 닫히기 전에 호출 (Universal)
 * @param {DialogProps} dialogProps Material-UI Dialog Props (Universal)
 *
 * @example
 *  1. Set Provider
 *  ```
 *  <DialogProvider>
      <ProductDetailContainer />
    </DialogProvider>
    ```
 *  2. 사용하려는 곳에서의 use hook
    ```
    const { open: dialogOpen, close: dialogClose } = useDialog();
    const handler = () => {
      dialogOpen({
        title: 'title',
        content: 'message',
        type: DialogType.CONFIRM,
        onClose: () => {
          console.log('close');
          dialogClose();
        },
        onConfirm: () => {
          console.log('onConfirm');
          dialogClose();
        },
      });
    }
    ```
 *
 */

import { FC } from 'react';
import { Box, Button, Container, Typography, Dialog as DialogMaterial, Divider } from '@material-ui/core';
import { DialogType, DialogProps } from '@models/DialogModel';
import { isString } from '@utils/type';

export const Dialog: FC<DialogProps> = ({
  isOpen,
  onClose: handleClose,
  onConfirm,
  title,
  iconTitle,
  type,
  content,
  closeText,
  confirmText,
  contentAlign,
  dialogProps,
}) => {
  return (
    <DialogMaterial
      onClose={() => handleClose()}
      aria-labelledby="dialog"
      transitionDuration={0}
      open={isOpen}
      {...dialogProps}
    >
      <Box
        sx={{
          backgroundColor: 'background.default',
          minHeight: '100%',
          p: 3,
        }}
      >
        <Container maxWidth="sm">
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {title && (
              <>
                <Box display="flex" alignItems="center" justifyContent="center" gap={1}>
                  {iconTitle}
                  <Typography color="textPrimary" variant="h5" textAlign="center">
                    {title}
                  </Typography>
                </Box>
                <Divider sx={{ mt: 1 }} />
              </>
            )}
            {/* content가 문자열 타입인 경우 */}
            {isString(content) && (
              <Typography align={contentAlign ?? 'center'} color="textSecondary" variant="body2" sx={{ my: 3 }}>
                {content.split(/\r\n|\n|\r/gm).map((line, index) => {
                  return (
                    <span key={`content${index}`}>
                      {line}
                      <br />
                    </span>
                  );
                })}
              </Typography>
            )}
            {/* content가 문자열외의 타입인 경우 */}
            {!isString(content) && content}
          </Box>
          {type === DialogType.ALERT ? (
            <Box>
              <Button color="primary" fullWidth size="large" variant="outlined" onClick={() => handleClose()}>
                확인
              </Button>
            </Box>
          ) : (
            <Box
              sx={{
                display: 'flex',
              }}
            >
              <Button
                color="primary"
                fullWidth
                size="large"
                sx={{ mr: 2 }}
                variant="outlined"
                onClick={() => handleClose()}
              >
                {closeText || '취소'}
              </Button>
              <Button color="primary" fullWidth size="large" variant="contained" onClick={() => onConfirm()}>
                {confirmText || '확인'}
              </Button>
            </Box>
          )}
        </Container>
      </Box>
    </DialogMaterial>
  );
};
