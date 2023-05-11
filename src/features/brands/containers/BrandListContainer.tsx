import { Layout } from '@components/Layout';
import { DetailMode } from '../constants';
import { BrandModalContainer } from './BrandModalContainer';
import { BrandListFilter, BrandList } from '../components';
import { useBrandListService } from '../services';
import { useBrandModal } from '../hooks';

export const BrandListContainer = () => {
  const {
    filter: { control, rules, handleSelectDateRange, handleSubmit, handleReset },
    isLoading,
    brandList,
    pagination,
    rowKey,
    sort,
  } = useBrandListService();

  const { open, mode, brandId, handleOpenModal, handleCloseModal, handleChangeMode } = useBrandModal();

  return (
    <Layout title="브랜드 조회/관리" locations={[{ text: '브랜드', path: '/brands' }, { text: '브랜드 조회/관리' }]}>
      <>
        <BrandListFilter
          control={control}
          rules={rules}
          onBrandCreateClick={() => handleOpenModal(DetailMode.CREATE)}
          onSubmit={handleSubmit}
          onReset={handleReset}
          onSelectDateRange={handleSelectDateRange}
        />
        <BrandList
          items={brandList}
          isLoading={isLoading}
          pagination={pagination}
          rowKey={rowKey}
          sort={sort}
          onManageClick={({ id }) => handleOpenModal(DetailMode.READ, id)}
        />
        <BrandModalContainer
          open={open}
          mode={mode}
          brandId={brandId}
          onChangeMode={handleChangeMode}
          onClose={handleCloseModal}
        />
      </>
    </Layout>
  );
};
