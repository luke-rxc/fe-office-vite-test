import { useCallback, useState } from 'react';
import type { VFC } from 'react';
import { FormProvider } from 'react-hook-form';
import { Box } from '@material-ui/core';
import { Modal } from '@components/Modal';
import { useDialog } from '@hooks/useDialog';
import { DialogType } from '@models/DialogModel';
import { LiveList, LiveSearchForm } from '../components';
import { useLiveListService, useShowroomService } from '../services';
import { LiveModel, ContentShowroomModel } from '../models';
import { LIVE_MAX_NUM } from '../constants';

/**
 * 라이브 콘텐츠 검색
 */
export type LiveListContainerProps = {
  showroom: ContentShowroomModel;
  onConfirm: (liveList: LiveModel[]) => void;
  onCancel: () => void;
};
export const LiveListContainer: VFC<LiveListContainerProps> = ({ showroom, onConfirm, onCancel }) => {
  const { showroomComboList } = useShowroomService(); // 쇼룸 리스트
  const { formMethod, liveList, isLoading, pagination, handleSearch, handleReset } = useLiveListService(); // 라이브 검색
  const { open: dialogOpen, close: dialogClose } = useDialog();
  const [selectedRowKeys, setSelectedRowKeys] = useState<number[]>([]);

  const handleRowKeyChange = useCallback((list: number[]) => {
    setSelectedRowKeys(list);
  }, []);

  /**
   * 편성 등록
   */
  const handleRegister = () => {
    if (selectedRowKeys.length !== LIVE_MAX_NUM) {
      dialogOpen({
        title: `라이브 등록`,
        content: `라이브 콘텐츠는 ${LIVE_MAX_NUM}개 등록 가능합니다.`,
        type: DialogType.ALERT,
        onClose: () => {
          dialogClose();
        },
      });
      setSelectedRowKeys([]);
      return;
    }
    // 선택된 라이브 편성 등록
    const newList = liveList.filter((live) => selectedRowKeys.includes(live.id));
    onConfirm(newList);
  };

  return (
    <Modal
      title="라이브 콘텐츠 조회 등록"
      open={true}
      width={1200}
      minHeight={1000}
      maxWidth="initial"
      cancelText="닫기"
      confirmText="편성 등록"
      onConfirm={handleRegister}
      onCancel={onCancel}
      onClose={onCancel}
    >
      <FormProvider {...formMethod}>
        <LiveSearchForm
          showroom={showroom}
          showroomOptions={showroomComboList}
          onSearch={handleSearch}
          onReset={handleReset}
        />
      </FormProvider>
      <Box sx={{ mt: 4 }}>
        <LiveList
          items={liveList}
          isLoading={isLoading}
          pagination={pagination}
          rowKey="id"
          rowSelection={{
            selectedRowKeys,
            onChange: handleRowKeyChange,
          }}
        />
      </Box>
    </Modal>
  );
};
