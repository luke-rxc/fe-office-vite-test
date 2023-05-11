import { TOption } from '@components/Select';
import { useDialog } from '@hooks/useDialog';
import { DialogType } from '@models/DialogModel';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDiscoverFeedRegisteredDisplayGroupListQuery, useModal } from '../hooks';
import { DiscoverFeedDisplayGroupModel, DiscoverSectionItemModel } from '../models';
import { DiscoverFeedDisplayGroupFormField } from '../types';

export type ReturnTypeUseDiscoverFeedDisplayGroupService = ReturnType<typeof useDiscoverFeedDisplayGroupService>;

interface Props {
  handleUpdateSections: (updateSections: Array<DiscoverSectionItemModel>) => void;
}

/**
 * 디스커버 피드 기존 전시그룹 통한 섹션 추가 관련 service
 *
 * @param {function} handleUpdateSections 섹션 리스트 업데이트
 */
export const useDiscoverFeedDisplayGroupService = ({ handleUpdateSections }: Props) => {
  const dialog = useDialog();
  const [displayGroupOptions, setDisplayGroupOptions] = useState<Array<TOption>>([]);
  const [selectedDisplayGroup, setSelectedDisplayGroup] = useState<DiscoverFeedDisplayGroupModel>();
  const { isOpenModal, handleOpenModal, handleCloseModal } = useModal();
  const formMethod = useForm<DiscoverFeedDisplayGroupFormField>({
    defaultValues: {
      displayGroup: '',
    },
  });

  const { watch } = formMethod;

  const { data: registeredDisplayGroupList, isLoading } = useDiscoverFeedRegisteredDisplayGroupListQuery();

  useEffect(() => {
    if (!isOpenModal && (registeredDisplayGroupList ?? []).length > 0) {
      formMethod.setValue('displayGroup', registeredDisplayGroupList[0].id.toString());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpenModal]);

  useEffect(() => {
    const subscription = watch((data, { name }) => {
      if (name === 'displayGroup') {
        const targetDisplayGroup = registeredDisplayGroupList.find((item) => item.id === Number(data.displayGroup));

        if (targetDisplayGroup) {
          setSelectedDisplayGroup(targetDisplayGroup);
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [registeredDisplayGroupList, watch]);

  useEffect(() => {
    if ((registeredDisplayGroupList ?? []).length > 0) {
      setDisplayGroupOptions(
        registeredDisplayGroupList.map((item) => {
          return {
            label: `그룹 #${item.id}`,
            value: item.id.toString(),
          };
        }),
      );
      setSelectedDisplayGroup(registeredDisplayGroupList[0]);
      formMethod.setValue('displayGroup', registeredDisplayGroupList[0].id.toString());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [registeredDisplayGroupList]);

  /**
   * 선택한 전시그룹 섹션 리스트 등록
   */
  const handleClickRegistSections = () => {
    dialog.open({
      type: DialogType.CONFIRM,
      title: '확인',
      content: '선택한 전시그룹의 섹션을 등록하시겠습니까?\r\n(기존에 등록했던 섹션항목은 초기화 됩니다)',
      onConfirm: () => {
        handleUpdateSections(selectedDisplayGroup.sections);
        handleCloseModal();
        dialog.close();
      },
    });
  };

  return {
    isOpenModal,
    isLoading,
    formMethod,
    displayGroupOptions,
    selectedDisplayGroup,
    handleOpenModal,
    handleCloseModal,
    handleClickRegistSections,
  };
};
