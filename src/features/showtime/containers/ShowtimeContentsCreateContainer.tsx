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
  useShowtimeContentsCreateService,
} from '../services';
import { ShowtimeGoodsContainer } from './ShowtimeGoodsContainer';

interface Props {
  contentsType: ContentsType;
}

export const ShowtimeContentsCreateContainer = ({ contentsType }: Props) => {
  const { form, goods, auctionGoods, uploader } = useShowtimeContentsCreateService(contentsType);
  const { auction } = useShowtimeContentsAuctionGoodsService(auctionGoods);
  const { showroomComboList } = useShowroomService();
  const { keywordComboList } = useKeywordService();
  const modal = useShowtimeModal();

  return (
    <>
      <form onSubmit={form.handleSubmit}>
        <Layout
          title={`라이브 콘텐츠 등록 (${ContentsTypeLabel[contentsType]})`}
          actions={[
            <Button key="btn-showtime-create" size="large" type="submit" color="primary" variant="contained">
              등록
            </Button>,
          ]}
        >
          <>
            <FormProvider {...form.formMethod}>
              <Section title="라이브 정보">
                <ShowtimeBaseInformation
                  showroomOptions={showroomComboList}
                  keywordOptions={keywordComboList}
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
                    contentsType === ContentsType.AUCTION ? (
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
            <Box
              p={3}
              display="flex"
              justifyContent="center"
              alignContent="center"
              sx={{ backgroundColor: 'background.paper' }}
            >
              <Button key="btn-showtime-create" size="large" type="submit" color="primary" variant="contained">
                등록
              </Button>
            </Box>
          </>
        </Layout>
      </form>
      <ShowtimeGoodsContainer goods={goods} modal={modal} />
    </>
  );
};
