import { Grid } from '@material-ui/core';
import {
  ShowtimeManageAuctionControl,
  ShowtimeManageAuctionList,
  GoodsAuctionBidModal,
  AuctionStatus,
} from '../components';
import { ShowtimeChatChannelModel } from '../models';
import { useShowtimeManageAuctionService } from '../services';

interface Props {
  showTimeId: number;
  chatChannelItem: ShowtimeChatChannelModel;
}

const ShowtimeManageAuctionContainer = ({ showTimeId, chatChannelItem }: Props) => {
  const {
    form,
    selectedIds,
    columns,
    auctionItems,
    lastAuctionMessage,
    isLoadingAuctionItems,
    selectedAuctionItem,
    actionInfo,
    remainingTime,
    showBidModal,
    auctionBidItem,
    bidReportTargetId,

    auctionMessages,
    showScrollBottom,
    messageAreaRef,
    messagesScrollRef,
    messageAreaWidth,
    handleLoadMorePreviousMessage,
    handleUpdateMessageScrollRef,
    toMessageScrollBottom,
    getMessageHeight,
    setMessageHeight,

    handleUpdateSelectedIds,
    handleUpdateAuctionStatus,
    handleCloseBidModal,
  } = useShowtimeManageAuctionService(showTimeId, chatChannelItem);

  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <ShowtimeManageAuctionList
            selectedIds={selectedIds}
            columns={columns}
            items={auctionItems}
            isLoading={isLoadingAuctionItems}
            onUpdateSelectedIds={handleUpdateSelectedIds}
          />
        </Grid>
        <Grid item xs={6}>
          <ShowtimeManageAuctionControl
            auctionGoods={selectedAuctionItem}
            actionInfos={actionInfo}
            lastAuctionMessage={lastAuctionMessage}
            form={form}
            onUpdateAuctionStatus={handleUpdateAuctionStatus}
          />
          <AuctionStatus
            items={auctionMessages}
            messagesAreaRef={messageAreaRef}
            messagesScrollRef={messagesScrollRef}
            messageAreaWidth={messageAreaWidth}
            showScrollBottom={showScrollBottom}
            remainingTime={remainingTime}
            isTargetBidding={selectedAuctionItem === undefined}
            bidReportTargetId={bidReportTargetId}
            getListItemHeight={getMessageHeight}
            setListItemHeight={setMessageHeight}
            toMessageScrollBottom={toMessageScrollBottom}
            onLoadMorePreviousMessage={handleLoadMorePreviousMessage}
            onUpdateMessageScrollRef={handleUpdateMessageScrollRef}
          />
        </Grid>
      </Grid>
      <GoodsAuctionBidModal showModal={showBidModal} auctionBidItem={auctionBidItem} onClose={handleCloseBidModal} />
    </>
  );
};

export default ShowtimeManageAuctionContainer;
