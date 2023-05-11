import { useState, useEffect } from 'react';
import { useDialog } from '@hooks/useDialog';
import { getCategoryInfo, getCategoryRootInfo } from '../apis';
import { CategoryListModel, CategorySelectItemModel, toCategoryModelList } from '../models';
import { SearchCategoryInfoProp } from '../types';
import { DialogType } from '@models/DialogModel';

const InitCategoryLength = 3;
const InitCategoryInfos = new Array(InitCategoryLength).fill([]);

interface Props {
  initCategoryItemInfo?: CategorySelectItemModel;
}

export const useCategoryService = ({ initCategoryItemInfo = null }: Props) => {
  const { open: dialogOpen, close: dialogClose } = useDialog();
  const [categoryInfos, setCategoryInfos] = useState<CategoryListModel[][]>([...InitCategoryInfos]);
  const [isCategoryAllLoaded, setIsCategoryAllLoaded] = useState(false);

  const getCategoryInfoData = async (depth: number, value?: number) => {
    const res =
      depth === 0
        ? await getCategoryRootInfo()
        : await getCategoryInfo({
            parentCategoryId: value,
          });

    return toCategoryModelList(res.categories);
  };

  const mapCategoryInfoData = async (depth: number, value?: number) => {
    const res = await getCategoryInfoData(depth, value);
    categoryInfos[depth] = res;

    const resetLength = InitCategoryLength - depth - 1;
    for (let idx = 0; idx < resetLength; idx++) {
      const resetTargetIdx = depth + idx + 1;
      categoryInfos[resetTargetIdx] = [];
    }

    setCategoryInfos([...categoryInfos]);
  };

  const mapSelectCateInfoData = async (initCategoryItemInfo: CategorySelectItemModel) => {
    const { one, two, three } = initCategoryItemInfo;
    const itemInfoIds = [one, two, three].filter((item) => item !== null).map((item) => item.id);
    const newCategoryInfos = categoryInfos.slice();

    try {
      if (!newCategoryInfos[0] || newCategoryInfos[0].length === 0) {
        const one = await getCategoryInfoData(0);
        newCategoryInfos[0] = one;
      }

      if (itemInfoIds[0]) {
        const two = await getCategoryInfoData(1, itemInfoIds[0]);
        newCategoryInfos[1] = two;
      }

      if (itemInfoIds[1]) {
        const three = await getCategoryInfoData(2, itemInfoIds[1]);
        newCategoryInfos[2] = three;
      }

      setCategoryInfos(newCategoryInfos);
      setIsCategoryAllLoaded(true);
    } catch (e) {
      dialogOpen({
        title: '카테고리 정보 오류',
        content:
          '정보를 제대로 받아오지 못했습니다.\r\n페이지를 새로고침합니다.\r\n문제가 지속될 시, 관리자에게 문의해 주세요',
        type: DialogType.ALERT,
        onClose: () => {
          dialogClose();
          window.location.reload();
        },
      });
    }
  };

  const handleSearchCategory = ({ depth, value }: SearchCategoryInfoProp) => {
    mapCategoryInfoData(depth, value);
  };

  const handleChangeCategory = ({ depth, value }: SearchCategoryInfoProp) => {
    handleSearchCategory({ depth, value });
  };

  useEffect(() => {
    if (initCategoryItemInfo && initCategoryItemInfo.one !== null) {
      mapSelectCateInfoData(initCategoryItemInfo);

      // 초기화
      if (isCategoryAllLoaded) {
        setIsCategoryAllLoaded(false);
      }
    } else {
      mapCategoryInfoData(0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(initCategoryItemInfo)]);

  return {
    categoryInfos,
    isCategoryAllLoaded,
    handleSearchCategory,
    handleChangeCategory,
  };
};
