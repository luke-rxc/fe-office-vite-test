import { TOption } from '@components/Select';
import { UploadFileInfo } from '@models/UploadModel';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { AnchorPointImageType, ModalType } from '../constants';
import { ShowtimeAnchorPointFormField } from '../types';
import { AnchorPointModal } from './AnchorPointModal';
import { GoodsAuctionModal } from './GoodsAuctionModal';

export default {
  title: 'Features/Showtime/AnchorPointModal',
  component: GoodsAuctionModal,
} as ComponentMeta<typeof GoodsAuctionModal>;

const Template: ComponentStory<typeof GoodsAuctionModal> = (args) => {
  const [showModal, setShowModal] = useState(true);

  const [fileInfos, setFileInfos] = useState([]);

  const handleChange = (updateFiles) => {
    const updateFileInfos = fileInfos.concat(updateFiles);
    setFileInfos(updateFileInfos);
  };

  const goodsOptions: Array<TOption> = [{ label: '상품명', value: 1 }];

  const formMethod = useForm<ShowtimeAnchorPointFormField>({
    defaultValues: {
      name: '',
      imageType: AnchorPointImageType.GOODS,
      goodsId: '',
      seekingPositionSeconds: ['10', '10', '11'],
    },
  });
  const { watch } = formMethod;
  const imageType = watch('imageType') as AnchorPointImageType;

  const handleChangeUploadFile = (fileInfos: Array<UploadFileInfo>) => {
    handleChange(fileInfos);
  };

  const handleRemoveUploadFile = (index: number) => {
    handleChange(fileInfos.filter((_, i) => i !== index));
  };

  const handleSubmit = formMethod.handleSubmit((values, event) => {
    event.preventDefault();
    window.console.log(values, event);
  });

  const handleClose = () => {
    setShowModal(false);
  };

  const uploadImage = {
    fileInfos: fileInfos,
    error: undefined,
    handleChangeUploadFile,
    handleRemoveUploadFile,
  };

  return (
    <AnchorPointModal
      {...args}
      modalType={ModalType.CREATE}
      formMethod={formMethod}
      showModal={showModal}
      onSubmit={handleSubmit}
      onClose={handleClose}
      goodsOptions={goodsOptions}
      imageType={imageType}
      uploadImage={uploadImage}
      activeAnchorPoint={false}
    />
  );
};

export const Default = Template.bind({});
Default.args = {};
