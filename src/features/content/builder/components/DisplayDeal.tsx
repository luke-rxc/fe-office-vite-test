import { useCallback, VFC, useEffect } from 'react';
import { useState } from 'react';
import { FieldError, useFormContext } from 'react-hook-form';
import { Box, Button, FormHelperText, Typography } from '@material-ui/core';
import { useDialog } from '@hooks/useDialog';
import { DialogType } from '@models/DialogModel';
import { DEAL_GOODS_MAX_NUM, SORT_TYPE } from '../constants';
import { GoodsListContainer } from '../containers';
import { GoodsModel } from '../models';
import { useListService } from '../services';
import { GoodsList } from './GoodsList';
import { SortButtons } from './SortButtons';
import { Tooltip } from './Tooltip';

/**
 * 전시 상품
 */
type DisplayDealProps = {
  componentId: number;
  goodsList: GoodsModel[];
  onChangeList: (list: GoodsModel[]) => void;
};
export const DisplayDeal: VFC<DisplayDealProps> = ({ componentId, goodsList, onChangeList }) => {
  const {
    formState: { errors },
  } = useFormContext();
  const { handleToFirst, handleToLast, handleToFront, handleToBack } = useListService();
  const { open: dialogOpen, close: dialogClose } = useDialog();
  const [list, setList] = useState(goodsList);
  const [isGoodsRegister, setIsGoodsRegister] = useState<boolean>(false); // 상품등록 모달
  const [selectedRowKeys, setSelectedRowKeys] = useState<Array<number>>([]); // 상품 리스트 select 변경
  const [errorMsg, setErrorMsg] = useState<string>('');
  const error = errors[componentId]?.goodsList as FieldError;

  /**
   * 리스트 선택
   */
  const handleRowKeyChange = useCallback((keys) => {
    setSelectedRowKeys(keys);
  }, []);

  /**
   * 정렬 변경
   */
  const handleSort = useCallback(
    (sortType: SORT_TYPE) => {
      if (!selectedRowKeys.length) {
        return;
      }
      const keyList = list.map((item) => item.goodsId);
      let sortKeyList = [];
      switch (sortType) {
        case SORT_TYPE.TOP:
          sortKeyList = handleToFirst(keyList, selectedRowKeys);
          break;
        case SORT_TYPE.UP:
          sortKeyList = handleToFront(keyList, selectedRowKeys);
          break;
        case SORT_TYPE.DOWN:
          sortKeyList = handleToBack(keyList, selectedRowKeys);
          break;
        case SORT_TYPE.BOTTOM:
          sortKeyList = handleToLast(keyList, selectedRowKeys);
          break;
        default:
          break;
      }

      const newList = sortKeyList.map((keyNum) => {
        return list.find((goods) => goods.goodsId === keyNum);
      });
      setList(newList);
    },
    [handleToBack, handleToFirst, handleToFront, handleToLast, list, selectedRowKeys],
  );

  /**
   * 상품 삭제
   */
  const handleRemove = useCallback(() => {
    if (!selectedRowKeys.length) {
      dialogOpen({
        title: `상품 삭제`,
        content: `상품을 선택 해 주세요`,
        type: DialogType.ALERT,
        onClose: () => {
          dialogClose();
        },
      });
      return;
    }
    setList((prevList) => {
      return prevList.filter((goods) => !selectedRowKeys.includes(goods.goodsId));
    });
    setSelectedRowKeys([]);
  }, [dialogClose, dialogOpen, selectedRowKeys]);

  /**
   * 상품 등록
   */
  const handleRegister = useCallback((addedList: GoodsModel[]) => {
    setList((prev) => [...prev, ...addedList]);
    setIsGoodsRegister(false);
    setErrorMsg('');
  }, []);

  useEffect(() => {
    if (list.length === 0 && error?.message) {
      setErrorMsg(error.message);
    } else {
      setErrorMsg('');
    }
  }, [error, list]);

  useEffect(() => {
    onChangeList(list);
  }, [list, onChangeList]);

  return (
    <>
      <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
        전시 상품 (총&nbsp;<span style={{ color: '#5664d2' }}>{`${list.length}`}</span>개) &nbsp;
        <Tooltip
          text={
            <>
              *판매예정, *판매중 상태의 상품만
              <br />
              서비스에 노출이 가능합니다.
            </>
          }
        ></Tooltip>
      </Typography>
      <Box sx={{ ml: 2, mt: 1, mb: 2 }}>
        <Typography variant="body2" sx={{ display: 'inline' }}>
          * 스토리 콘텐츠에 전시할 상품을 검색하고 등록 하세요.
        </Typography>
        <Typography color="secondary" variant="body2" sx={{ ml: 1, display: 'inline' }}>
          (*최대 {DEAL_GOODS_MAX_NUM}개 까지 전시 등록 가능합니다)
        </Typography>
      </Box>
      <Box sx={{ mt: 5 }}>
        <Box sx={{ display: 'flex' }}>
          <Box sx={{ width: 200 }}>{list.length > 0 && <SortButtons onSort={handleSort} />}</Box>
          <Box sx={{ marginLeft: 'auto' }}>
            {list.length > 0 && (
              <Button
                type="button"
                onClick={handleRemove}
                variant="contained"
                color="secondary"
                sx={{ minWidth: 100 }}
                disabled={list.length === 0}
              >
                삭제
              </Button>
            )}
            <Button
              type="button"
              onClick={() => setIsGoodsRegister(true)}
              variant="contained"
              color="primary"
              sx={{ ml: 1, minWidth: 100 }}
            >
              + 상품추가
            </Button>
          </Box>
        </Box>

        <Box sx={{ mt: 3, mb: 1 }}>
          {list.length > 0 && (
            <GoodsList
              items={list}
              pagination={false}
              rowKey="goodsId"
              rowSelection={{
                selectedRowKeys,
                onChange: handleRowKeyChange,
              }}
            />
          )}
        </Box>
      </Box>
      {!!errorMsg === true && (
        <Box
          sx={{
            mt: 2,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: 200,
            background: 'rgba(244,67,54,0.1)',
            borderRadius: '8px',
          }}
        >
          <FormHelperText error>{errorMsg}</FormHelperText>
        </Box>
      )}

      {/* 상품등록 */}
      {isGoodsRegister && (
        <GoodsListContainer list={list} onConfirm={handleRegister} onCancel={() => setIsGoodsRegister(false)} />
      )}
    </>
  );
};
