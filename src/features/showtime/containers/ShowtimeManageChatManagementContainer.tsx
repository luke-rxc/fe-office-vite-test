import { Grid } from '@material-ui/core';
import { ChatStatus, ChatUserManagement, ShowroomSubscribeModal } from '../components/chatManagement';
import { NoticeModal } from '../components/chatManagement/NoticeModal';
import { ShowtimeChatChannelModel, ShowtimeContentsItemModel } from '../models';
import {
  useShowtimeManageChatManagementService,
  useShowtimeManageChatManagementModalService,
  useShowtimeManageChatManagementShowroomSubscribeModalService,
  useShowroomService,
} from '../services';

interface Props {
  showTimeId: number;
  chatChannelItem: ShowtimeChatChannelModel;
  showtimeContentsItem: ShowtimeContentsItemModel;
}

const ShowtimeManageChatManagementContainer = ({ showTimeId, chatChannelItem, showtimeContentsItem }: Props) => {
  const { showroomComboList } = useShowroomService();
  const {
    searchFormMethod,
    messageFormMethod,
    messages,
    noticeMessage,
    adminMessages,
    banedUserList,
    mutedUserList,
    isLoadingMessage,
    useMessageSearch,
    setUnbanUser,
    setUnmuteUser,
    messagesRef,
    messageAreaRef,
    messagesScrollRef,
    messageAreaWidth,
    showScrollBottom,
    handleClickSend,
    handleClickSearch,
    handleClickSearchClear,
    getMenuItems,
    getMessageHeight,
    setMessageHeight,
    handleUpdateMessageScrollRef,
    handleLoadMorePreviousMessage,
    toMessageScrollBottom,
    // usedAutoAddTempUserMessage,
    // handleUpdateUsedAutoAddTempUserMessage,
    handleToggleUseSearch,
    handleSetNicknameToMessageField,
  } = useShowtimeManageChatManagementService({ chatChannelItem, showroomComboList });

  const {
    formRef,
    showModal,
    formMethodNotice,
    messageStorage,
    handleOpenNoticeModal,
    handleCloseNoticeModal,
    handleSubmitNotice,
    handleClickNoticeMessageDeleteAction,
    handleClickSubmit,
    handleClickUseMessage,
    handleClickDeleteMessage,
    handleClickSaveMessage,
  } = useShowtimeManageChatManagementModalService(showTimeId);

  const { handleClickShowroomSubscribe, ...showroomSubscribeModal } =
    useShowtimeManageChatManagementShowroomSubscribeModalService({
      showTimeId,
      showtimeContentsItem,
      showroomComboList,
    });

  return (
    <>
      <Grid container spacing={2}>
        <Grid item lg={7} md={12} sm={12} xs={12}>
          <ChatStatus
            items={messages}
            isLoadingMessage={isLoadingMessage}
            useMessageSearch={useMessageSearch}
            temporaryItems={adminMessages}
            noticeMessage={noticeMessage}
            searchFormMethod={searchFormMethod}
            messageFormMethod={messageFormMethod}
            messagesRef={messagesRef}
            messagesAreaRef={messageAreaRef}
            messageAreaWidth={messageAreaWidth}
            messagesScrollRef={messagesScrollRef}
            showScrollBottom={showScrollBottom}
            onClickSearch={handleClickSearch}
            onClickSearchClear={handleClickSearchClear}
            onClickSend={handleClickSend}
            onClickOpenNoticeModal={handleOpenNoticeModal}
            getMenuItems={getMenuItems}
            onClickNoticeMessageDeleteAction={handleClickNoticeMessageDeleteAction}
            getListItemHeight={getMessageHeight}
            setListItemHeight={setMessageHeight}
            onUpdateMessageScrollRef={handleUpdateMessageScrollRef}
            onLoadMorePreviousMessage={handleLoadMorePreviousMessage}
            toMessageScrollBottom={toMessageScrollBottom}
            onToggleUseSearch={handleToggleUseSearch}
            onSetNicknameToMessageField={handleSetNicknameToMessageField}
            onClickShowroomSubscribe={handleClickShowroomSubscribe}
          />
        </Grid>
        <Grid item lg={5} md={12} sm={12} xs={12} display="flex" flexDirection="column">
          <ChatUserManagement
            muteItems={mutedUserList}
            banItems={banedUserList}
            onClickUnban={setUnbanUser}
            onClickUnMute={setUnmuteUser}
          />
        </Grid>
      </Grid>
      <NoticeModal
        formRef={formRef}
        showModal={showModal}
        messageStorage={messageStorage}
        formMethod={formMethodNotice}
        handleClose={handleCloseNoticeModal}
        handleSubmit={handleSubmitNotice}
        handleClickSubmit={handleClickSubmit}
        handleClickUseMessage={handleClickUseMessage}
        handleClickDeleteMessage={handleClickDeleteMessage}
        handleClickSaveMessage={handleClickSaveMessage}
      />

      <ShowroomSubscribeModal {...showroomSubscribeModal} />
    </>
  );
};

export default ShowtimeManageChatManagementContainer;
