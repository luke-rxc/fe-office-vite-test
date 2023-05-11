import { UploadFileInfo } from '@models/UploadModel';
import { VideoPlayType } from '@services/useFileUploader';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { ModalType, OrderingType, ShowtimeKeywordUpdateType } from '../constants';
import { KeywordComboItemModel, TicketGoodsInfoModel } from '../models';
import { ReturnTypeUseShowtimeContentsAuctionGoodsService } from '../services';
import { ShowtimeContentsAuctionGoodsFormField } from '../types';
import { GoodsAuctionModal } from './GoodsAuctionModal';

export default {
  title: 'Features/Showtime/GoodsAuctionModal',
  component: GoodsAuctionModal,
} as ComponentMeta<typeof GoodsAuctionModal>;

const Template: ComponentStory<typeof GoodsAuctionModal> = (args) => {
  const [showModal, setShowModal] = useState(true);
  const [keywords, setKeywords] = useState<Array<KeywordComboItemModel>>([]);
  const [ticketGoodsInfo] = useState<TicketGoodsInfoModel>({ items: [], options: [] });

  const [primaryFileInfos, setPrimaryFileInfos] = useState([]);
  const handlePrimaryChange = (updateFiles) => {
    const updateFileInfos = primaryFileInfos.concat(updateFiles);
    setPrimaryFileInfos(updateFileInfos);
  };

  const [goodsFileInfos, setGoodsFileInfos] = useState([]);
  const handleGoodsChange = (updateFiles) => {
    const updateFileInfos = goodsFileInfos.concat(updateFiles);
    setGoodsFileInfos(updateFileInfos);
  };

  const formMethod = useForm<ShowtimeContentsAuctionGoodsFormField>();

  const handleChangeUploadFile = (type: string) => {
    return async (fileInfos: Array<UploadFileInfo>) => {
      if (type === 'primaryImages') {
        handlePrimaryChange(fileInfos);
      } else {
        handleGoodsChange(fileInfos);
      }
    };
  };

  const handleRemoveUploadFile = (type: string) => {
    return (index: number) => {
      if (type === 'primaryImages') {
        handlePrimaryChange(primaryFileInfos.filter((_, i) => i !== index));
      } else {
        handleGoodsChange(goodsFileInfos.filter((_, i) => i !== index));
      }
    };
  };

  const handleSubmit = formMethod.handleSubmit((values, event) => {
    event.preventDefault();
    window.console.log(values, event);
  });

  const handleOpen = () => {
    return () => setShowModal(true);
  };

  const handleClose = (event?: unknown, reason?: 'backdropClick' | 'escapeKeyDown') => {
    if (reason === 'backdropClick') {
      return false;
    }

    setShowModal(false);
  };

  const handleClickModifyItem = (index: number) => {
    window.console.log('handleClickModifyItem', index);
  };

  const handleClickDeleteItem = (index: number) => {
    window.console.log('handleClickDeleteItem', index);
  };

  const handleClickChangeOrdering = (index: number, orderingType: OrderingType) => {
    return () => {
      window.console.log('handleClickChangeOrdering', index, orderingType);
    };
  };

  /**
   * 키워드 업데이트
   */
  const handleUpdateKeywords = (type: ShowtimeKeywordUpdateType, keywordItem: KeywordComboItemModel) => {
    if (type === ShowtimeKeywordUpdateType.ADD) {
      !keywords.find((keyword) => keyword.value === keywordItem.value) && setKeywords([...keywords, keywordItem]);
    } else {
      setKeywords(keywords.filter((keyword) => keyword.value !== keywordItem.value));
    }
  };

  const handleChangeVideoPlayType = (id: number, videoPlayType: VideoPlayType) => {};

  const auction: ReturnTypeUseShowtimeContentsAuctionGoodsService['auction'] = {
    modalType: ModalType.CREATE,
    showModal,
    formMethod,
    ticketGoodsInfo,
    primaryImage: {
      fileInfos: primaryFileInfos,
      error: undefined,
      handleChangeUploadFile: handleChangeUploadFile('primaryImages'),
      handleRemoveUploadFile: handleRemoveUploadFile('primaryImages'),
    },
    goodsImage: {
      fileInfos: goodsFileInfos,
      error: undefined,
      handleChangeUploadFile: handleChangeUploadFile('goodsImages'),
      handleRemoveUploadFile: handleRemoveUploadFile('goodsImages'),
      handleChangeVideoPlayType,
    },
    keyword: {
      values: keywords,
      handleUpdateKeywords,
    },
    addedAuctionGoodsItems: [],
    handleClickModifyItem,
    handleClickDeleteItem,
    handleClickChangeOrdering,
    handleOpen,
    handleClose,
    handleSubmit,
  };

  return <GoodsAuctionModal {...args} auction={auction} />;
};

export const Default = Template.bind({});
Default.args = {};
