import { Layout } from '@components/Layout';
import { Box, Button } from '@material-ui/core';
import { FormProvider } from 'react-hook-form';
import {
  FormLayout,
  GoodsAuctionInfo,
  GoodsInfo,
  Section,
  ShowtimeAppPushSetting,
  ShowtimeBaseInformation,
  ShowtimeSettingInformation,
  UploadContents,
} from '../components';
import { ContentsType, ContentsTypeLabel } from '../constants';
import { useShowtimeModal } from '../hooks';
import {
  useKeywordService,
  useShowroomService,
  useShowtimeContentsAuctionGoodsService,
  useShowtimeContentsModifyService,
} from '../services';
import { ShowtimeGoodsContainer } from './ShowtimeGoodsContainer';

interface Props {
  showTimeId: number;
}

export const ShowtimeContentsModifyContainer = ({ showTimeId }: Props) => {
  const { showroomComboList } = useShowroomService();
  const { showtimeContentsItem, isLoadingShowtimeContentsItem, form, goods, auctionGoods, uploader } =
    useShowtimeContentsModifyService({
      showTimeId,
      showroomComboList,
    });
  const { auction } = useShowtimeContentsAuctionGoodsService(auctionGoods);
  const { keywordComboList } = useKeywordService();
  const modal = useShowtimeModal();

  if (isLoadingShowtimeContentsItem) {
    return (
      <Layout
        title="라이브 콘텐츠 수정"
        actions={[
          <Button key="btn-showtime-create" size="large" type="submit" color="primary" variant="contained" disabled>
            저장
          </Button>,
        ]}
      >
        <Box p={6}>조회중</Box>
      </Layout>
    );
  }

  return (
    <>
      <form onSubmit={form.handleSubmit}>
        <Layout
          title={`라이브 콘텐츠 수정 (${ContentsTypeLabel[showtimeContentsItem.contentsType]})`}
          actions={[
            <Button key="btn-showtime-create" size="large" type="submit" color="primary" variant="contained">
              저장
            </Button>,
          ]}
        >
          <>
            <FormProvider {...form.formMethod}>
              <Section title="라이브 정보">
                <ShowtimeBaseInformation
                  keywordOptions={keywordComboList}
                  showroomOptions={showroomComboList}
                  primaryImagesComponent={
                    <UploadContents
                      contents={uploader.fileInfos}
                      error={uploader.primaryImageError}
                      onChangeUploadFile={uploader.handleChangeUploadFile}
                      onRemoveUploadFile={uploader.handleRemoveUploadFile}
                    />
                  }
                  goodsStandardTypeComponent={
                    <FormLayout label="일반 상품">
                      <GoodsInfo
                        addedGoodsItems={goods.addedGoodsItems}
                        onClickDeleteGoodsItem={goods.handleRemoveGoodsItem}
                        onClickChangeOrdering={goods.handleClickChangeOrdering}
                        onOpenModal={modal.handleOpenModal}
                      />
                    </FormLayout>
                  }
                  goodsAuctionTypeComponent={
                    showtimeContentsItem.contentsType === ContentsType.AUCTION ? (
                      <FormLayout label="경매 상품">
                        <GoodsAuctionInfo auction={auction} keywordOptions={keywordComboList} />
                      </FormLayout>
                    ) : null
                  }
                />
              </Section>
              <Section title="라이브 설정">
                <ShowtimeSettingInformation />
              </Section>
              <Section title="앱푸시 메시지 설정">
                <ShowtimeAppPushSetting />
              </Section>
            </FormProvider>
            <Box p={3} display="flex" justifyContent="center" alignContent="center" bgcolor="#ffffff">
              <Button key="btn-showtime-create" size="large" type="submit" color="primary" variant="contained">
                저장
              </Button>
            </Box>
          </>
        </Layout>
      </form>
      <ShowtimeGoodsContainer goods={goods} modal={modal} />
    </>
  );
};
