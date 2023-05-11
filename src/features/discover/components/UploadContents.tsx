import { FileUploader } from '@components/uploader/FileUploader';
import { Box, Grid, Typography } from '@material-ui/core';
import { UploadMediaWithAction } from '@components/uploader/UploadMediaWithAction';
import { FormControlInput } from '@components/form';
import { DiscoverBannerFormField } from '../types';
import { ReturnTypeUseImageUploader } from '../hooks';

interface Props extends Omit<ReturnTypeUseImageUploader, 'onUpdateFileInfo'> {
  name: keyof DiscoverBannerFormField;
  accept?: string | Array<string>;
  requiredMessage?: string | false;
  multiple?: boolean;
  maxFiles?: number;
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
  onChangeUploadFile,
  onRemoveUploadFile,
}: Props) => {
  const onClickDeleteContents = (index: number) => () => onRemoveUploadFile(index);

  return (
    <Grid container gap={2} alignItems="flex-end">
      <Grid item>
        {(contents ?? []).length === 0 && (
          <FileUploader
            accept={accept}
            fileInfos={contents}
            multiple={multiple}
            maxFiles={maxFiles}
            onChange={onChangeUploadFile}
          />
        )}
        <Box display="flex" flexDirection="row" flexWrap="wrap">
          {(contents ?? []).map((content, index) => (
            <UploadMediaWithAction
              key={content.id ?? `file-${index}`}
              width={multiple ? 160 : 140}
              height={multiple ? 160 : 140}
              fileInfo={content}
              onDelete={onClickDeleteContents(index)}
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
          - 권장 이미지 사이즈: 1280 x 720 px
        </Typography>
        <br />
        <Typography sx={{ ml: 1 }} variant="caption">
          - 이미지 파일 형식: jpg
        </Typography>
      </Grid>
    </Grid>
  );
};
