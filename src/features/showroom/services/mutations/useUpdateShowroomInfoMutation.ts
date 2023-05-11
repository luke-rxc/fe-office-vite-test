import has from 'lodash/has';
import filter from 'lodash/filter';
import { UseMutationOptions } from 'react-query';
import { ErrorModel } from '@utils/api/createAxios';
import { useMutation } from '@hooks/useMutation';
import { default as useLoading } from '@hooks/useLoading';
import { useFileUploader, UploadDomainType } from '@services/useFileUploader';
import { Awaited, ShowroomFormFields } from '../../types';
import { updateShowroomInfo, UpdateShowroomInfoParams } from '../../apis';
import { toShowroomInfoUpdateParamsModel } from '../../models';

type MutationParams = ShowroomFormFields & Pick<UpdateShowroomInfoParams, 'showroomId'>;

type MutationResponse = Awaited<ReturnType<typeof updateShowroomInfo>>;

type UseUpdateShowroomInfoMutationOptions = UseMutationOptions<MutationResponse, ErrorModel, MutationParams> & {
  hideSpinner?: boolean;
};

/**
 * 쇼룸 생성 Mutation
 */
export const useUpdateShowroomInfoMutation = ({
  onMutate,
  onSettled,
  hideSpinner,
  ...options
}: UseUpdateShowroomInfoMutationOptions) => {
  const { showLoading, hideLoading } = useLoading();
  const { handleUpload } = useFileUploader({ domainType: UploadDomainType.SHOWROOM });

  return useMutation<MutationResponse, ErrorModel, MutationParams>(
    async ({ showroomId, primaryImage: [primary], coverMedia: [cover], lottieImage: [lottie], ...params }) => {
      /**
       * 업로드 가능한 파일만 필터링한 데이터 목록
       *
       * 파일정보객체에 file 프로퍼티가 있는 경우만 업로드 가능하며,
       * file 프로퍼티가 없는 케이스는 이미 S3에 등록된 소스거나 파일 자체가 없는 케이스입니다.
       */
      const uploadableFiles = filter([primary, cover, lottie], (fileInfo) => has(fileInfo, 'file'));

      /**
       *  S3에 업로드 > S3에 업로드된 파일 데이터
       */
      const files = await handleUpload(uploadableFiles);

      /**
       * 등록할 대표 이미지
       */
      const primaryImage = has(primary, 'file') ? files[0] : primary;

      /**
       * 등록할 커버 이미지/비디오
       */
      const coverMedia = has(cover, 'file') ? files[1] || files[0] : cover;

      /**
       * 등록할 로띠 이미지
       */
      const lottieImage = has(lottie, 'file') ? files[2] || files[1] || files[0] : lottie;

      // 쇼룸 수정 요청
      return await updateShowroomInfo(
        toShowroomInfoUpdateParamsModel(showroomId, { ...params, primaryImage, coverMedia, lottieImage }),
      );
    },
    {
      onMutate: (...rest) => {
        !hideSpinner && showLoading();
        onMutate && onMutate(...rest);
      },
      onSettled: (...rest) => {
        !hideSpinner && hideLoading();
        onSettled && onSettled(...rest);
      },
      ...options,
    },
  );
};
