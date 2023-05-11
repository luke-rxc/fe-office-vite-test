import { yupResolver } from '@hookform/resolvers/yup';
import { useDialog } from '@hooks/useDialog';
import useLoading from '@hooks/useLoading';
import { useMutation } from '@hooks/useMutation';
import { useQuery } from '@hooks/useQuery';
import { useQueryState } from '@hooks/useQueryState';
import { DialogType } from '@models/DialogModel';
import { toDateFormat } from '@utils/date';
import { addMonths } from 'date-fns';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useQueryClient } from 'react-query';
import { useParams } from 'react-router-dom';
import {
  getMemberById,
  getMemberCouponList,
  getMemberMileageList,
  getMemberNickNameList,
  getMemberOrderList,
  getMemberUsablePoint,
  MileageSetParam,
  postMemberUsablePoint,
  putPermanentDropOut,
  putUserResetIdentify,
} from '../apis';
import { MILEAGE_ACTION_TYPE } from '../constants';
import {
  toMemberDetailBasicModel,
  toMemberMileageModel,
  toMemberMileageListQueryParam,
  toMemberCouponListQueryParam,
  toMemberCouponModel,
  toMemberOrderListQueryParam,
  toMemberOrderModel,
  toMemberNickNameListQueryParam,
  toMemberNickNameModel,
  toMemberUsablePointModel,
  withMileageGroupRowSpanCount,
} from '../models';
import { MemberDetailQueryState, MileageFormField } from '../types';
import { mileageFormValidation } from '../utils';

