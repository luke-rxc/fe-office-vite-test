/* eslint-disable react-hooks/exhaustive-deps */
import toast from 'react-hot-toast';
import isEqual from 'lodash/isEqual';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useQueryClient } from 'react-query';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDialog } from '@hooks/useDialog';
import { DialogType } from '@models/DialogModel';
import { showroomCreateValidation } from '../utils';
import { ShowroomFormFields, ShowroomFormFieldOptions } from '../types';
import { ShowroomFieldDefaultValues, ShowroomTypeOptions, ShowroomStatusOptions } from '../constants';
import { useCreateShowroomMutation } from './mutations';
import {
  useBrandComboListQuery,
  useKeywordComboListQuery,
  useProviderComboListQuery,
  ShowroomListQueryKeys,
} from './queries';

interface UseShowroomCreateService {
  /** 생성 취소시 실행할 콜백 함수 */
  onCancel?: () => void;
  /** 생성 성공시 실행할 콜백 함수 */
  onSuccess?: () => void;
  /** 생성 에러시 실행할 콜백 함수 */
  onError?: () => void;
  /** 생성 성공/에러시 실행할 콜백 함수 */
  onFinally?: () => void;
}

/**
 * 쇼룸 생성 Service
 */
export const useShowroomCreateService = ({ onCancel, onSuccess, onError }: UseShowroomCreateService) => {
  const queryClient = useQueryClient();
  const dialog = useDialog();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  /**
   * 쇼룸 정보 필드
   */
  const formMethods = useForm<ShowroomFormFields>({
    defaultValues: ShowroomFieldDefaultValues,
    resolver: showroomCreateValidation(),
  });

  /**
   * 입점사ID - 브랜드를 제어하기 위한 트래킹값
   */
  const providerId = formMethods.watch('provider')?.id;

  /**
   * 쇼룸 생성 Mutation
   */
  const createMutation = useCreateShowroomMutation({});

  /**
   * 입점사 콤보 Query
   */
  const providerComboQuery = useProviderComboListQuery({});

  /**
   * 브랜드 콤보 Query
   */
  const brandComboQuery = useBrandComboListQuery({ providerId }, { enabled: !!providerId });

  /**
   * 키워드 콤보 Query
   */
  const keywordsComboQuery = useKeywordComboListQuery();

  /**
   * 쇼룸 필드 옵션
   */
  const formOptions: ShowroomFormFieldOptions = {
    type: ShowroomTypeOptions,
    status: ShowroomStatusOptions,
    brand: brandComboQuery?.data || [],
    provider: providerComboQuery?.data || [],
    keywords: keywordsComboQuery?.data || [],
  };

  /**
   * 쇼룸 등록
   */
  const handleCreate = formMethods.handleSubmit(async (values) => {
    try {
      const showroom = await createMutation.mutateAsync(values);

      // 쇼룸 목록 refetch
      queryClient.refetchQueries(ShowroomListQueryKeys.lists(), { active: true });

      // 쇼룸 생성 성공 안내 모달
      dialog.open({
        type: DialogType.CONFIRM,
        title: '쇼룸 생성 완료!',
        content: '이제 새로운 쇼룸을 관리 할 수 있습니다.',
        confirmText: '쇼룸 관리',
        closeText: '닫기',
        onConfirm: () => {
          dialog.close();
          navigate(`${pathname}/${showroom.id}`);
        },
      });

      onSuccess && onSuccess();
    } catch (error) {
      toast.error(error?.data?.message || '쇼룸 생성 실패');
      onError && onError();
    }
  });

  /**
   * 쇼룸 등록 취소
   */
  const handleCancel = () => {
    if (isEqual(formMethods.getValues(), ShowroomFieldDefaultValues)) {
      return onCancel && onCancel();
    }

    return dialog.open({
      type: DialogType.CONFIRM,
      content: '정말, 쇼룸 생성을 취소하시나요?\n작성한 내용은 저장되지 않습니다.',
      onConfirm: () => {
        onCancel && onCancel();
        dialog.close();
      },
    });
  };

  useEffect(() => {
    // 입점사필드 값이 변경된면 브랜드필드 초기화
    formMethods.setValue('brand', ShowroomFieldDefaultValues.brand);
  }, [providerId]);

  return {
    formMethods,
    formOptions,
    handler: {
      create: handleCreate,
      cancel: handleCancel,
    },
  };
};
