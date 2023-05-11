import { Layout } from '@components/Layout';
import { FormProvider } from 'react-hook-form';
import {
  ScheduleHeader,
  ScheduleModifyModal,
  ScheduleWeekDays,
  Section,
  LiveBaseInformation,
  ScheduleTableContentsInfo,
  UploadContents,
  ScheduleAppPushInfo,
} from '../components';

import { useScheduleModifyService, useScheduleTableService } from '../services';

export const ScheduleTableContainer = () => {
  const {
    scheduleItems,
    weekTitle,
    actions: scheduleTableActions,
    handleReloadCurrentScheduleTable,
  } = useScheduleTableService();
  const {
    formMethod,
    isOpenModal,
    scheduleTableDetailItem,
    formRef,
    bgImage,
    chromakeyImage,
    bannerImage,
    actions: {
      handleClickOpenModifySchedule,
      handleClickCloseModifySchedule,
      handleClickSubmit,
      handleSubmitModifySchedule,
    },
  } = useScheduleModifyService({ onReloadCurrentScheduleTable: handleReloadCurrentScheduleTable });

  return (
    <>
      <Layout title="편성표 관리">
        <ScheduleHeader title={weekTitle} actions={scheduleTableActions} />
        <ScheduleWeekDays scheduleItems={scheduleItems} onClickOpenModify={handleClickOpenModifySchedule} />
      </Layout>
      <ScheduleModifyModal
        open={isOpenModal && !!scheduleTableDetailItem}
        onConfirm={handleClickSubmit}
        onCloseModal={handleClickCloseModifySchedule}
      >
        <FormProvider {...formMethod}>
          <form ref={formRef} onSubmit={handleSubmitModifySchedule}>
            <Section title="라이브 콘텐츠 정보">
              <LiveBaseInformation item={scheduleTableDetailItem} />
            </Section>
            <Section title="편성 콘텐츠 정보">
              <ScheduleTableContentsInfo
                item={scheduleTableDetailItem}
                bgImagesComponent={
                  <UploadContents
                    name="bgImageId"
                    requiredMessage="백그라운드 이미지를 선택해주세요"
                    contents={bgImage.fileInfos}
                    guideText="1024x1366, JPG only"
                    onChangeUploadFile={bgImage.handleChangeUploadFile}
                    onRemoveUploadFile={bgImage.handleRemoveUploadFile}
                  />
                }
                chromakeyImagesComponent={
                  <UploadContents
                    name="chromakeyImageId"
                    requiredMessage="크로마키 이미지를 선택해주세요"
                    contents={chromakeyImage.fileInfos}
                    guideText="1024x1366, PNG only"
                    onChangeUploadFile={chromakeyImage.handleChangeUploadFile}
                    onRemoveUploadFile={chromakeyImage.handleRemoveUploadFile}
                  />
                }
                bannerImagesComponent={
                  <UploadContents
                    name="bannerImageId"
                    multiple
                    maxFiles={3}
                    contents={bannerImage.fileInfos}
                    guideText="720x720, PNG only"
                    onChangeUploadFile={bannerImage.handleChangeUploadFile}
                    onRemoveUploadFile={bannerImage.handleRemoveUploadFile}
                  />
                }
              />
            </Section>
            <Section title="개별방송 앱푸시 정보">
              <ScheduleAppPushInfo followerCount={scheduleTableDetailItem?.followerCountText} />
            </Section>
          </form>
        </FormProvider>
      </ScheduleModifyModal>
    </>
  );
};
