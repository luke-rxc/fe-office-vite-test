import { Modal } from '@components/Modal';
import { useDialog } from '@hooks/useDialog';
import { DialogType } from '@models/DialogModel';
import { FormProvider } from 'react-hook-form';
import { Box, Grid } from '@material-ui/core';
import { Layout } from '@components/Layout';
import { toDateFormat } from '@utils/date';
import { toCommify } from '@utils/toCommify';
import { useMemberManagementService } from '../services';
import {
  MemberBasicInfo,
  MemberMileageHistory,
  MemberCouponHistory,
  MemberAddressList,
  MemberOrderHistory,
  MemberDropInfo,
  MemberNickNameHistory,
  MemberMileageForm,
  MileageConfirmDialogContent,
  MemberBlackList,
} from '../components';
import { MemberRefundInfo } from '../components/MemberRefundInfo';
import { MILEAGE_ACTION_TYPE } from '../constants';

export const MemberManagementDetailContainer = () => {
  const {
    memberBasic,
    mileage,
    coupon,
    address,
    order,
    drop,
    nickName,
    refund,
    action: { refreshMileageInfo, refreshUserInfo, handleIdentifyReset, handleAvailableReJoin },
  } = useMemberManagementService();
  const alert = useDialog();
  const {
    formMethod,
    isMileageFormOpen,
    onConfirm: handleConfirm,
    onMileageFormOpen: handleMileageFormOpen,
    onMileageFormClose: handleMileageFormClose,
  } = mileage.form;
  const { getValues } = formMethod;
  const { open, close } = useDialog();

  const handleConfirmOpen = async () => {
    if (await formMethod.trigger()) {
      const { type, point, expiredDate, memo, reason } = getValues();
      const title = `적립금 [${type === MILEAGE_ACTION_TYPE.SAVE ? '지급' : '차감'}]을 진행하시겠습니까?`;
      const pointText = toCommify(Number(point), {});

      open({
        title,
        content: (
          <MileageConfirmDialogContent
            type={type}
            point={pointText}
            expiredDate={toDateFormat(expiredDate, 'yyyy-MM-dd')}
            memo={memo}
            reason={reason}
          />
        ),
        type: DialogType.CONFIRM,
        onClose: close,
        onConfirm: async () => {
          try {
            await handleConfirm(getValues());
            refreshMileageInfo();
            close();
            handleMileageFormClose();
          } catch (err) {
            alert.open({
              content: err.data.message,
              type: DialogType.ALERT,
            });
          }
        },
      });
    }
  };

  return (
    <>
      <Layout title="사용자 상세">
        <Box>
          <MemberBasicInfo
            item={memberBasic}
            onIdentifyReset={handleIdentifyReset}
            onAvailableRejoin={handleAvailableReJoin}
          />
          <Box p="10px 0" />
        </Box>
        <Box>
          <Grid container spacing={3}>
            {drop.memberDrop && (
              <Grid item xs={6}>
                <MemberDropInfo item={drop.memberDrop} />
              </Grid>
            )}
            {refund.refundInfo && (
              <Grid item xs={6}>
                <MemberRefundInfo item={refund.refundInfo} />
              </Grid>
            )}
          </Grid>
          <Box p="10px 0" />
        </Box>
        <Box>
          <Grid container spacing={3}>
            {nickName.nickNameList.length > 0 && (
              <Grid item xs={12}>
                <MemberNickNameHistory items={nickName.nickNameList} pagination={nickName.pagination} />
              </Grid>
            )}
          </Grid>
          <Box p="10px 0" />
        </Box>
        <Box>
          <MemberMileageHistory
            items={mileage.mileageList}
            usablePoint={mileage.usablePoint}
            pagination={mileage.pagination}
            onOpenDialog={handleMileageFormOpen}
          />
          <Box p="10px 0" />
        </Box>
        <Box>
          <MemberCouponHistory items={coupon.couponList} pagination={coupon.pagination} />
          <Box p="10px 0" />
        </Box>
        <Box>
          <MemberAddressList items={address.addressList} />
          <Box p="10px 0" />
        </Box>
        <Box>
          <MemberOrderHistory items={order.orderList} pagination={order.pagination} />
          <Box p="10px 0" />
        </Box>
        <Box>{memberBasic && <MemberBlackList black={memberBasic.isBlack} onRefreshUserInfo={refreshUserInfo} />}</Box>
      </Layout>
      <div>
        <Modal
          title="적립금 수동 처리"
          open={isMileageFormOpen}
          onCancel={handleMileageFormClose}
          onConfirm={handleConfirmOpen}
          children={
            <FormProvider {...formMethod}>
              <MemberMileageForm />
            </FormProvider>
          }
          width="100%"
          height="100%"
          onClose={handleMileageFormClose}
        />
      </div>
    </>
  );
};
