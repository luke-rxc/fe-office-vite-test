import { useEffect, useState } from 'react';
import { useFormContext, FieldValues, UseFieldArrayReturn } from 'react-hook-form';
import useLoading from '@hooks/useLoading';
import { OptListLimit, OptListMore, OptionTableType, OptTableMaxHeightInfo } from '../../constants';
import { OptBatchTitleType, OptBatchFieldNameType } from '../../types';
import { getRate } from '../../utils';

interface Props {
  fieldArray: UseFieldArrayReturn<FieldValues, 'optionLists', 'id'>;
}

export interface ModalInfoProps {
  title: OptBatchTitleType;
  fieldName: OptBatchFieldNameType;
}

export const useOptionTableControlService = ({ fieldArray }: Props) => {
  const { setValue } = useFormContext();
  const { fields } = fieldArray;

  /** 테이블 초기 렌더링 상태 */
  const [isRender, setIsRender] = useState(false);

  /** optionTableType이 LIMIT일때 렌더링 리스트 */
  const [renderOptList, setRenderOptList] = useState<Record<'id', string>[] | null>(null);
  /** 렌더링 리스트 개수, optionTableType이 LIMIT일때 지속적으로 갱신 (infinite) */
  const [optPage, setOptPage] = useState<number>(OptListLimit);
  /** 총 옵션 갯수 (fields와 동일) */
  const [optTotal, setOptTotal] = useState<number>(0);
  /** 테이블 렌더링 타입, NORMAL(Table), LIMIT(TableLight) */
  const [optionTableType, setOptionTableType] = useState<OptionTableType>(OptionTableType.NORMAL);
  /** 일괄적용 */
  const [batchModalInfo, setBatchModalInfo] = useState<ModalInfoProps>(null);

  /** Light Table Info */
  const { showLoading, hideLoading } = useLoading();
  const [selectedRowIndexes, setSelectedRowIndexes] = useState<Array<number>>([]);
  const [disabledRowItemIndexes, setDisabledRowItemIndexes] = useState<Array<number>>([]);

  /** 갱신: 리스트 추가 */
  const handleMoreLoad = () => {
    setOptPage((prev) => Math.min(optTotal, prev + OptListMore));
  };

  /** 갱신: 렌더링 리스트 */
  useEffect(() => {
    if (!optTotal) {
      return;
    }
    setRenderOptList(fields.slice(0, optPage));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [optPage]);

  /** Option Row: Selected */
  const handleRowKeyChange = (itemIndexes: number[]) => {
    setSelectedRowIndexes(itemIndexes);
  };

  /** Option Row: Deleted */
  const handleRemoveIndex = (index: number) => {
    setValue(`optionLists.${index}.isDeleted`, true);
  };

  /** Option Row List: Deleted */
  const handleRemoveList = () => {
    if (!!selectedRowIndexes.length) {
      selectedRowIndexes.forEach((selectedRowIndex) => {
        handleRemoveIndex(selectedRowIndex);
      });
      setDisabledRowItemIndexes(selectedRowIndexes);
    }
  };

  /** 일괄적용 진행 */
  const handleUpdateBatchModalInfo = (props?: ModalInfoProps) => {
    setBatchModalInfo(props ?? null);
  };

  const handleBatchChange = async (value, fieldName) => {
    showLoading();
    window.requestAnimationFrame(() => {
      setTimeout(() => {
        fields.forEach((field, index) => {
          setValue(`optionLists.${index}.${fieldName}`, value);
          if (['consumerPrice', 'price'].includes(fieldName)) {
            const consumerPrice = fieldName === 'consumerPrice' ? +value : field['consumerPrice'];
            const price = fieldName === 'price' ? +value : field['price'];
            const rate = getRate(consumerPrice, price);
            const finalRate = !isNaN(rate) && isFinite(rate) ? rate : 0;
            setValue(`optionLists.${index}.discountRate`, finalRate);
          }
          if (index === fields.length - 1) {
            hideLoading();
            handleUpdateBatchModalInfo(null);
          }
        });
      }, 400);
    });
  };

  /** 옵션 렌더링 상태값 세팅 */
  useEffect(() => {
    const fieldsLen = fields.length;
    const tableType = fieldsLen > OptListLimit ? OptionTableType.LIMIT : OptionTableType.NORMAL;
    setOptionTableType(tableType);
    setOptTotal(fieldsLen);
    setOptPage(OptListLimit);
    if (!fieldsLen) {
      setRenderOptList([]);
    } else {
      setRenderOptList(fields.slice(0, OptListLimit));
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(fields)]);

  /** 초기 렌더링 타이밍 체크 */
  useEffect(() => {
    if (optTotal) {
      !isRender && setIsRender(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [optTotal]);

  /** console */
  // console.log('===========optTotal===========', optTotal);
  // console.log('===========renderOptList===========', renderOptList);
  // console.log('===========fieldArray===========', fieldArray?.fields, optTotal, renderOptList);

  return {
    /** 테이블 초기 렌더링 상태 */
    isRender,
    /** 총 옵션 갯수 (fields와 동일) */
    optTotal,
    /** 테이블 렌더링 타입, NORMAL(Table), LIMIT(TableLight) */
    optionTableType,
    /** 옵션 테이블의 총길이 (Height) */
    maxHeight: optTotal > OptTableMaxHeightInfo.LIMIT ? OptTableMaxHeightInfo.HEIGHT : undefined,
    /** optionTableType이 LIMIT일때 TableLight에 세팅되는 Props */
    lightTable: {
      /** [optionTableType LIMIT] 렌더링 리스트 */
      renderOptList,
      /** [optionTableType LIMIT] 리스트를 계속 로드하는지 여부 */
      hasMore: optPage < optTotal,
      /** [optionTableType LIMIT] 리스트 제어불가 Index Array */
      disabledRowItemIndexes,
      /** [optionTableType LIMIT] 리스트 계속 로드시의 Handler */
      handleMoreLoad,
      /** [optionTableType LIMIT] 리스트 선택시의 Handler */
      handleRowKeyChange,
      /** [optionTableType LIMIT] 단일 리스트 삭제시의 Handler */
      handleRemoveIndex,
      /** [optionTableType LIMIT] 선택된 리스트 삭제시의 Handler */
      handleRemoveList,
      /** [optionTableType LIMIT] 일괄 적용시의 Handler */
      handleBatchChange,
    },
    /** 일괄 적용 Modal Props */
    batchModal: {
      batchModalInfo,
      handleUpdateBatchModalInfo,
    },
  };
};
