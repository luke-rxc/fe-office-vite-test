import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { useQueryClient } from 'react-query';
import { ErrorModel } from '@utils/api/createAxios';
import { useMutation } from '@hooks/useMutation';
import { yupResolver } from '@hookform/resolvers/yup';
import { generalDetailValidation } from '../utils';
import { GeneralDetailModel } from '../models';
import { putGeneralDetail, GeneralDetailSubmitParams } from '../apis';
import { QueryKey } from '../constants';

interface Props {
  generalDetail: GeneralDetailModel | null;
}

export const useGeneralDetailService = ({ generalDetail }: Props) => {
  const queryClient = useQueryClient();
  const [isEdit, setIsEdit] = useState(false);
  const {
    control: generalDetailControl,
    formState: { errors: generalDetailErrors },
    getValues,
    reset,
    handleSubmit,
  } = useForm({
    defaultValues: generalDetail,
    resolver: yupResolver(generalDetailValidation),
  });

  const { mutateAsync } = useMutation<unknown, ErrorModel, GeneralDetailSubmitParams, unknown>(putGeneralDetail, {
    onSuccess: () => {
      // 초기화
      queryClient.refetchQueries(QueryKey.GeneralInfo, { active: true });
    },
  });

  const handleGeneralDetailEdit = () => {
    setIsEdit(true);
  };

  const handleGeneralDetailCancel = () => {
    setIsEdit(false);
  };

  const handleGeneralDetailSave = handleSubmit(async (generalDetail: GeneralDetailModel) => {
    const { name, cellPhone, partName } = getValues();
    const params = { name, cellPhone, partName };
    mutateAsync(
      { params },
      {
        onError: (error) => {
          toast.error(error.data.message);
        },
        onSuccess: () => {
          toast.success('소속 정보가 변경되었습니다.');
          setIsEdit(false);
        },
      },
    );
  });

  useEffect(() => {
    if (generalDetail) {
      reset(generalDetail);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(generalDetail)]);

  return {
    isGeneralDetailEdit: isEdit,
    generalDetailControl,
    generalDetailErrors,
    handleGeneralDetailEdit,
    handleGeneralDetailSave,
    handleGeneralDetailCancel,
  };
};
