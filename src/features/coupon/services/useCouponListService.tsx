import { useDialog } from '@hooks/useDialog';
import { useMutation } from '@hooks/useMutation';
import { useQuery } from '@hooks/useQuery';
import { useQueryState } from '@hooks/useQueryState';
import { DialogType } from '@models/DialogModel';
import { PaginationResponse } from '@schemas/PaginationSchema';
import { excelExport, excelImport } from '@utils/excel';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useQueryClient } from 'react-query';
import { useNavigate } from 'react-router-dom';
import {
  deleteCouponItem,
  getCoupons,
  postCopyCouponItem,
  postUploadEventCoupon,
  toggleActiveCouponItem,
} from '../apis';
import { couponListQueryKey, EventCouponExcelCode, eventCouponExcelHeader } from '../constants';
import {
  CouponModel,
  toCouponEventUploadModel,
  toCouponListFormFieldByQueryState,
  toCouponListSearchParamsByQueryState,
  toCouponModelList,
} from '../models';
import {
  CouponActiveParams,
  CouponExcelUploadItem,
  CouponListFormValue,
  CouponListQueryState,
  EventCouponUploadParams,
} from '../types';

export type UseCouponListService = ReturnType<typeof useCouponListService>;

const defaultFormValues: CouponListFormValue = {
  name: '',
};

