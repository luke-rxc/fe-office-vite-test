import { Grid } from '@material-ui/core';
import { FormEventHandler } from 'react';
import { ControlledTextarea, LabelWrapper } from '.';
import { MainBannerDetailFormFields, MainFeedDetailFormFields } from '../types';

interface Props {
  disabled?: boolean;
  currentLength: number;
  maxLength: number;
  maxRows: number;
}

export const TitleTextarea = ({ disabled = false, currentLength, maxLength, maxRows }: Props) => {
  /**
   * 줄 수 제한에 맞추어, 사용자 입력 또한 제한
   */
  const handleInput: FormEventHandler<HTMLTextAreaElement> = (event) => {
    const target = event.target as HTMLTextAreaElement;
    const match = target.value.match(/\n/g) || [];

    if (match.length >= maxRows) {
      target.value = target.value.slice(0, -1);
    }
  };

  const validateLength = (value: string) => {
    if (value.replace(/\n/g, '').length > maxLength) {
      return `최대 ${maxLength}까지 입력 가능합니다`;
    }

    return null;
  };

  return (
    <LabelWrapper label="제목" required>
      <Grid container alignItems="flex-end">
        <Grid item xs={11}>
          <ControlledTextarea<MainBannerDetailFormFields | MainFeedDetailFormFields>
            name="title"
            width="100%"
            placeholder={`최대 ${maxRows}줄. 줄 당 ${maxLength / maxRows}자 이내 (띄어쓰기 포함).\n줄바꿈 가능`}
            disabled={disabled}
            rules={{ required: '제목을 입력하세요', validate: validateLength }}
            maxRows={maxRows}
            minRows={maxRows}
            onInput={handleInput}
            style={{ resize: 'none' }}
          />
        </Grid>

        <Grid item xs={1} pl="1rem" sx={{ fontSize: '.9rem', color: 'gray' }}>
          {currentLength}/{maxLength}
        </Grid>
      </Grid>
    </LabelWrapper>
  );
};
