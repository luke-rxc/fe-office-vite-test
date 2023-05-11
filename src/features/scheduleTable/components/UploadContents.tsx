import { FileUploader } from '@components/uploader/FileUploader';
import { Box, Button, Typography } from '@material-ui/core';
import { UploadFileInfo } from '@models/UploadModel';
import { UploadMediaWithAction } from '@components/uploader/UploadMediaWithAction';
import { VideoPlayType } from '@services/useFileUploader';
import { ScheduleModifyForm } from '../types';
import { FormControlInput } from '@components/form';

interface Props {
  name: keyof ScheduleModifyForm;
  accept?: string | Array<string>;
  contents: Array<UploadFileInfo>;
  requiredMessage?: string | false;
  multiple?: boolean;
  maxFiles?: number;
  guideText: string;
  onChangeUploadFile: (fileInfos: Array<UploadFileInfo>) => void;
  onRemoveUploadFile: (index: number) => void;
  onChangeVideoPlayType?: (id: number, value: VideoPlayType) => void;
}

/**
 * upload content component
 */
export const UploadContents = ({
  name,
  accept = 'image/*',
  contents,
  requiredMessage = false,
  multiple = false,
  maxFiles,
  guideText,
  onChangeUploadFile,
  onRemoveUploadFile,
  onChangeVideoPlayType,
}: Props) => {
  const onClickDeleteContents = (index: number) => () => onRemoveUploadFile(index);

  return (
    <>
      <FileUploader
        accept={accept}
        width={90}
        height={37}
        fileInfos={contents}
        multiple={multiple}
        maxFiles={maxFiles}
        onChange={onChangeUploadFile}
        render={() => <Button variant="outlined">UPLOAD</Button>}
        sx={{
          p: 0,
          border: 'none',
          '&:hover': {},
        }}
      />
      <Box display="flex" flexDirection="row" flexWrap="wrap">
        {(contents ?? []).map((content, index) => (
          <UploadMediaWithAction
            key={content.id ?? `file-${index}`}
            width={multiple ? 160 : 140}
            height={multiple ? 160 : 140}
            fileInfo={content}
            onDelete={onClickDeleteContents(index)}
            onSelect={onChangeVideoPlayType}
            videoPlayType={content.videoPlayType}
            videoProps={{ autoPlay: true, loop: true }}
          />
        ))}
      </Box>
      <Box>
        <Typography sx={{ mt: 2 }} color="primary" variant="subtitle2">
          이미지 업로드 가이드
        </Typography>
        <Typography sx={{ ml: 1 }} variant="caption">
          - {guideText}
        </Typography>
        <FormControlInput name={name} rules={{ required: requiredMessage }} sx={{ display: 'none' }} />
      </Box>
    </>
  );
};
