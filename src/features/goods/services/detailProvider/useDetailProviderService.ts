import { useEffect } from 'react';
import { ProviderModel, ComboModel } from '../../models';
import { useFormContext } from 'react-hook-form';

interface Props {
  initMdId?: number;
  initManagerId?: number;
  mdListOptions: ComboModel[];
  managerListOptions: ComboModel[];
}

export const useDetailProviderService = ({ initMdId, initManagerId, mdListOptions, managerListOptions }: Props) => {
  const { setValue } = useFormContext();

  // change autocomplete : provider
  const handleChangeProvider = (values?: ProviderModel) => {
    setValue('providerInfo', values);
    setValue('providerId', values?.value);
  };

  // change autocomplete : md
  const handleChangeMd = (values?: ComboModel) => {
    setValue('adminMdInfo', values);
    setValue('adminMdId', values?.value);
  };

  // change autocomplete : manager
  const handleChangeManager = (values?: ComboModel) => {
    setValue('adminGoodsManagerInfo', values);
    setValue('adminGoodsManagerId', values?.value);
  };

  /** @todo refactor (new service hook) */
  // modify
  useEffect(() => {
    if (mdListOptions.length && initMdId) {
      /**
       * @issue 임시 저장 리스트를 로드시, setValue 적용 값은 잘 반영되었으나,렌더링 이슈 발생
       *        - 우선 requestAnimationFrame 으로 렌더링 Queue 설정
       * @issue 22.03.08 - 등록된 MD가 아닌값이 있거나 빈값이 있을때 콤보박스 선택시 UI 오류가 발생
       */
      const adminMdInfo = mdListOptions.find(({ value }) => value === +initMdId);

      if (adminMdInfo) {
        requestAnimationFrame(() => {
          setValue('adminMdInfo', adminMdInfo);
        });
      } else {
        setValue('adminMdInfo', null);
        setValue('adminMdId', null);
      }
    }
  }, [mdListOptions, initMdId, setValue]);

  useEffect(() => {
    if (managerListOptions.length && initManagerId) {
      /**
       * @issue 임시 저장 리스트를 로드시, setValue 적용 값은 잘 반영되었으나,렌더링 이슈 발생
       *        - 우선 requestAnimationFrame 으로 렌더링 Queue 설정
       */
      const adminGoodsManagerInfo = managerListOptions.find(({ value }) => value === +initManagerId);

      if (adminGoodsManagerInfo) {
        requestAnimationFrame(() => {
          setValue('adminGoodsManagerInfo', adminGoodsManagerInfo);
        });
      } else {
        setValue('adminGoodsManagerInfo', null);
        setValue('adminGoodsManagerId', null);
      }
    }
  }, [managerListOptions, initManagerId, setValue]);

  return {
    handleChangeProvider,
    handleChangeMd,
    handleChangeManager,
  };
};
