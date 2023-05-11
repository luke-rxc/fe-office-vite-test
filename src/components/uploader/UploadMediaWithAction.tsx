import { Select, TOption } from '@components/Select';
import styled from '@emotion/styled';
import { Box, Button } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import { UploadFileType, VideoPlayType, VideoPlayTypeLabel } from '@services/useFileUploader';
import { UploadMedia, UploadMediaProps } from './UploadMedia';

/**
 * 파일업로드 프리뷰 with Action
 */
export type UploadMediaWithActionProps = UploadMediaProps & {
  onDelete?: () => void;
  onSelect?: (id: number, value: VideoPlayType) => void;
  videoPlayType?: VideoPlayType;
  width?: number;
  height?: number;
};

const MediaWrapperStyled = styled(Box)<{ width: number; height: number }>`
  position: relative;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  width: ${({ width }) => width || 120}px;
  height: ${({ height }) => height || 120}px;
  margin: 20px 10px 0 0;
  overflow: hidden;
  border: 1px solid #eee;
  border-radius: 20px;
  outline: none;
  & img {
    max-width: 100%;
    max-height: 100%;
  }
`;

const ActionWrapperStyled = styled(Box)`
  position: absolute;
`;

const DeleteWrapperStyled = styled(ActionWrapperStyled)`
  right: 5px;
  bottom: 5px;

  > button {
    min-width: 40px;
    min-height: 40px;
    border-radius: 10px;
  }
`;

const LeftWrapperStyled = styled(ActionWrapperStyled)`
  bottom: 5px;
  left: 5px;
  width: 90px;
  background-color: #fafafa;
  border-radius: 16px;
`;

const videoPlayTypeOptions: Array<TOption> = [
  { label: VideoPlayTypeLabel[VideoPlayType.ONCE], value: VideoPlayType.ONCE },
  { label: VideoPlayTypeLabel[VideoPlayType.REPEAT], value: VideoPlayType.REPEAT },
];

export const UploadMediaWithAction = (props: UploadMediaWithActionProps) => {
  const { onDelete, onSelect, videoPlayType, width, height, ...rest } = props;

  const onChange = (id: number, value: VideoPlayType) => {
    onSelect && onSelect(id, value);
  };

  return (
    <MediaWrapperStyled {...{ width, height }}>
      <UploadMedia {...rest} />
      {rest.fileInfo.fileType === UploadFileType.VIDEO && !!videoPlayType && (
        <LeftWrapperStyled>
          <Select
            name="videoPlayType"
            options={videoPlayTypeOptions}
            size="small"
            fullWidth={false}
            value={videoPlayType}
            onChange={(event) => onChange(rest.fileInfo.id, event.target.value as VideoPlayType)}
          />
        </LeftWrapperStyled>
      )}
      {onDelete && (
        <DeleteWrapperStyled>
          <Button variant="contained" color="secondary" size="small" onClick={onDelete}>
            <DeleteIcon />
          </Button>
        </DeleteWrapperStyled>
      )}
    </MediaWrapperStyled>
  );
};
