import { useEffect, useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { useQueryClient } from 'react-query';
import toast from 'react-hot-toast';
import useLoading from '@hooks/useLoading';
import { useQuery } from '@hooks/useQuery';
import { useMutation } from '@hooks/useMutation';
import { ErrorModel } from '@utils/api/createAxios';
import {
  getTemporary,
  getTemporaryList,
  deleteTemporary,
  registerTemporary,
  registerPartnerTemporary,
} from '../../apis';
import {
  TempListModel,
  TempListRemoveModel,
  StateModel,
  toTempGoodsInfo,
  toTempBaseInfoReqParam,
  toTempOptReqParam,
  toPartnerTempSubmitReqParam,
  toTempFormData,
  initialState,
} from '../../models';
import { QueryKey, CommonDetailMessage, DialogFeedbackLabel } from '../../constants';
import { log } from '../../utils';
import { usePageType } from '../../hooks';
import { useDialogService } from '..';

interface Props {
  methods: UseFormReturn<StateModel>;
}

export const useDetailTemporaryService = ({ methods }: Props) => {
  const { isPartnerSite } = usePageType();
  const { errorDialog } = useDialogService();
  const client = useQueryClient();
  const { getValues, reset } = methods;
  const [tempListId, setTempListId] = useState<number>(null);
  // state를 강제로 update
  const [, setStateCount] = useState(0);

  // loading
  const { showLoading, hideLoading } = useLoading();

  /**
   * API : 임시 저장 리스트 불러오기
   */
  const { data: temporaryList } = useQuery([QueryKey.Detail.TemporaryList], getTemporary);

  /**
   * API : 임시 저장 리스트 상세 불러오기
   */
  const {
    data: tempListItem,
    isError: isTempListItemError,
    isLoading: isTempListItemLoading,
  } = useQuery(
    [QueryKey.Detail.TempListItem, tempListId],
    async () => {
      const res = getTemporaryList(tempListId);
      return res;
    },
    {
      enabled: tempListId !== null,
      select: (data) => toTempGoodsInfo(data),
      staleTime: Infinity,
    },
  );

  useEffect(() => {
    if (!!tempListItem) {
      const convertedTempList = toTempFormData(tempListItem);
      reset({
        ...initialState,
        ...convertedTempList,
      });
    }
  }, [reset, tempListItem]);

  /**
   * API : 임시 저장 리스트 삭제
   */
  const { mutateAsync: handleDeleteTempMutate } = useMutation(
    ({ goodsTemporaryId }: TempListRemoveModel) => {
      return deleteTemporary(goodsTemporaryId);
    },
    {
      onSuccess: (_, { listIdx }) => {
        toast.success(CommonDetailMessage.SUCCESS_DELETE_TEMP);
        client.setQueryData([QueryKey.Detail.TemporaryList], (prevData: TempListModel[]) => {
          return [...prevData.slice(0, listIdx), ...prevData.slice(listIdx + 1)];
        });
      },
      onError: (error: ErrorModel) => {
        toast.error(error.data?.message ?? CommonDetailMessage.FAIL_DELETE_TEMP);
      },
    },
  );

  /**
   * API : 임시 저장 Save
   */
  const { mutateAsync: handleSaveTempMutate } = useMutation(registerTemporary, {
    onSuccess: () => {
      toast.success(CommonDetailMessage.SUCCESS_SAVE_TEMP);
    },
    onError: (error: ErrorModel) => {
      toast.error(error.data?.message ?? CommonDetailMessage.FAIL_SAVE_TEMP);
    },
  });

  /**
   * API : 파트너 임시 저장 Save
   */
  const { mutateAsync: handlePartnerSaveTempMutate } = useMutation(registerPartnerTemporary, {
    onSuccess: () => {
      toast.success(CommonDetailMessage.SUCCESS_SAVE_TEMP);
    },
    onError: (error: ErrorModel) => {
      toast.error(error.data?.message ?? CommonDetailMessage.FAIL_SAVE_TEMP);
    },
  });

  // 임시 저장 Save
  const handleSaveTemporary = async () => {
    log('[handleSaveTemporarySubmit] handleSearchSubmit::type', getValues());

    const values = getValues();

    // 임시 저장 전 상품 명 체크
    if (values.name.trim() === '') {
      toast.error(CommonDetailMessage.VALID_TEMP.REQUIRED_NAME);
      return;
    }

    if (isPartnerSite) {
      const params = toPartnerTempSubmitReqParam(values);
      const saveTempRes = await handlePartnerSaveTempMutate(params);
      handleUpdateTempList(saveTempRes);
    } else {
      // 상품 정보
      const goods = toTempBaseInfoReqParam(values);

      // 옵션 정보
      const goodsOption = toTempOptReqParam(values);

      // params
      const params = {
        goods,
        goodsOption,
      };

      const saveTempRes = await handleSaveTempMutate({ ...params });
      handleUpdateTempList(saveTempRes);
    }
  };

  // 임시저장 리스트 갱신
  const handleUpdateTempList = (saveTempRes: TempListModel) => {
    client.setQueryData([QueryKey.Detail.TemporaryList], (prevData: TempListModel[]) => {
      return prevData.concat(saveTempRes);
    });
  };

  // 임시 저장 Load
  const handleLoadTemporaryList = (goodsTemporaryId: number) => {
    client.removeQueries([QueryKey.Detail.TempListItem, goodsTemporaryId], { exact: true });
    setTempListId((prevId) => {
      if (prevId === goodsTemporaryId) {
        setStateCount((prevCount) => prevCount + 1);
      }
      return goodsTemporaryId;
    });
  };

  // 임시 저장 Loading bar
  useEffect(() => {
    isTempListItemLoading || !isTempListItemError ? hideLoading() : showLoading();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isTempListItemLoading, isTempListItemError]);

  // 임시 저장 실패 Dialog
  useEffect(() => {
    if (isTempListItemError) {
      errorDialog({
        label: DialogFeedbackLabel.LOAD_TEMP_GOODS,
        message: CommonDetailMessage.FAIL_LOAD_TEMP,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isTempListItemError]);

  return {
    temporaryList: temporaryList ?? [],
    tempListItem,
    handleLoadTemporaryList,
    handleSaveTemporary,
    handleDeleteTempMutate,
  };
};
