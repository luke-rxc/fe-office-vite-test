import { Grid, Button } from '@material-ui/core';
import { DiscoverKeywordMappingType, DiscoverKeywordMappingTypeLabel } from '../constants';
import { DiscoverListRowControlButtons } from './DiscoverListRowControlButtons';
import { Upload } from '@material-ui/icons';

interface Props {
  addLabel?: string;
  disabledListAction: boolean;
  disabledEdit?: boolean;
  mappingType?: DiscoverKeywordMappingType;
  onOrder: (direction: string) => () => void;
  onOpenAddItemModal: () => void;
  onDeleteGoods: () => void;
  onOpenBulkMappingModal?: () => void;
}

/**
 * 디스커버 옵션 component
 */
export const DiscoverListOptions = ({
  addLabel = '추가',
  disabledListAction,
  disabledEdit = false,
  mappingType,
  onOpenAddItemModal: handleOpenAddItemModal,
  onOpenBulkMappingModal: handleOpenBulkMappingModal,
  onOrder: handleOrder,
  onDeleteGoods: handleDeleteGoods,
}: Props) => {
  return (
    <Grid container justifyContent="space-between" alignItems="center" sx={{ mb: '10px' }}>
      <Grid item>
        <DiscoverListRowControlButtons disabled={disabledEdit || disabledListAction} onOrder={handleOrder} />
        <Button variant="outlined" disabled={disabledEdit || disabledListAction} onClick={handleDeleteGoods}>
          삭제
        </Button>
      </Grid>
      <Grid item>
        {handleOpenBulkMappingModal && (
          <Button
            variant="outlined"
            onClick={handleOpenBulkMappingModal}
            disabled={disabledEdit}
            startIcon={<Upload />}
            sx={{ mr: '10px' }}
          >
            키워드 맵핑 {DiscoverKeywordMappingTypeLabel[mappingType]} 일괄추가 엑셀 업로드
          </Button>
        )}
        <Button variant="outlined" disabled={disabledEdit} onClick={handleOpenAddItemModal}>
          {addLabel}
        </Button>
      </Grid>
    </Grid>
  );
};
