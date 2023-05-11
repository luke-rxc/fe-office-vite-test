import { useMemo } from 'react';
import { useParams } from 'react-router';
import { Button } from '@material-ui/core';
import { Layout } from '@components/Layout';
import { useSectionInfoService } from '../services';
import { SectionForm } from '../components';
import { GoodsListContainer } from './GoodsListContainer';

/**
 * 섹션 관리 로케이션
 */
const SectionManagementPageLocation = (showroomId: string, isCreate: boolean) => ({
  title: `쇼룸 섹션 ${isCreate ? '추가' : '상세'}`,
  locations: [
    { text: '쇼룸', path: '/showroom' },
    { text: '쇼룸 조회/관리', path: '/showroom' },
    { text: '쇼룸 조회/관리 상세', path: `/showroom/${showroomId}` },
    { text: `섹션 ${isCreate ? '추가' : '상세'}` },
  ],
});

export const SectionManagementContainer = () => {
  const { id } = useParams();
  const { mode, formMethods, formOptions, handler } = useSectionInfoService();

  const actions = useMemo(() => {
    if (mode === 'create') {
      return [
        <Button variant="contained" color="secondary" onClick={handler.cancel} children="취소" sx={{ mr: 1 }} />,
        <Button variant="contained" onClick={handler.create} children="저장" />,
      ];
    }
    if (mode === 'read') {
      return [
        <Button variant="outlined" onClick={handler.refresh} children="새로고침" sx={{ mr: 1 }} />,
        <Button variant="contained" onClick={handler.edit} children="편집" />,
      ];
    }
    if (mode === 'edit') {
      return [
        <Button variant="contained" color="secondary" onClick={handler.cancel} children="취소" sx={{ mr: 1 }} />,
        <Button variant="contained" onClick={handler.save} children="저장" />,
      ];
    }
  }, [mode, handler]);

  return (
    <Layout {...SectionManagementPageLocation(id, mode === 'create')} actions={actions}>
      <SectionForm mode={mode} formMethods={formMethods} formOptions={formOptions} />
      <GoodsListContainer isSectionDetail={true} editorMode={mode} onChangeList={handler.updateItem} />
    </Layout>
  );
};
