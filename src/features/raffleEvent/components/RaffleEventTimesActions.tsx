import { Button } from '@material-ui/core';
import { ReturnTypeUseRaffleEventDetailService } from '../services';
import MinusIcon from '@assets/icons/Minus';
import ClipboardIcon from '@assets/icons/Clipboard';
import styled from '@emotion/styled';

interface Props {
  show: boolean;
  isEdit: boolean;
  actions: ReturnTypeUseRaffleEventDetailService['actions'];
}

export const RaffleEventTimesActions = ({
  show,
  isEdit,
  actions: { onClickRemoveTimesItem: handleClickRemoveTimesItem, onClickCopyTimesItem: handleClickCopyTimesItem },
}: Props) => {
  if (!show) {
    return null;
  }

  return (
    <>
      <Button
        variant="contained"
        color="secondary"
        disabled={!isEdit}
        startIcon={<MinusIcon fontSize="small" />}
        onClick={handleClickRemoveTimesItem}
      >
        삭제
      </Button>
      <CopyButtonStyled
        variant="contained"
        disabled={!isEdit}
        startIcon={<ClipboardIcon fontSize="small" />}
        onClick={handleClickCopyTimesItem}
      >
        복사
      </CopyButtonStyled>
    </>
  );
};

const CopyButtonStyled = styled(Button)`
  margin-left: 10px;
  background-color: #66bb6a;

  &:hover {
    background-color: #037a05;
  }
`;
