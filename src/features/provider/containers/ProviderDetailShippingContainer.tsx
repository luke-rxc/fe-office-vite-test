import { useState, useEffect, useCallback, useRef } from 'react';
import type { VFC } from 'react';
import { useParams } from 'react-router-dom';
import { Button, Radio, FormControlLabel, RadioGroup, List, Box, Link } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import { Modal } from '@components/Modal';
import { Table, TableColumnProps } from '@components/table/Table';
import { toDateFormat } from '@utils/date';
import { ProviderShippingDetail } from '../components';
import { ListItemWrapper } from '../components/Styled';
import { ShippingDetailModel, ShippingDetailFieldModel } from '../models';
import {
  useGetShippingsService,
  useDeleteShippingService,
  useUpdateShippingDefaultService,
  usePostShippingService,
  useUpdateShippingService,
  useGetDeliveryCompany,
  useReturnGoodsService,
} from '../services';

/**
 * 입점사 배송지 조회
 */
export const ProviderDetailShippingContainer: VFC = () => {
  const { id } = useParams();
  const { shippingListData, isError, isSuccess, handleGetShippings } = useGetShippingsService(+id); // 배송 리스트 조회
  const { handleUpdateShippingDefault } = useUpdateShippingDefaultService(+id); // 기본 배송지 등록
  const { handleUpdateShipping, isSuccess: isModifySuccess } = useUpdateShippingService(+id); // 배송지 수정
  const { handleDeleteShipping } = useDeleteShippingService(+id); // 배송 리스트 삭제
  const { handleRegisterShipping, isSuccess: isRegisterSuccess } = usePostShippingService(+id); // 배송 리스트 등록
  const {
    returnGoodsLinkData,
    isError: isGoodsFlowLinkError,
    isSuccess: isGoodsFlowLinkSuccess,
    handleGetLinkForReturnGoods,
  } = useReturnGoodsService(); // 자동반품 등록 서비스
  const { deliveryCompanyList } = useGetDeliveryCompany(); // 택배사 조회
  const [selectedNo, setSelectedNo] = useState<string>(null);
  const [isOpenShippingDetail, setIsOpenShippingDetail] = useState<boolean>(false);
  const selectShippingItem = useRef<ShippingDetailModel>(null);
  const [isOpenReturnGoodsLink, setIsOpenReturnGoodsLink] = useState<boolean>(false);
  const returnGoodsLinks = useRef<string>(''); // 자동반품등록 링크값

  /**
   * 배송지 리스트 컬럼 데이터
   */
  const shippingListColumns: TableColumnProps<ShippingDetailModel>[] = [
    {
      label: '배송지 ID',
      dataKey: 'id',
      width: '15%',
      align: 'center',
      render: (id: string, item: ShippingDetailModel) => {
        return <FormControlLabel value={`${item.id}`} control={<Radio />} label={item.id} />;
      },
    },
    {
      label: '배송',
      dataKey: 'name',
      width: '30%',
      render: (name: string, item: ShippingDetailModel) => {
        return (
          <Link
            href="#"
            onClick={(e) => {
              e.preventDefault();
              selectShippingItem.current = item;
              setIsOpenShippingDetail(true);
            }}
          >
            {name}
          </Link>
        );
      },
    },
    {
      label: '생성일',
      dataKey: 'createData',
      width: '20%',
      align: 'center',
      render: (id: string, item: ShippingDetailModel) => {
        return <>{toDateFormat(item.createdDate)}</>;
      },
    },
    {
      label: '기본배송지',
      dataKey: 'isDefault',
      width: '20%',
      align: 'center',
      render: (id: string, item: ShippingDetailModel) => {
        return <>{item.isDefault && '기본배송지'}</>;
      },
    },
    {
      label: '자동반품등록',
      dataKey: 'contract',
      width: '15%',
      align: 'center',
      render: (id: string, item: ShippingDetailModel) => {
        return (
          <>
            {!item.contract.required && '-'}
            {item.contract.required && (
              <Button onClick={() => handleReturnGoodsLink(item)}>등록{item.contract.registered ? '완료' : ''}</Button>
            )}
          </>
        );
      },
    },
  ];

  /**
   * 기본 배송지 적용
   */
  const applyDefaultShipping = useCallback(
    () => handleUpdateShippingDefault(+selectedNo),
    [selectedNo, handleUpdateShippingDefault],
  );

  /**
   * 배송지 삭제
   */
  const deleteShipping = useCallback(() => handleDeleteShipping(+selectedNo), [selectedNo, handleDeleteShipping]);

  /**
   * 배송지 등록
   * @param {ShippingDetailFieldModel} formData
   */
  const handleSubmit = useCallback(
    (formData: ShippingDetailFieldModel) => {
      if (formData.shippingId) {
        handleUpdateShipping(formData);
      } else {
        handleRegisterShipping(formData);
      }
    },
    [handleRegisterShipping, handleUpdateShipping],
  );

  /**
   * 굿스플로 자동 반품 등록
   */
  const handleReturnGoodsLink = useCallback(
    (shipping: ShippingDetailModel) => {
      handleGetLinkForReturnGoods(+id, shipping.id);
    },
    [handleGetLinkForReturnGoods, id],
  );

  /**
   * 굿스플로 자동 반품 등록창 닫기
   */
  const handleCloseLayerReturnGoods = useCallback(() => {
    setIsOpenReturnGoodsLink(false);
    handleGetShippings();
    returnGoodsLinks.current = '';
  }, [handleGetShippings]);

  useEffect(() => {
    if (isGoodsFlowLinkError) {
      return;
    }
    if (returnGoodsLinkData && isGoodsFlowLinkSuccess) {
      returnGoodsLinks.current = returnGoodsLinkData.link;
      setIsOpenReturnGoodsLink(true);
    }
  }, [returnGoodsLinkData, isGoodsFlowLinkSuccess, isGoodsFlowLinkError]);

  /**
   * 배송지 상세 팝업 닫기
   */
  const handleCloseShippingDetail = useCallback(() => {
    setIsOpenShippingDetail(false);
    selectShippingItem.current = null;
  }, []);

  useEffect(() => handleCloseShippingDetail(), [isRegisterSuccess, isModifySuccess, handleCloseShippingDetail]);

  return (
    <>
      <List sx={{ display: 'flex', flexWrap: 'wrap' }}>
        <ListItemWrapper listTitleName="배송 정보" sx={{ width: '100%', alignItems: 'flex-start' }}>
          <Box sx={{ width: '100%' }}>
            {isError && <>배송 정보를 조회 할 수 없습니다.</>}
            {isSuccess && shippingListData.length === 0 ? (
              <Button
                onClick={() => setIsOpenShippingDetail(true)}
                startIcon={<AddIcon />}
                style={{ width: 100 }}
                variant="contained"
              >
                등록
              </Button>
            ) : (
              <>
                <Box sx={{ mb: 2 }}>
                  <Button onClick={applyDefaultShipping} variant="outlined">
                    기본배송지 적용
                  </Button>
                  <Button
                    onClick={() => setIsOpenShippingDetail(true)}
                    variant="contained"
                    sx={{ ml: 2, mr: 2, minWidth: 100 }}
                  >
                    등록
                  </Button>
                  <Button onClick={deleteShipping} variant="outlined" sx={{ minWidth: 100 }}>
                    삭제
                  </Button>
                </Box>
                {shippingListData && (
                  <RadioGroup name="shipping" value={selectedNo} onChange={(e, value: string) => setSelectedNo(value)}>
                    <Table
                      columns={shippingListColumns}
                      items={shippingListData}
                      rowKey="id"
                      pagination={false}
                    ></Table>
                  </RadioGroup>
                )}
              </>
            )}
          </Box>
        </ListItemWrapper>
      </List>

      {isOpenShippingDetail && (
        <ProviderShippingDetail
          shippingData={selectShippingItem?.current}
          deliveryCompanyList={deliveryCompanyList}
          onSubmit={handleSubmit}
          onCancel={handleCloseShippingDetail}
        />
      )}

      {isOpenReturnGoodsLink && (
        <Modal
          title="자동반품등록"
          open={true}
          width={1000}
          height={830}
          maxWidth="initial"
          onClose={handleCloseLayerReturnGoods}
        >
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <iframe title="자동반품등록/수정" width="960" height="700" src={returnGoodsLinks.current} />
          </Box>
        </Modal>
      )}
    </>
  );
};
