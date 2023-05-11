import { useState, useRef, useCallback } from 'react';
import type { VFC } from 'react';
import { Box, Button, Divider, Grid, Paper, Typography, TextField as TextFieldMaterial } from '@material-ui/core';
import styled from '@emotion/styled';
import { env } from '@config';
import { Modal } from '@components/Modal';
import { useDialog } from '@hooks/useDialog';
import { DialogType } from '@models/DialogModel';
import { ContentDefault, ContentViewer, CreateViewer, MenuList } from '../components';
import { useContentService, useSubmitService } from '../services';
import { CONTENT_SUBMIT_TYPE } from '../constants';
import { ContentManageModel } from '../models';

/**
 * 콘텐츠 관리
 */
type ContentManagerContainerProps = {
  content: ContentManageModel;
};
export const ContentManagerContainer: VFC<ContentManagerContainerProps> = ({ content }) => {
  const {
    contentType,
    contentDefaultInfo,
    contentShowroom,
    menuList,
    availableComponentNum,
    viewId,
    handleAdd,
    handleRemove,
    handleSort,
    handleSelect,
    handleAllResetComponentMedia: handleResetAllMedia,
  } = useContentService(content); // 콘텐츠 컴포넌트 관리
  const { handleContentSubmit, getFormValue, getContentValue, isLoading } = useSubmitService(); // 저장
  const { open: dialogOpen, close: dialogClose } = useDialog();
  const [isOpenCreateView, setIsOpenCreateView] = useState(false); // 컴포넌트 생성 뷰어
  const previewDate = useRef<string>('');

  const handleFinishContent = useCallback(() => {
    dialogOpen({
      title: '편집 종료',
      content: `콘텐츠 편집을 종료하시나요?\r\n저장하지 않은 변경사항은 반영되지 않습니다.`,
      type: DialogType.CONFIRM,
      onConfirm: () => {
        window.self.opener = window.self;
        window.close();
      },
      onClose: dialogClose,
    });
  }, [dialogClose, dialogOpen]);

  const handleResetMedia = useCallback(() => {
    dialogOpen({
      title: '미디어 초기화',
      content: `각 컴포넌트에 등록된 미디어 내용을 \r\n모두 초기화할까요?`,
      type: DialogType.CONFIRM,
      onConfirm: () => {
        handleResetAllMedia();
        dialogClose();
      },
      onClose: dialogClose,
    });
  }, [dialogClose, dialogOpen, handleResetAllMedia]);

  const handleOpenPreview = useCallback(() => {
    dialogOpen({
      title: '미리보기 제공 시점 선택',
      content: (
        <Box sx={{ p: 2 }}>
          <Typography color="textPrimary" variant="subtitle1">
            날짜와 시간을 선택하면 해당 시점에서 공개 상태인 콘텐츠를 확인할 수 있습니다.
          </Typography>
          <Typography color="textPrimary" variant="caption" sx={{ mt: 1 }}>
            *날짜/시간을 미선택시 현재시간 기준
          </Typography>
          <Box sx={{ mt: 5, mb: 8, display: 'flex', justifyContent: 'center' }}>
            <TextFieldMaterial
              type="datetime-local"
              variant="outlined"
              onChange={({ target }) => (previewDate.current = target.value)}
            />
          </Box>
        </Box>
      ),
      type: DialogType.CONFIRM,
      onConfirm: () => {
        const dateTime = previewDate.current;
        handleContentSubmit(CONTENT_SUBMIT_TYPE.PREVIEW, dateTime);
        previewDate.current = '';
        dialogClose();
      },
      onClose: () => {
        previewDate.current = '';
        dialogClose();
      },
    });
  }, [dialogClose, dialogOpen, handleContentSubmit]);

  return (
    <Box sx={{ position: 'relative' }}>
      <Box sx={{ position: 'absolute', right: 0, top: -55 }}>
        <Button
          type="button"
          variant="contained"
          color="secondary"
          sx={{ ml: 2, minWidth: 100 }}
          onClick={handleFinishContent}
        >
          편집종료
        </Button>
        <Button
          type="button"
          disabled={isLoading}
          onClick={() => handleContentSubmit(CONTENT_SUBMIT_TYPE.SAVE)}
          variant="contained"
          color="primary"
          sx={{ ml: 2, minWidth: 100 }}
        >
          저장
        </Button>
      </Box>
      <Paper sx={{ minWidth: 1100 }}>
        <Grid container item sx={{ mb: 2 }}>
          <ContentDefault showroom={contentShowroom} contentDefault={contentDefaultInfo} />
        </Grid>
      </Paper>

      <Paper sx={{ minWidth: 1100, overflow: 'hidden' }}>
        <Grid container item sx={{ p: 2 }}>
          <Typography color="textPrimary" variant="h5" sx={{ mr: 'auto' }}>
            콘텐츠 크리에이터
          </Typography>
          {(env.isStage || env.isDevelopment) && (
            <>
              <Button
                type="button"
                onClick={getFormValue}
                variant="contained"
                color="primary"
                sx={{ ml: 2, minWidth: 100 }}
              >
                form value 조회
              </Button>
              <Button
                type="button"
                onClick={getContentValue}
                variant="contained"
                color="primary"
                sx={{ ml: 2, minWidth: 100 }}
              >
                context data 조회
              </Button>
            </>
          )}
          <Button
            type="button"
            disabled={isLoading}
            variant="outlined"
            sx={{ ml: 2, minWidth: 100 }}
            onClick={handleResetMedia}
          >
            미디어 초기화
          </Button>
          <Button
            type="button"
            disabled={isLoading}
            onClick={handleOpenPreview}
            variant="contained"
            sx={{ ml: 2, minWidth: 100 }}
          >
            미리보기
          </Button>
        </Grid>
        <Divider />
        <ContentLayoutStyled>
          <div className="ly-left">
            {/** 메뉴 */}
            <div className="menu-wrapper">
              <MenuList
                menuList={menuList}
                availableComponentNum={availableComponentNum}
                onAdd={() => setIsOpenCreateView(true)}
                onRemove={handleRemove}
                onSort={handleSort}
                onSelected={handleSelect}
              />
            </div>
          </div>
          <div className="ly-right">
            {/** 콘텐츠 상세 */}
            <div className="contents-wrapper">
              <ContentViewer viewId={viewId} showroom={contentShowroom} />
            </div>
          </div>
        </ContentLayoutStyled>
        {/** 컴포넌트 추가 */}
        {isOpenCreateView && (
          <Modal open title="컴포넌트 추가" minWidth="800px" height="800px" onClose={() => setIsOpenCreateView(false)}>
            <CreateViewer contentType={contentType} menuList={menuList} onAdd={handleAdd}></CreateViewer>
          </Modal>
        )}
      </Paper>
    </Box>
  );
};
const ContentLayoutStyled = styled.div`
  height: calc(95vh - 68px - 75px);
  display: flex;
  & .ly-left {
    width: 290px;
    height: 100%;
    background: #eee;
    border-right: 1px solid #e0e0e0;
  }
  & .ly-right {
    width: calc(100% - 290px);
    height: 100%;
  }
  .menu-wrapper {
    height: 100%;
  }
  .contents-wrapper {
    height: 100%;
    overflow-y: auto;
    box-sizing: border-box;
    padding: 20px;
  }
`;