export const useCouponListService = () => {
  const navigate = useNavigate();
  const { queryState, updateQueryState } = useQueryState<CouponListQueryState>();
  const queryClient = useQueryClient();
  const { open: dialogOpen, close: dialogClose } = useDialog();

  const formMethod = useForm<CouponListFormValue>({
    defaultValues: defaultFormValues,
  });

  const { handleSubmit, reset, getValues } = formMethod;

  useEffect(() => {
    const formField = toCouponListFormFieldByQueryState(queryState, defaultFormValues);
    reset(formField);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryState]);

  const { data: couponResponse, isLoading } = useQuery(
    [couponListQueryKey, toCouponListSearchParamsByQueryState(queryState, defaultFormValues)],
    () => getCoupons(toCouponListSearchParamsByQueryState(queryState, defaultFormValues)),
    {
      select: (data): PaginationResponse<CouponModel> => {
        return {
          ...data,
          content: toCouponModelList(data.content),
        };
      },
      cacheTime: 10 * 1000,
    },
  );

  /**
   * 쿠폰 활성화/비활성화
   */
  const { mutateAsync: toggleActiveCoupon } = useMutation(
    (params: CouponActiveParams) => toggleActiveCouponItem(params),
    {
      onError: (error, params) => {
        dialogOpen({
          content: `쿠폰 ${params.isActive ? '활성화' : '비활성화'} 처리중 문제가 발생하였습니다.\r\n(${
            error.data.message
          })`,
          type: DialogType.ALERT,
        });
      },
    },
  );

  /**
   * 쿠폰 삭제
   */
  const { mutateAsync: deleteCoupon } = useMutation((couponId: number) => deleteCouponItem(couponId), {
    onError: (error, params) => {
      dialogOpen({
        content: `쿠폰 삭제 처리중 문제가 발생하였습니다.\r\n(${error.data.message})`,
        type: DialogType.ALERT,
      });
    },
  });

  /**
   * 이벤트 쿠폰 업로드
   */
  const { mutateAsync: uploadEventCoupon } = useMutation(
    (params: EventCouponUploadParams) => postUploadEventCoupon(params),
    {
      onError: (error, params) => {
        dialogOpen({
          content: `이벤트 쿠폰 업로드중 문제가 발생하였습니다.\r\n(${error.data.message})`,
          type: DialogType.ALERT,
        });
      },
    },
  );

  /**
   * 쿠폰 복사
   */
  const { mutateAsync: copyCouponItem } = useMutation((couponId: number) => postCopyCouponItem(couponId), {
    onError: (error, params) => {
      dialogOpen({
        content: `쿠폰 복사중 문제가 발생하였습니다.\r\n(${error.data.message})`,
        type: DialogType.ALERT,
      });
    },
  });

  /**
   * 페이지 번호 및 페이지수 변경시
   */
  const handleChangePagination = (page: number, limit: number) => {
    updateQueryState({
      ...queryState,
      page: page.toString(),
      size: limit.toString(),
    });
  };

  /**
   * onSubmit
   */
  const onSubmit = handleSubmit((values) => {
    updateQueryState({
      ...queryState,
      ...values,
      page: '1',
    });
  });

  /**
   * 폼 초기화
   */
  const onClickResetForm = () => {
    reset({ name: '' });
    updateQueryState({
      ...queryState,
      ...getValues(),
    });
  };

  /**
   * 쿠폰 활성화/비활성화 실행
   */
  const executeToggleActiveCoupon = async (couponId: number, isActive: boolean) => {
    await toggleActiveCoupon({ couponId, isActive });
    const updateCouponItems = couponResponse?.content.map((content) => {
      if (content.id === couponId) {
        return {
          ...content,
          isActive,
        };
      }
      return content;
    });
    queryClient.setQueriesData(
      [couponListQueryKey, toCouponListSearchParamsByQueryState(queryState, defaultFormValues)],
      {
        ...couponResponse,
        content: updateCouponItems,
      },
    );

    dialogOpen({
      content: `쿠폰이 ${isActive ? '활성화' : '비활성화'} 처리 되었습니다.`,
      type: DialogType.ALERT,
    });
  };

  /**
   * 쿠폰 활성화/비활성화 click event
   */
  const handleClickToggleActiveCoupon = ({ id: couponId, name, isActive }: CouponModel) => {
    return () => {
      const active = !isActive;

      dialogOpen({
        type: DialogType.CONFIRM,
        title: '확인',
        content: `해당 쿠폰을 ${active ? '활성화' : '비활성화'} 처리하시겠습니까?\r\n(${name})`,
        onConfirm: () => executeToggleActiveCoupon(couponId, active),
      });
    };
  };

  /**
   * 쿠폰 삭제 click event
   */
  const handleClickDeleteCoupon = ({ id: couponId, name: couponName }: CouponModel) => {
    return () => {
      dialogOpen({
        type: DialogType.CONFIRM,
        title: '확인',
        content: `해당 쿠폰을 삭제하시겠습니까?\r\n(${couponName})`,
        onConfirm: async () => {
          await deleteCoupon(couponId);

          dialogOpen({
            content: `쿠폰이 삭제 되었습니다.`,
            type: DialogType.ALERT,
          });

          queryClient.invalidateQueries([
            couponListQueryKey,
            toCouponListSearchParamsByQueryState(queryState, defaultFormValues),
          ]);
        },
      });
    };
  };

  const getItemKeyCode = () => {
    return Object.keys(EventCouponExcelCode).reduce((target, item) => {
      target[EventCouponExcelCode[item]] = item;

      return target;
    }, {});
  };

  /**
   * 이벤트쿠폰 excel 파일 등록
   */
  const handleUploadEventCouponExcelData = (couponId: number) => {
    return async (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      const uploadedFile = (await excelImport({
        file: files[0],
      })) as Array<Record<string, string>>;
      e.target.value = '';

      const itemKeyCode = getItemKeyCode();

      const userIdList = uploadedFile
        .map<CouponExcelUploadItem>((item) => {
          return Object.keys(item).reduce<CouponExcelUploadItem>((target, key) => {
            if (itemKeyCode[key]) {
              target[itemKeyCode[key]] = item[key];
            }

            return target;
          }, {} as CouponExcelUploadItem);
        })
        .map((item) => item.userId);

      if (userIdList.length === 0) {
        dialogOpen({
          type: DialogType.ALERT,
          title: '알림',
          content: '사용자 정보가 없습니다.\r\n업로드 엑셀파일을 확인해주세요.',
        });
        return;
      }

      const uploadCouponResponse = await uploadEventCoupon({ couponId, userIds: userIdList });
      const uploadResult = toCouponEventUploadModel(uploadCouponResponse);

      const errorMessages =
        uploadResult.errorMessages.length > 0
          ? uploadResult.errorMessages
              .map((item) => {
                return `사용자ID: ${item.userId} - ${item.message}`;
              })
              .join('\r\n')
          : null;

      const resultMessage =
        uploadResult.insertedCount > 0
          ? '이벤트 쿠폰 업로드가 완료되었습니다.'
          : '이벤트 쿠폰 업로드에 문제가 발생하였습니다.';

      dialogOpen({
        type: DialogType.ALERT,
        title: '알림',
        content: `${resultMessage} ${
          errorMessages ? `(성공: ${uploadResult.insertedCount})\r\n\r\n${errorMessages}` : ''
        }`,
        onClose: () => {
          queryClient.invalidateQueries([
            couponListQueryKey,
            toCouponListSearchParamsByQueryState(queryState, defaultFormValues),
          ]);

          dialogClose();
        },
      });
    };
  };

  const handleClickGoCreateCoupon = () => {
    navigate('/coupon/create');
  };

  /**
   * 이벤트 쿠폰 사용자 등록 서식 excel download
   */
  const handleDownloadEventUserCouponTemplate = () => {
    excelExport({
      headers: [eventCouponExcelHeader],
      sheetData: [],
      fileName: '이벤트쿠폰 사용자등록 서식.xlsx',
    });
  };

  const handleClickCopyCoupon = ({ id, name: couponName }: CouponModel) => {
    return () => {
      dialogOpen({
        type: DialogType.CONFIRM,
        title: '확인',
        content: `'${couponName}' 쿠폰을 복사하시겠습니까?\r\n(쿠폰번호: ${id})`,
        onConfirm: async () => {
          const { id: newCouponId } = await copyCouponItem(id);
          dialogClose();
          queryClient.invalidateQueries([
            couponListQueryKey,
            toCouponListSearchParamsByQueryState(queryState, defaultFormValues),
          ]);

          toast.success(
            <>
              쿠폰이 복사되었습니다.
              <br />
              쿠폰수정 페이지로 이동합니다.
            </>,
            { duration: 2000 },
          );
          const errorTimeout = setTimeout(() => {
            navigate(`/coupon/${newCouponId}`);
            clearTimeout(errorTimeout);
          }, 2000);
        },
      });
    };
  };

  return {
    couponItems: couponResponse?.content,
    isLoading,
    pagination: {
      limit: Number(queryState.size) || 10,
      page: Number(queryState.page) || 1,
      total: couponResponse?.totalElements || 0,
      onChange: handleChangePagination,
    },
    form: {
      formMethod,
      handleSubmit: onSubmit,
      handleReset: onClickResetForm,
    },
    action: {
      handleClickGoCreateCoupon,
      handleDownloadEventUserCouponTemplate,
      handleClickToggleActiveCoupon,
      handleClickDeleteCoupon,
      handleUploadEventCouponExcelData,
      handleClickCopyCoupon,
    },
  };
};