export const useMemberManagementService = () => {
  const queryClient = useQueryClient();
  const { userId: id } = useParams();
  const dialog = useDialog();
  const { queryState, updateQueryState } = useQueryState<MemberDetailQueryState>();
  const formMethod = useForm<MileageFormField>({
    defaultValues: {
      type: MILEAGE_ACTION_TYPE.SAVE,
      point: 0,
      expiredDate: toDateFormat(+addMonths(new Date(`${toDateFormat(new Date(), 'yyyy/MM/dd')} 23:59:00`), 3)),
      reason: '',
      memo: '',
    },
    resolver: yupResolver(mileageFormValidation),
  });
  const [isMileageFormOpen, setIsMileageFormOpen] = useState(false);
  const { showLoading, hideLoading } = useLoading();
  const processing = useRef(false);

  const {
    data: memberBasic,
    isLoading: isMemberBasicLoading,
    refetch: refetchMemberBasic,
  } = useQuery(
    ['user', Number(id)],
    () => {
      return getMemberById(Number(id));
    },
    {
      select: (res) => {
        return toMemberDetailBasicModel(res);
      },
      onError: (err) => {
        dialog.open({
          content: err.data.message,
          type: DialogType.ALERT,
        });
      },
    },
  );

  const { data: usablePoint, isLoading: isUsablePointLoading } = useQuery(
    ['user', Number(id), 'mileage', 'usable'],
    () => {
      return getMemberUsablePoint(Number(id));
    },
    {
      select: (res) => {
        return toMemberUsablePointModel(res);
      },
      onError: (err) => {
        dialog.open({
          content: err.data.message,
          type: DialogType.ALERT,
        });
      },
    },
  );

  const { data: mileageList, isLoading: isMileageListLoading } = useQuery(
    ['user', Number(id), 'mileage', toMemberMileageListQueryParam(queryState)],
    () => {
      return getMemberMileageList(Number(id), toMemberMileageListQueryParam(queryState));
    },
    {
      select: (res) => {
        return {
          ...res,
          content: withMileageGroupRowSpanCount(res.content.map(toMemberMileageModel) ?? []),
        };
      },
      onError: (err) => {
        dialog.open({
          content: err.data.message,
          type: DialogType.ALERT,
        });
      },
    },
  );

  const { mutateAsync: processMileage } = useMutation((param: MileageSetParam) =>
    postMemberUsablePoint(Number(id), param),
  );

  const { mutateAsync: resetIdentify } = useMutation((id: number) => putUserResetIdentify(id));

  const { mutateAsync: availableReJoin } = useMutation((id: number) => putPermanentDropOut(id));

  const { data: couponList, isLoading: isCouponListLoading } = useQuery(
    ['user', Number(id), 'coupon', toMemberCouponListQueryParam(queryState)],
    () => {
      return getMemberCouponList(Number(id), toMemberCouponListQueryParam(queryState));
    },
    {
      select: (res) => {
        return {
          ...res,
          content: res.content.map(toMemberCouponModel) ?? [],
        };
      },
      onError: (err) => {
        dialog.open({
          content: err.data.message,
          type: DialogType.ALERT,
        });
      },
    },
  );

  const { data: orderList, isLoading: isOrderListLoading } = useQuery(
    ['user', Number(id), 'order', toMemberOrderListQueryParam(queryState)],
    () => {
      return getMemberOrderList(Number(id), toMemberOrderListQueryParam(queryState));
    },
    {
      select: (res) => {
        return {
          ...res,
          content: res.content.map(toMemberOrderModel) ?? [],
        };
      },
      onError: (err) => {
        dialog.open({
          content: err.data.message,
          type: DialogType.ALERT,
        });
      },
    },
  );

  const { data: nickNameList, isLoading: isNickNameListLoading } = useQuery(
    ['user', Number(id), 'nickName', toMemberNickNameListQueryParam(queryState)],
    () => {
      return getMemberNickNameList(Number(id), toMemberNickNameListQueryParam(queryState));
    },
    {
      select: (res) => {
        return {
          ...res,
          content: res.content.map(toMemberNickNameModel) ?? [],
        };
      },
      onError: (err) => {
        dialog.open({
          content: err.data.message,
          type: DialogType.ALERT,
        });
      },
    },
  );

  const handleConfirm = async (formValues: MileageFormField) => {
    if (processing.current) {
      return;
    }

    const { type, expiredDate, memo, reason, point } = formValues;

    const param = {
      actionType: type,
      adminMemo: memo,
      expiredDate: type === MILEAGE_ACTION_TYPE.UN_SAVE ? null : `${new Date(expiredDate).getTime()}`,
      point: Number(point),
      reason,
    };

    try {
      processing.current = true;
      await processMileage(param);
    } catch (err) {
      console.error(err);
      return Promise.reject(err);
    } finally {
      processing.current = false;
    }
  };

  const handleMileagePageChange = (page: number, limit: number) => {
    updateQueryState({
      ...queryState,
      mileageSize: limit.toString(),
      mileagePage: page.toString(),
    });
  };

  const handleCouponPageChange = (page: number, limit: number) => {
    updateQueryState({
      ...queryState,
      couponSize: limit.toString(),
      couponPage: page.toString(),
    });
  };

  const handleOrderPageChange = (page: number, limit: number) => {
    updateQueryState({
      ...queryState,
      orderSize: limit.toString(),
      orderPage: page.toString(),
    });
  };

  const handleNickNamePageChange = (page: number, limit: number) => {
    updateQueryState({
      ...queryState,
      nickNameSize: limit.toString(),
      nickNamePage: page.toString(),
    });
  };

  const handleMileageFormOpen = () => {
    setIsMileageFormOpen(true);
  };

  const handleMileageFormClose = () => {
    setIsMileageFormOpen(false);
    setTimeout(() => formMethod.reset(), 100);
  };

  const refreshMileageInfo = () => {
    queryClient.invalidateQueries(['user', Number(id), 'mileage']);
  };

  const refreshUserInfo = () => {
    queryClient.invalidateQueries(['user', Number(id)]);
  };

  const handleIdentifyReset = async (id: number) => {
    if (!memberBasic?.isIdentifyResettable) {
      dialog.open({
        content: '개발/스테이지 외의 환경에서는 제공하지 않는 기능입니다.',
        type: DialogType.ALERT,
      });
      return Promise.reject('개발/스테이지 외의 환경에서는 제공하지 않는 기능입니다.');
    }

    try {
      await resetIdentify(id);
      refetchMemberBasic();
      dialog.open({
        content: '인증정보가 초기화되었습니다.',
        type: DialogType.ALERT,
      });
    } catch (e) {
      dialog.open({
        content: e.data.message,
        type: DialogType.ALERT,
      });

      return Promise.reject(e);
    }
  };

  const handleAvailableReJoin = async (id: number) => {
    if (!memberBasic.isPossiblePermanentDropOut) {
      dialog.open({
        content: '개발/스테이지 외의 환경에서는 제공하지 않는 기능입니다.',
        type: DialogType.ALERT,
      });
      return Promise.reject('개발/스테이지 외의 환경에서는 제공하지 않는 기능입니다.');
    }

    try {
      await availableReJoin(id);
      refetchMemberBasic();
      dialog.open({
        content: '회원가입이 가능합니다.',
        type: DialogType.ALERT,
      });
    } catch (e) {
      dialog.open({
        content: e.data.message,
        type: DialogType.ALERT,
      });

      return Promise.reject(e);
    }
  };

  useEffect(() => {
    if (
      isMemberBasicLoading ||
      isMileageListLoading ||
      isCouponListLoading ||
      isOrderListLoading ||
      isNickNameListLoading ||
      isUsablePointLoading
    ) {
      showLoading();
    } else {
      hideLoading();
    }
  }, [
    hideLoading,
    showLoading,
    isMemberBasicLoading,
    isMileageListLoading,
    isCouponListLoading,
    isOrderListLoading,
    isNickNameListLoading,
    isUsablePointLoading,
  ]);

  return {
    memberBasic,
    mileageList,
    isLoading:
      isMemberBasicLoading &&
      isMileageListLoading &&
      isCouponListLoading &&
      isOrderListLoading &&
      isNickNameListLoading &&
      isUsablePointLoading,
    basic: {
      memberBasic,
    },
    address: {
      addressList: memberBasic?.shippingAddressList ?? [],
      pagination: false,
    },
    mileage: {
      mileageList: mileageList?.content ?? [],
      usablePoint: usablePoint ?? '0',
      form: {
        formMethod,
        isMileageFormOpen,
        onConfirm: handleConfirm,
        onMileageFormOpen: handleMileageFormOpen,
        onMileageFormClose: handleMileageFormClose,
      },
      pagination: {
        limit: Number(queryState.mileageSize) || 10,
        page: Number(queryState.mileagePage) || 1,
        total: mileageList?.totalElements ?? 0,
        onChange: handleMileagePageChange,
      },
    },
    coupon: {
      couponList: couponList?.content ?? [],
      pagination: {
        limit: Number(queryState.couponSize) || 10,
        page: Number(queryState.couponPage) || 1,
        total: couponList?.totalElements ?? 0,
        onChange: handleCouponPageChange,
      },
    },
    order: {
      orderList: orderList?.content ?? [],
      pagination: {
        limit: Number(queryState.orderSize) || 10,
        page: Number(queryState.orderPage) || 1,
        total: orderList?.totalElements ?? 0,
        onChange: handleOrderPageChange,
      },
    },
    drop: {
      memberDrop: memberBasic?.dropOut ?? null,
    },
    nickName: {
      nickNameList: nickNameList?.content ?? [],
      pagination: {
        limit: Number(queryState.nickNameSize) || 10,
        page: Number(queryState.nickNamePage) || 1,
        total: nickNameList?.totalElements ?? 0,
        onChange: handleNickNamePageChange,
      },
    },
    refund: {
      refundInfo: memberBasic?.refundBank ?? null,
    },
    action: {
      refreshMileageInfo,
      refreshUserInfo,
      handleIdentifyReset,
      handleAvailableReJoin,
    },
  };
};
