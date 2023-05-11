import { EditorCard } from '../components/base';
import { SectionList } from '../components';
import { useSectionListService } from '../services';
export const SectionListContainer = () => {
  const { items, total, page, size, isLoading, selectItemIds, handler } = useSectionListService();

  return (
    <EditorCard title="전시 섹션 관리" sx={{ mt: 4 }}>
      <SectionList
        items={items}
        total={total}
        page={page}
        size={size}
        isLoading={isLoading}
        selectedIds={selectItemIds}
        onDelete={handler.deleteSection}
        onChangePage={handler.changePage}
        onChangeSelect={handler.changeSelect}
        onChangeStatus={handler.changeStatus}
      />
    </EditorCard>
  );
};
