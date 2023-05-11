import { IconButton } from '@material-ui/core';
import CheckIcon from '@material-ui/icons/Check';
import { useMemo, useState } from 'react';
import { ControlledText, LabelWrapper } from '.';
import { BannerMainLandingTypeOption, FeedMainLandingTypeOption } from '../constants';
import { UseMainFeedDetailService } from '../services';
import { UseMainBannerDetailService } from '../services/useMainBannerDetailService';
import { MainBannerDetailFormFields, MainFeedDetailFormFields } from '../types';

type LandingType = BannerMainLandingTypeOption | FeedMainLandingTypeOption;
type LandingInfo = UseMainBannerDetailService['landingInfo'] | UseMainFeedDetailService['landingInfo'];

interface Props {
  disabled?: boolean;
  landingType: LandingType;
  landingInfo: LandingInfo;
  getLandingTypeLabel: (type: string) => string;
}

export const LandingIdChecker = ({ disabled = false, landingType, landingInfo, getLandingTypeLabel }: Props) => {
  /**
   * 랜딩 정보에 대한 입력 dirty 여부
   * (체크 api 호출 후에는 다시 dirty 여부를 리셋하기 위해 form의 isDirty 대신 따로 사용)
   */
  const [isDirty, setIsDirty] = useState(false);

  const placeholder = useMemo(
    () => `${landingType.label} ID를 입력 후 우측 체크 버튼을 누르세요.`,
    [landingType.label],
  );

  /**
   * 조회한 랜딩 정보에 대한 값을 정제
   */
  const displayLandingInfo = useMemo(() => {
    const { value: info, status } = landingInfo;

    if (isDirty || (status === 'idle' && !info)) return '';
    if (!info || status === 'error') return '랜딩 상세 정보를 찾을 수 없습니다.';
    if (status === 'loading') return '상세 정보 확인 로딩중..';

    return `[${getLandingTypeLabel(info.type)}] ${info.name}${
      info.showRoomName ? ` (쇼룸: ${info.showRoomName})` : ''
    }`;
  }, [landingInfo, isDirty, getLandingTypeLabel]);

  const handleCheck = () => {
    setIsDirty(false);
    landingInfo.refetchLandingInfo();
  };

  const handleChange = () => {
    setIsDirty(true);
  };

  return (
    <LabelWrapper label="랜딩 상세 정보" required>
      <ControlledText<MainBannerDetailFormFields | MainFeedDetailFormFields>
        label="랜딩 상세 정보"
        name="landingId"
        type="number"
        InputProps={{
          endAdornment: (
            <IconButton onClick={handleCheck} disabled={disabled}>
              <CheckIcon />
            </IconButton>
          ),
        }}
        sx={{
          width: '100%',
        }}
        placeholder={placeholder}
        disabled={disabled}
        error={landingInfo.status === 'error'}
        helperText={displayLandingInfo}
        onChangeCapture={handleChange}
        onBlurCapture={handleCheck}
        rules={{ required: '랜딩 상세 정보를 입력하세요' }}
      />
    </LabelWrapper>
  );
};
