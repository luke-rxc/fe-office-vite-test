import React from 'react';
import { pathConfig } from '@config';
import { UploadFileInfo } from '@models/UploadModel';

interface Props {
  fileInfo: UploadFileInfo;
}

const { cdnUrl } = pathConfig;
export const BrandLogoSvg: React.FC<Props> = ({ fileInfo }) => {
  const { path } = fileInfo;
  return <img src={`${cdnUrl}/${path}`} alt="logo" width="80%" height="80%" />;
};
