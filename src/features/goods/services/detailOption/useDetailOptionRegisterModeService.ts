import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { OptRegisterKinds, PageType } from '../../constants';
import { initialState } from '../../models';
import { usePageType } from '../../hooks';

export const useDetailOptionRegisterModeService = () => {
  const { getValues, setValue } = useFormContext();
  const { type: pageType } = usePageType();
  const getOptionRegister = (): OptRegisterKinds => getValues('optionRegister');
  // 현재 옵션 등록 모드
  const [currentRegisterType, setCurrentRegisterType] = useState<OptRegisterKinds>(getOptionRegister());
  // const [watchOptionRegister] = watch(['optionRegister']);

  const [prevRegisterType, setPrevRegisterType] = useState<OptRegisterKinds>(() => {
    return pageType === PageType.CREATE ? null : getOptionRegister();
  });

  // 옵션 모드 변경시 modal state
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

  // 옵션 상품 등록, 단일 상품 등록 선택
  const handleRegisterType = () => {
    const optionLists = getValues('optionLists');
    if (optionLists.length > 0) {
      setIsRegisterModalOpen(true);
    } else {
      handleChangeRegisterType();
    }
  };

  // 상품 등록 타입 변경시 나오는 Modal Cancel
  const handleChangeCancelRegisterType = () => {
    const toChangeType = getOptionRegister();
    const resetRegisterType =
      toChangeType === OptRegisterKinds.PROGRESS ? OptRegisterKinds.STOP : OptRegisterKinds.PROGRESS;

    setValue('optionRegister', resetRegisterType);
    setIsRegisterModalOpen(false);
  };

  const handleResetOptionField = () => {
    const { optionBases, optionLists, optionRegister, optionTitles, optionsLen } = initialState;
    setValue('optionLists', optionLists);
    setValue('optionBases', optionBases);
    setValue('optionRegister', optionRegister);
    setValue('optionTitles', optionTitles);
    setValue('optionsLen', optionsLen);
  };

  // 상품 등록 타입 변경시 나오는 Modal Confirm
  const handleChangeRegisterType = () => {
    const { optionBases, optionLists, optionsLen } = initialState;
    const toChangeType = getOptionRegister();

    /* if (toChangeType === OptRegisterKinds.STOP) {
      // validation: 상품명 체크
      const nameValue = getValues('name');

      if (!nameValue || nameValue.trim() === '') {
        toast.error('필수로 상품명이 입력되어야 합니다.');
        handleChangeCancelRegisterType();
        return;
      }
    } */
    // 기존 State 저장
    setPrevRegisterType(currentRegisterType);

    // 옵션 기준 세팅 데이터 초기화
    setValue('optionBases', optionBases);
    // 선택한 옵션 개수 초기화
    setValue('optionsLen', optionsLen);
    // 옵션 리스트 초기화
    setValue('optionLists', optionLists);

    // state
    setCurrentRegisterType(toChangeType);
    isRegisterModalOpen && setIsRegisterModalOpen(false);
  };

  // 상품 등록 시 옵션, 등록모드 초기화
  const handleResetRegisterType = () => {
    handleResetOptionField();
    setCurrentRegisterType(getOptionRegister());
  };

  /**
   * @issue 티켓상품 복사 후에 옵션이 없는 상태로 시작, 해당 부분의 옵션상태(UI)가 동기화가 되어야 함
   * @issue @todo 단일 옵션 진행시, 이슈가 있어 우선 주석처리후 재진행 (22.12.05)
   */
  /* useEffect(() => {
    if (pageType === PageType.MODIFY && watchOptionRegister !== currentRegisterType) {
      setCurrentRegisterType(watchOptionRegister);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchOptionRegister]); */

  return {
    prevRegisterType,
    currentRegisterType,
    isRegisterModalOpen,
    getOptionRegister,
    handleRegisterType,
    handleChangeCancelRegisterType,
    handleChangeRegisterType,
    handleResetRegisterType,
    handleResetOptionField,
  };
};
