/**
 * Media Validation
 * @description 이미지와 비디오 업로드 전에, 프론트 Validation 체크 진행
 * @method uploadMediaValidation
 * @async
 * @example
 * ```
 * const validInfo = await uploadMediaValidation({
      files: uploadFilesInfo.map((fileInfo) => fileInfo.file),
      imageRules: [{ width: 1440, height: null }],
      videoRules: [
        { width: 1080, height: 1080 },
        { width: 1080, height: 1920 },
        { width: 1920, height: 1080 },
      ],
    });

  if (!validInfo.isValid) {
    // 오류 처리
    errorMediaValidDialog(validInfo.errors);
    return;
  }
 * ```
 * @returns {UploadMediaValidReturnProps}
 *  - isValid: 한개라도 오류일시에 false 반환
 *  - errors: 오류인 파일들의 정보를 묶어 Return
 */

interface SizeValidProps {
  width: number;
  height: number;
  ruleWidth: number | null;
  ruleHeight: number | null;
  ruleMax?: MediaValidRuleMaxSizeProps;
}

interface MediaValidRuleMaxSizeProps {
  width: number | null;
  height: number | null;
}
interface MediaValidRuleSizeProps {
  width: number | null;
  height: number | null;
  max?: MediaValidRuleMaxSizeProps;
}

interface MediaValidProps {
  file: File;
  rules?: MediaValidRuleSizeProps[] | null;
}

interface MediaValidReturnProps {
  isValid: boolean;
  message: string | null;
}

interface UploadMediaValidProps {
  files: File[];
  imageRules?: MediaValidRuleSizeProps[] | null;
  videoRules?: MediaValidRuleSizeProps[] | null;
}

export interface UploadMediaValidReturnProps {
  isValid: boolean;
  errors: {
    fileName: string;
    message: string;
    isValid: boolean;
  }[];
}

const Message = {
  FILE_LOAD_ERROR: '파일 로드에 실패하였습니다. 파일을 다시 한번 확인하고 진행해주세요',
  FILE_TYPE_ERROR: '파일 형식이 맞지 않습니다',
};

const ratioValidation = ({ width, height, ruleWidth, ruleHeight }: Omit<SizeValidProps, 'ruleMax'>): boolean => {
  if (ruleWidth === null || ruleHeight === null) {
    return true;
  }

  /**
   * 업로드시, 가이드 비율에 맞게 업로드 진행했는 지 여부 체크
   * - @issue 512 x 512 일때 약간의 오차(e.g. 512 x 513) 정도는 허용해주기 위한 가이드 비율 계산
   *  - 0.007874015748031482 수치는 512 기준에서 4px 정도의 어긋나는 수치로 조절
   * - @description 가로 기준으로 세로 사이즈를 나누어 비율을 계산
   */
  /** 가이드 비율 */
  const ruleRatio = ruleWidth / ruleHeight;
  /** 실제 이미지 비율 */
  const ratio = width / height;
  /** 실제 512 기준 */
  const ratioGuide = 0.007874015748031482;
  const ratioGap = ruleRatio - ratio;
  const isRatioCheck = ratioGap === 0 || Math.abs(ratioGap) <= ratioGuide;

  return isRatioCheck;
};

const sizeValidation = ({ width, height, ruleWidth, ruleHeight, ruleMax }: SizeValidProps): boolean => {
  let isSizeCheck = false;

  if (ruleMax) {
    const { width: ruleMaxWidth, height: ruleMaxHeight } = ruleMax;
    isSizeCheck =
      (ruleWidth === null || (width >= ruleWidth && width <= ruleMaxWidth)) &&
      (ruleHeight === null || (height >= ruleHeight && height <= ruleMaxHeight));
  } else {
    isSizeCheck = (ruleWidth === null || width === ruleWidth) && (ruleHeight === null || height === ruleHeight);
  }

  if (!isSizeCheck) {
    return false;
  }

  // 비율 체크
  return ratioValidation({ width, height, ruleWidth, ruleHeight });
};

