import { FileUploader } from '@components/uploader/FileUploader';
import { Box, Grid, Typography } from '@material-ui/core';
import { UploadFileInfo } from '@models/UploadModel';
import { UploadMediaWithAction } from '@components/uploader/UploadMediaWithAction';
import { FormControlInput } from '@components/form';
import styled from '@emotion/styled';

interface Props {
  name: string;
  accept?: string | Array<string>;
  contents: Array<UploadFileInfo>;
  requiredMessage?: string | false;
  multiple?: boolean;
  maxFiles?: number;
  disabled?: boolean;
  onChangeUploadFile: (fileInfos: Array<UploadFileInfo>) => void;
  onRemoveUploadFile: (index: number) => void;
}

/**
 * upload content component
 */
export const UploadContents = ({
  name,
  accept = 'image/jpg, image/jpeg, image/png, video/mp4',
  contents,
  requiredMessage = false,
  multiple = false,
  maxFiles,
  disabled = false,
  onChangeUploadFile,
  onRemoveUploadFile,
}: Props) => {
  const onClickDeleteContents = (index: number) => () => onRemoveUploadFile(index);

  return (
    <Grid container gap={2} alignItems="flex-end">
      <Grid item>
        {(contents ?? []).length === 0 && (
          <FileUploaderStyled
            accept={accept}
            fileInfos={contents}
            multiple={multiple}
            maxFiles={maxFiles}
            onChange={onChangeUploadFile}
            disabled={disabled}
          />
        )}
        <Box display="flex" flexDirection="row" flexWrap="wrap">
          {(contents ?? []).map((content, index) => (
            <UploadMediaWithAction
              key={content.id ?? `file-${index}`}
              width={multiple ? 160 : 140}
              height={multiple ? 160 : 140}
              fileInfo={content}
              videoProps={{ controls: true }}
              onDelete={!disabled ? onClickDeleteContents(index) : undefined}
            />
          ))}
          <Box m="5px 0 0 -10px">
            <FormControlInput name={name} rules={{ required: requiredMessage }} sx={{ display: 'none' }} />
          </Box>
        </Box>
      </Grid>
      <Grid item>
        <Typography sx={{ mt: 2 }} color="primary" variant="subtitle2">
          이미지 업로드 가이드
        </Typography>
        <Typography sx={{ ml: 1 }} variant="caption">
          - 권장 이미지 사이즈: 870x512px
        </Typography>
        <br />
        <Typography sx={{ ml: 1 }} variant="caption">
          - 이미지 파일 형식: jpg, png
        </Typography>
      </Grid>
      <Grid item>
        <Typography sx={{ mt: 2 }} color="primary" variant="subtitle2">
          동영상 업로드 가이드
        </Typography>
        <Typography sx={{ ml: 1 }} variant="caption">
          - 권장 이미지 사이즈: 870x512px
        </Typography>
        <br />
        <Typography sx={{ ml: 1 }} variant="caption">
          - 이미지 파일 형식: mp4
        </Typography>
      </Grid>
    </Grid>
  );
};

const FileUploaderStyled = styled(FileUploader)`
  > div {
    ${({ disabled, theme }) =>
      disabled &&
      `
      pointer-events: none;

      svg {
        fill: ${theme.palette.action.disabled}
      }
    `}
  }
`;
