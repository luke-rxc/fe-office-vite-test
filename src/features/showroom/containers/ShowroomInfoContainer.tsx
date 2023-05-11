import { useShowroomInfoService } from '../services';
import { ShowroomForm } from '../components';
import { EditorCard } from '../components/base';

/**
 * 쇼룸 정보 조회 및 수정 컨테이너
 */
export const ShowroomInfoContainer = () => {
  const { mode, formMethods, formOptions, handler } = useShowroomInfoService();

  return (
    <EditorCard
      title="기본 정보 및 꾸미기"
      isEdit={mode === 'edit'}
      onEdit={handler.edit}
      onSave={handler.save}
      onCancel={handler.cancel}
    >
      <ShowroomForm mode={mode} formMethods={formMethods} formOptions={formOptions} />
    </EditorCard>
  );
};