const getSizeErrorMessage = (rules: MediaValidRuleSizeProps[]): string => {
  return rules
    .map((rule) => {
      const { width: ruleWidth, height: ruleHeight, max: ruleMax } = rule ?? {};
      if (ruleMax) {
        const { width: ruleMaxWidth, height: ruleMaxHeight } = ruleMax;
        return `최소 ${ruleWidth || 'free'} x ${ruleHeight || 'free'}에서 최대 ${ruleMaxWidth || 'free'} x ${
          ruleMaxHeight || 'free'
        }`;
      }
      return `${ruleWidth || 'free'} x ${ruleHeight || 'free'}`;
    })
    .join(',  ');
};

const fileImageSizeValidation = ({ file, rules }: MediaValidProps): Promise<MediaValidReturnProps> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const image = new Image();
      image.src = e.target?.result as string;
      image.onload = () => {
        const { width, height } = image;
        if (!rules || !rules.length) {
          resolve({ isValid: true, message: null });
        } else {
          const validResults = rules.map((rule) => {
            const { width: ruleWidth, height: ruleHeight, max: ruleMax } = rule ?? {};
            return sizeValidation({ width, height, ruleWidth, ruleHeight, ruleMax });
          });

          const isValid = validResults.some((result) => result);
          const message = getSizeErrorMessage(rules);

          resolve({
            isValid,
            message: !isValid ? `${message} 사이즈로 업로드 하여야 합니다` : null,
          });
        }
      };
      image.onerror = () => {
        resolve({ isValid: false, message: Message.FILE_LOAD_ERROR });
      };
    };
    reader.onerror = () => {
      resolve({ isValid: false, message: Message.FILE_LOAD_ERROR });
    };
    reader.readAsDataURL(file);
  });
};

const fileVideoSizeValidation = ({ file, rules }: MediaValidProps): Promise<MediaValidReturnProps> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const video = document.createElement('video');
      video.src = URL.createObjectURL(file);
      video.onloadedmetadata = () => {
        const { videoWidth, videoHeight } = video;
        if (!rules || !rules.length) {
          resolve({ isValid: true, message: null });
        } else {
          const validResults = rules.map((rule) => {
            const { width: ruleWidth, height: ruleHeight } = rule ?? {};
            return sizeValidation({ width: videoWidth, height: videoHeight, ruleWidth, ruleHeight });
          });

          const isValid = validResults.some((result) => result);
          const message = getSizeErrorMessage(rules);

          resolve({
            isValid,
            message: !isValid ? `${message} 사이즈로 업로드 하여야 합니다` : null,
          });
        }
      };
      video.onerror = () => {
        resolve({ isValid: false, message: Message.FILE_LOAD_ERROR });
      };
    };
    reader.onerror = () => {
      resolve({ isValid: false, message: Message.FILE_LOAD_ERROR });
    };
    reader.readAsDataURL(file);
  });
};

export const uploadMediaValidation = async ({
  files,
  imageRules,
  videoRules,
}: UploadMediaValidProps): Promise<UploadMediaValidReturnProps> => {
  return new Promise(async (resolve) => {
    const fileInfos = files.map(async (file) => {
      if (file.type.includes('image')) {
        const result = await fileImageSizeValidation({
          file,
          rules: imageRules,
        });
        return {
          fileName: file.name,
          message: result.message,
          isValid: result.isValid,
        };
      }

      if (file.type.includes('video')) {
        const result = await fileVideoSizeValidation({
          file,
          rules: videoRules,
        });
        return {
          fileName: file.name,
          message: result.message,
          isValid: result.isValid,
        };
      }

      return {
        fileName: file.name,
        message: Message.FILE_TYPE_ERROR,
        isValid: false,
      };
    });

    const allFileInfos = await Promise.all(fileInfos);
    const errors = allFileInfos.filter((fileInfo) => !fileInfo.isValid);
    return resolve({
      isValid: !errors.length,
      errors,
    });
  });
};
