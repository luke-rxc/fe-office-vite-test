import { useQuery } from '@hooks/useQuery';
import { useForm } from 'react-hook-form';
import { getCategories } from '../apis';
import {
  AllowItemType,
  categoryLastListQueryKey,
  categoryRootListQueryKey,
  categorySubListQueryKey,
} from '../constants';
import { CategoryModel, toCategoryModelList } from '../models';
import { CategoriesFormField, CategoryFormProps, CouponAllowItem, PolicyInfo } from '../types';

interface Props {
  policyInfo?: PolicyInfo;
}

interface CouponCategoryServiceReturn {
  form: CategoryFormProps;
  summaryItems: CouponAllowItem[];
  categoryData: {
    rootCategories: Array<CategoryModel>;
    subCategories: Array<CategoryModel>;
    lastCategories: Array<CategoryModel>;
  };
}

/**
 * useCouponCategoryService
 * 쿠폰 카테고리 관련 service
 */
export const useCouponCategoryService = ({ policyInfo }: Props): CouponCategoryServiceReturn => {
  const categoryInitialData: CategoriesFormField = {
    rootCategory: '',
    subCategory: '',
    lastCategory: '',
  };

  const formMethod = useForm<CategoriesFormField>({
    defaultValues: categoryInitialData,
  });
  const { watch, setValue, handleSubmit } = formMethod;

  const { rootCategory, subCategory } = watch();

  const { data: rootCategories } = useQuery(categoryRootListQueryKey, () => getCategories(), {
    select: (items) => {
      return toCategoryModelList(items.categories);
    },
  });
  const { data: subCategories } = useQuery(
    [categorySubListQueryKey, rootCategory],
    () => getCategories({ parentCategoryId: Number(rootCategory) }),
    {
      select: (items) => {
        return toCategoryModelList(items.categories);
      },
      enabled: !!rootCategory && rootCategory !== '',
    },
  );
  const { data: lastCategories } = useQuery(
    categoryLastListQueryKey,
    () => getCategories({ parentCategoryId: Number(subCategory) }),
    {
      select: (items) => {
        return toCategoryModelList(items.categories);
      },
      enabled: !!subCategory && subCategory !== '',
    },
  );

  const onSubmit = handleSubmit(({ rootCategory, subCategory, lastCategory }) => {
    const categoryDepthValues = [
      { level: 3, value: lastCategory ? Number(lastCategory) : null, items: lastCategories },
      { level: 2, value: subCategory ? Number(subCategory) : null, items: subCategories },
      { level: 1, value: rootCategory ? Number(rootCategory) : null, items: rootCategories },
    ];

    const selectedInfo = categoryDepthValues.reduce<{ id: number | null; level: number | null }>(
      (target, item) => {
        if (target.id === null && item.value !== null) {
          target = {
            id: item.value,
            level: item.level,
          };
        }

        return target;
      },
      { id: null, level: null },
    );

    if (selectedInfo.id === null) {
      return;
    }

    if (policyInfo.allowCategories.findIndex((category) => category.id === selectedInfo.id) > -1) {
      return;
    }

    const names = categoryDepthValues
      .reduce(
        (target, categoryItem) => {
          if (categoryItem.level > selectedInfo.level) {
            return target;
          }

          const selectedCategory = categoryItem.items.find((item) => item.value === target.id);

          if (!!selectedCategory.label) {
            target.id = selectedCategory.parentId ? selectedCategory.parentId.toString() : null;
            target.names.push(selectedCategory.label);
          }

          return target;
        },
        {
          id: selectedInfo.id.toString(),
          names: [] as Array<string>,
        },
      )
      .names.reverse();

    policyInfo.handleUpdateAllowItem(AllowItemType.ALLOW_CATEGORY, [
      ...policyInfo.allowCategories,
      { id: selectedInfo.id, text: names.join(' > ') },
    ]);
  });

  const handleChangeCategory = (categoryName: 'rootCategory' | 'subCategory' | 'lastCategory', value: string) => {
    setValue(categoryName, value);
    if (categoryName === 'rootCategory') {
      setValue('subCategory', '');
      setValue('lastCategory', '');
    } else if (categoryName === 'subCategory') {
      setValue('lastCategory', '');
    }
  };

  return {
    form: { formMethod, handleSubmit: onSubmit, handleChangeCategory },
    categoryData: { rootCategories, subCategories, lastCategories },
    summaryItems: policyInfo.allowCategories,
  };
};
