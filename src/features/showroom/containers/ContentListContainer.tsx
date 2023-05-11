import { useContentListService } from '../services';
import { EditorCard } from '../components/base';
import { ContentList, AddableContentList } from '../components';

/**
 * 편성 콘텐츠 목록 컨테이너
 */
export const ContentListContainer = () => {
  const { mode, items, exceptItems, selectItemIds, selectExceptItemIds, isLoading, handler } = useContentListService();

  return (
    <EditorCard
      title="콘텐츠 편성 관리"
      isEdit={mode === 'edit'}
      onEdit={handler.edit}
      onSave={handler.save}
      onCancel={handler.cancel}
      onRefresh={handler.refresh}
      sx={{ mt: 4 }}
    >
      <ContentList
        isEdit={mode === 'edit'}
        isLoading={isLoading}
        items={items}
        selectedIds={selectItemIds}
        onRemove={handler.remove}
        onChangeSelect={handler.changeSelectItems}
        onToTop={() => handler.order('top')}
        onToBottom={() => handler.order('bottom')}
        onToForward={() => handler.order('forward')}
        onToBackward={() => handler.order('backward')}
      />
      <br />
      <AddableContentList
        isEdit={mode === 'edit'}
        isLoading={isLoading}
        items={exceptItems}
        selectedIds={selectExceptItemIds}
        onAdd={handler.add}
        onChangeSelect={handler.changeSelectExceptItems}
      />
    </EditorCard>
  );
};
