import { Layout } from '@components/Layout';
import { FormProvider } from 'react-hook-form';
import { DiscoverEditActions, DiscoverSectionDetail, DiscoverSectionTypeList, Section } from '../components';
import { useDiscoverSectionModifyService } from '../services';

interface Props {
  sectionId: string;
}

export const DiscoverSectionModifyContainer = ({ sectionId }: Props) => {
  const {
    discoverSectionItem,
    items,
    isLoading,
    pagination,
    dataUpdatedAt,
    layoutLabel,
    formMethod,
    isEdit,
    keywordComboList,
    handleSubmitSection,
    handleEdit,
    handleCancelEdit,
    handleReloadTypeList,
  } = useDiscoverSectionModifyService({ sectionId });

  return (
    <Layout title={`${layoutLabel} 상세 정보`}>
      <FormProvider {...formMethod}>
        <form onSubmit={handleSubmitSection}>
          <Section
            title="섹션 기본 정보"
            action={<DiscoverEditActions isEdit={isEdit} onEdit={handleEdit} onCancelEdit={handleCancelEdit} />}
          >
            <DiscoverSectionDetail
              discoverSectionItem={discoverSectionItem}
              isEdit={isEdit}
              keywordCombo={keywordComboList}
            />
          </Section>
        </form>
      </FormProvider>
      <DiscoverSectionTypeList
        type={discoverSectionItem?.sectionType}
        displayType={discoverSectionItem?.displayType}
        items={items}
        isLoading={isLoading}
        pagination={pagination}
        dataUpdatedAt={dataUpdatedAt}
        onReloadList={handleReloadTypeList}
      />
    </Layout>
  );
};
