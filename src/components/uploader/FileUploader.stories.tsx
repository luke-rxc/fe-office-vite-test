import { ComponentStory, ComponentMeta } from '@storybook/react';
import { useState } from 'react';
import { FileUploader } from './FileUploader';
import { UploadMedia } from './UploadMedia';
import { Box } from '@material-ui/core';
import { UploadMediaWithAction } from './UploadMediaWithAction';

export default {
  title: 'Components/FileUploader',
  component: FileUploader,
} as ComponentMeta<typeof FileUploader>;

const Template: ComponentStory<typeof FileUploader> = (args) => {
  const [fileInfos, setFileInfos] = useState([]);
  const handleChange = (updateFiles) => {
    const updateFileInfos = fileInfos.concat(updateFiles);
    setFileInfos(updateFileInfos);
  };
  return (
    <>
      <FileUploader
        {...{
          ...args,
          fileInfos,
          onChange: handleChange,
        }}
      />
      {fileInfos &&
        fileInfos.map((fileInfo) => (
          <Box
            sx={{
              width: 120,
              height: 120,
              overflow: 'hidden',
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              border: 1,
              borderRadius: 1,
              borderColor: 'divider',
              outline: 'none',
              '& img': {
                maxWidth: '100%',
              },
              mb: 2,
            }}
          >
            <UploadMedia fileInfo={fileInfo} imageResizeWidth={192} />
          </Box>
        ))}
    </>
  );
};

export const Default = Template.bind({});
Default.args = {
  accept: 'image/*, video/*',
  multiple: true,
};

export const CustomDesign = Template.bind({});
CustomDesign.args = {
  accept: 'image/*, video/*',
  width: 150,
  height: 30,
  sx: {
    backgroundColor: '#000',
    color: '#fff',
    '&:hover': {
      backgroundColor: 'action.hover',
      color: '#000',
      cursor: 'pointer',
      opacity: 0.5,
    },
  },
  render: () => {
    return <Box>Custom ReactNode</Box>;
  },
};

const Template2: ComponentStory<typeof FileUploader> = (args) => {
  const [fileInfos, setFileInfos] = useState([]);
  const handleChange = (updateFiles) => {
    const updateFileInfos = fileInfos.concat(updateFiles);
    setFileInfos(updateFileInfos);
  };
  const handleRemove = (index) => {
    const updateFileInfos = fileInfos.filter((file, idx) => index !== idx);
    setFileInfos(updateFileInfos);
  };
  return (
    <>
      <FileUploader
        {...{
          ...args,
          fileInfos,
          onChange: handleChange,
        }}
      />
      {fileInfos &&
        fileInfos.map((fileInfo, index) => (
          <Box key={index}>
            <UploadMediaWithAction fileInfo={fileInfo} onDelete={() => handleRemove(index)} width={150} height={150} />
          </Box>
        ))}
    </>
  );
};

export const 미리보기with액션 = Template2.bind({});
미리보기with액션.args = {
  accept: 'image/*, video/*',
  width: 150,
  height: 30,
  sx: {
    backgroundColor: '#000',
    color: '#fff',
    '&:hover': {
      backgroundColor: 'action.hover',
      color: '#000',
      cursor: 'pointer',
      opacity: 0.5,
    },
  },
  render: () => {
    return <Box>Custom ReactNode</Box>;
  },
};
