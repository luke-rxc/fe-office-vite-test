import { useFormContext } from 'react-hook-form';
import { EnterDrawConditionType } from '../constants';
import { ReturnTypeUseRaffleEventBulkTargetUploadService, ReturnTypeUseRaffleEventDetailService } from '../services';
import { RaffleEventDetailFormField } from '../types';
import { RaffleEventDrawConditionFileUpload } from './RaffleEventDrawConditionFileUpload';
import { RaffleEventDrawConditionShowroomFollowerForm } from './RaffleEventDrawConditionShowroomFollowerForm';

export interface RaffleEventDrawConditionFormProps {
  itemIndex: number;
  isEdit: ReturnTypeUseRaffleEventDetailService['edit']['isEdit'];
  hostShowroomInfo: ReturnTypeUseRaffleEventDetailService['liveShowroomInfo']['showRoomInfoText'];
  showroomOptions: ReturnTypeUseRaffleEventDetailService['showroomComboList'];
  onOpenRaffleEventModel: ReturnTypeUseRaffleEventBulkTargetUploadService['onOpenRaffleEventModel'];
}

export const RaffleEventDrawConditionForm = ({
  itemIndex,
  onOpenRaffleEventModel: handleOpenRaffleEventModel,
  ...props
}: RaffleEventDrawConditionFormProps) => {
  const { watch } = useFormContext<RaffleEventDetailFormField>();
  const enterDrawConditionType = watch(`itemList.${itemIndex}.enterDrawConditionType`);

  switch (enterDrawConditionType) {
    case EnterDrawConditionType.SHOW_ROOM_FOLLOWER:
      return <RaffleEventDrawConditionShowroomFollowerForm itemIndex={itemIndex} {...props} />;

    case EnterDrawConditionType.FILE_UPLOAD:
      return (
        <RaffleEventDrawConditionFileUpload
          itemIndex={itemIndex}
          isEdit={props.isEdit}
          onOpenRaffleEventModel={handleOpenRaffleEventModel}
        />
      );
    default:
      return null;
  }
};
