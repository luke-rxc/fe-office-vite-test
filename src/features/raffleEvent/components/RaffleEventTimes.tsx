import { Box, Button } from '@material-ui/core';
import { ReturnTypeUseRaffleEventBulkTargetUploadService, ReturnTypeUseRaffleEventDetailService } from '../services';
import { RaffleEventTimesItemForm } from './RaffleEventTimesItemForm';
import { UploadContents } from './UploadContents';
import PlusIcon from '@assets/icons/Plus';

interface Props {
  isEdit: ReturnTypeUseRaffleEventDetailService['edit']['isEdit'];
  uploaderProps: ReturnTypeUseRaffleEventDetailService['uploader'];
  showroomComboList: ReturnTypeUseRaffleEventDetailService['showroomComboList'];
  showRoomInfoText: ReturnTypeUseRaffleEventDetailService['liveShowroomInfo']['showRoomInfoText'];
  raffleEventTimesFields: ReturnTypeUseRaffleEventDetailService['tabs']['items'];
  selectedTimesIndex: ReturnTypeUseRaffleEventDetailService['selectedTimesIndex'];
  onClickAppendTimesItem: ReturnTypeUseRaffleEventDetailService['actions']['onClickAppendTimesItem'];
  onOpenRaffleEventModel: ReturnTypeUseRaffleEventBulkTargetUploadService['onOpenRaffleEventModel'];
}

export const RaffleEventTimes = ({
  isEdit,
  uploaderProps,
  showroomComboList,
  showRoomInfoText,
  raffleEventTimesFields,
  selectedTimesIndex,
  onClickAppendTimesItem: handleClickAppendTimesItem,
  onOpenRaffleEventModel: handleOpenRaffleEventModel,
}: Props) => {
  if (raffleEventTimesFields.length === 0) {
    return (
      <Box display="flex" justifyContent="center" p="20px 0" flexDirection="column" alignItems="center">
        <Box pb="10px">추가된 회차가 없습니다.</Box>
        <Box>
          <Button
            variant="contained"
            disabled={!isEdit}
            startIcon={<PlusIcon fontSize="small" />}
            onClick={handleClickAppendTimesItem}
          >
            추첨 회차 추가
          </Button>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ position: 'relative' }}>
      {raffleEventTimesFields.map((item, index) => {
        return (
          <RaffleEventTimesItemForm
            key={item.id}
            show={selectedTimesIndex === index}
            itemIndex={index}
            isEdit={isEdit}
            hostShowroomInfo={showRoomInfoText}
            showroomOptions={showroomComboList}
            diabledAllowDuplicateWinner={raffleEventTimesFields.length === 1}
            uploadComponent={
              <UploadContents name={`itemList.${index}.mediaId`} disabled={!isEdit} {...uploaderProps} />
            }
            onOpenRaffleEventModel={handleOpenRaffleEventModel}
          />
        );
      })}
    </Box>
  );
};
