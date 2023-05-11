import { UploadFileInfo } from '@models/UploadModel';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { useState } from 'react';
import { UploadContents } from './UploadContents';

export default {
  title: 'Features/Showtime/UploadContents',
  component: UploadContents,
} as ComponentMeta<typeof UploadContents>;

const Template: ComponentStory<typeof UploadContents> = (args) => {
  const [fileInfos, setFileInfos] = useState<Array<UploadFileInfo>>([]);
  const handleChange = (updateFiles) => {
    const updateFileInfos = fileInfos.concat(updateFiles);
    setFileInfos(updateFileInfos);
  };

  const onRemove = (fileIndex: number) => {
    setFileInfos((prev) => prev.filter((_, index) => index !== fileIndex));
  };

  return (
    <UploadContents {...args} contents={fileInfos} onChangeUploadFile={handleChange} onRemoveUploadFile={onRemove} />
  );
};

export const Default = Template.bind({});
Default.args = {};
