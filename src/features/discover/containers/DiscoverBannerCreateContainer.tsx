import { Layout } from '@components/Layout';
import { Button } from '@material-ui/core';
import { FormProvider } from 'react-hook-form';
import {
  BaseInformation,
  Section,
  UploadContents,
  DiscoverGoodsList,
  DiscoverBannerGoodsListHeader,
  DiscoverListOptions,
  DiscoverBannerSelectGoodsModal,
} from '../components';
import { useDiscoverBannerCreateService, useDiscoverAddGoodsService } from '../services';

export const DiscoverBannerCreateContainer = () => {
  const {
    formMethod,
    formRef,
    landingInfo,
    uploader,
    rowSelection,
    addedGoodsList,
    handleSubmitCreate,
    handleClickSubmit,
    handleClickCancel,
    handleBlurLandingRefId,
    handleUpdateGoodsList,
    handleDeleteGoodsList,
    handleOrder,
  } = useDiscoverBannerCreateService();
  const addGoodsService = useDiscoverAddGoodsService({ addedGoodsList, handleUpdateGoodsList });

  return (
    <Layout
      title="디스커버 배너 편성 생성"
      actions={[
        <Button key="banner-cancel" variant="contained" color="inherit" size="large" onClick={handleClickCancel}>
          취소
        </Button>,
        <Button
          key="banner-create"
          variant="contained"
          color="primary"
          size="large"
          onClick={handleClickSubmit}
          sx={{ ml: '5px' }}
        >
          신규 생성하기
        </Button>,
      ]}
    >
      <FormProvider {...formMethod}>
        <form ref={formRef} onSubmit={handleSubmitCreate}>
          <Section title="기본 정보">
            <BaseInformation
              primaryImagesComponent={
                <UploadContents
                  name="primaryImageFileId"
                  requiredMessage="미디어(이미지)를 선택해주세요"
                  {...uploader}
                />
              }
              landingInfo={landingInfo}
              onBlurLandingRefId={handleBlurLandingRefId}
            />
          </Section>
          <DiscoverGoodsList
            items={addedGoodsList}
            actions={
              <>
                <DiscoverBannerGoodsListHeader
                  title="전시 상품"
                  infoLabel="해당 배너에 전시할 상품 리스트를 확인 및 편집하세요 (최소 1개 / 최대 8개 까지 등록 가능)"
                  tooltipLabel="판매예정, *판매중 상태의 상품만 실제 서비스에 노출이 가능합니다."
                  totalCount={addedGoodsList.length ?? 0}
                />
                <DiscoverListOptions
                  addLabel="상품 추가"
                  disabledListAction={rowSelection.selectedRowKeys.length === 0}
                  onOrder={handleOrder}
                  onOpenAddItemModal={addGoodsService.handleOpenModal}
                  onDeleteGoods={handleDeleteGoodsList}
                />
              </>
            }
            isLoading={false}
            pagination={false}
            rowSelection={rowSelection}
          />
        </form>
      </FormProvider>
      <DiscoverBannerSelectGoodsModal {...addGoodsService} />
    </Layout>
  );
};
