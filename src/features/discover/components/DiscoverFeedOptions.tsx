import { Grid, Button } from '@material-ui/core';
import { DiscoverListRowControlButtons } from './DiscoverListRowControlButtons';

interface Props {
  disabledListAction: boolean;
  disabledEdit?: boolean;
  hideLoadDisplayGroup: boolean;
  onClickOpenLoadDisplayGroup: () => void;
  onClickOpenAddSections: () => void;
  onOrder: (direction: string) => () => void;
  onDeleteSections: () => void;
}

/**
 * 디스커버 피드 옵션 component
 */
export const DiscoverFeedOptions = ({
  disabledListAction,
  disabledEdit = false,
  hideLoadDisplayGroup,
  onClickOpenLoadDisplayGroup: handleClickOpenLoadDisplayGroup,
  onClickOpenAddSections: handleClickOpenAddSections,
  onOrder: handleOrder,
  onDeleteSections: handleDeleteSections,
}: Props) => {
  return (
    <Grid container justifyContent="space-between" sx={{ padding: '0 20px' }}>
      <Grid item>
        <DiscoverListRowControlButtons disabled={disabledEdit || disabledListAction} onOrder={handleOrder} />
        <Button variant="contained" disabled={disabledEdit || disabledListAction} onClick={handleDeleteSections}>
          삭제
        </Button>
      </Grid>
      <Grid item>
        {!hideLoadDisplayGroup && (
          <Button
            variant="contained"
            disabled={disabledEdit}
            color="inherit"
            sx={{ mr: '10px' }}
            onClick={handleClickOpenLoadDisplayGroup}
          >
            기존 전시 그룹 불러오기
          </Button>
        )}
        <Button variant="contained" color="inherit" disabled={disabledEdit} onClick={handleClickOpenAddSections}>
          섹션 직접 추가 하기
        </Button>
      </Grid>
    </Grid>
  );
};
