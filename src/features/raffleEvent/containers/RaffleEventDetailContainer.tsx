import { Layout } from '@components/Layout';
import { Box, Button } from '@material-ui/core';
import { FormProvider } from 'react-hook-form';
import {
  EditActions,
  RaffleEventBaseInformation,
  RaffleEventTimes,
  RaffleEventTimesActions,
  RaffleEventUserUploadModal,
  Section,
} from '../components';
import PlusIcon from '@assets/icons/Plus';
import { DraggableTab } from '../components/DraggableTab';

import { useRaffleEventBulkTargetUploadService, useRaffleEventDetailService } from '../services';

interface Props {
  raffleId: number;
}

export const RaffleEventDetailContainer = ({ raffleId }: Props) => {
  const {
    raffleEventDetailItem,
    liveShowroomInfo,
    showroomComboList,
    form: { formRef, formMethod, raffleEventTimesFields, onSubmitModifyRaffleEvent: handleSubmitModifyRaffleEvent },
    edit: editProps,
    uploader: uploaderProps,
    tabs: tabsProps,
    actions: actionsProps,
    selectedTimesIndex,
    ...raffleEventDetailProps
  } = useRaffleEventDetailService({ raffleId });

  const {
    isOpenModalRaffleEvent,
    onOpenRaffleEventModel: handleOpenRaffleEventModel,
    ...bulkUploadProps
  } = useRaffleEventBulkTargetUploadService({
    raffleId,
    raffleEventTimesFields,
    formMethod,
    selectedTimesIndex,
  });

  return (
    <Layout title="추첨 이벤트 상세 정보" actions={<EditActions size="large" {...editProps} />}>
      <FormProvider {...formMethod}>
        <form ref={formRef} onSubmit={handleSubmitModifyRaffleEvent}>
          <Section title="이벤트 기본 정보">
            <RaffleEventBaseInformation
              isEdit={editProps.isEdit}
              raffleEventDetailItem={raffleEventDetailItem}
              {...raffleEventDetailProps}
            />
          </Section>
          <Box display="flex" justifyContent="flex-end" p="30px 0 10px">
            <Button
              variant="contained"
              disabled={!editProps.isEdit}
              startIcon={<PlusIcon fontSize="small" />}
              onClick={actionsProps.onClickAppendTimesItem}
            >
              추첨 회차 추가
            </Button>
          </Box>
          <DraggableTab {...tabsProps} />
          <Section
            title="이벤트 조건 설정"
            sx={{
              marginTop: '0 !important',
              borderTopLeftRadius: '0 !important',
              borderTopRightRadius: '0 !important',
            }}
            action={
              <RaffleEventTimesActions
                show={raffleEventTimesFields.length > 0}
                isEdit={editProps.isEdit}
                actions={actionsProps}
              />
            }
          >
            <RaffleEventTimes
              isEdit={editProps.isEdit}
              uploaderProps={uploaderProps}
              showroomComboList={showroomComboList}
              showRoomInfoText={liveShowroomInfo?.showRoomInfoText}
              raffleEventTimesFields={raffleEventTimesFields}
              selectedTimesIndex={selectedTimesIndex}
              onClickAppendTimesItem={actionsProps.onClickAppendTimesItem}
              onOpenRaffleEventModel={handleOpenRaffleEventModel}
            />
          </Section>
        </form>
      </FormProvider>
      <RaffleEventUserUploadModal open={isOpenModalRaffleEvent} {...bulkUploadProps} />
    </Layout>
  );
};
