import React from 'react';
import { Box, Button } from '@material-ui/core';
import { Theme, makeStyles } from '@material-ui/core/styles';
import { env } from '@config';
import { useDialog } from '@hooks/useDialog';
import { DialogType } from '@models/DialogModel';
import { PageType, GoodsRequestStatus } from '../../constants';
import { useLink } from '../../hooks';

interface Props {
  // PageType
  pageType: PageType;
  // 파트너 사이트 인지 여부
  isPartnerSite?: boolean;
  // 파트너 상품 검수 승인 상태
  requestStatus?: GoodsRequestStatus | null;
  // 임시 저장
  onTempSave?: () => void;
  // debug
  onDebug?: () => void;
  // submit
  onSubmit: React.FormEventHandler<HTMLFormElement>;
  // 파트너 승인 요청
  onPartnerSaleRequest?: () => void;
  // 매니저 승인 요청
  onManagerApproval?: () => void;
  // 매니저 반려 요청
  onManagerReject?: () => void;
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    [theme.breakpoints.down('lg')]: {
      right: 0,
      left: 0,
    },
    position: 'fixed',
    right: 24,
    bottom: 0,
    left: 303,
    zIndex: 1,
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
    backgroundColor: `${theme.palette.background.default}`,
  },
}));

export function DetailSubmit({
  pageType,
  isPartnerSite = false,
  requestStatus = null,
  onTempSave: handleTempSave,
  onDebug: handleDebug,
  onSubmit: handleSubmit,
  onPartnerSaleRequest: handlePartnerSaleRequest,
  onManagerApproval: handleManagerApproval,
  onManagerReject: handleManagerReject,
}: Props) {
  const classes = useStyles();
  const { navigateGoodsMain } = useLink();
  const { open: dialogOpen, close: dialogClose } = useDialog();
  const handleCancel = () => {
    /** 파트너 & 판매요청상태인경우 바로 리스트 화면으로 이동 */
    if (isPartnerSite && requestStatus === GoodsRequestStatus.SALE_REQUEST) {
      navigateGoodsMain();
      return;
    }

    dialogOpen({
      title: `상품${pageType === PageType.CREATE ? '등록' : '수정'} 취소`,
      content: '지금까지 등록하신 정보들이 삭제됩니다.\n계속 진행하시겠습니까?',
      type: DialogType.CONFIRM,
      onClose: () => {
        dialogClose();
      },
      onConfirm: () => {
        dialogClose();
        navigateGoodsMain();
      },
    });
  };

  // Button View 조건
  const isCreatePage = pageType === PageType.CREATE;
  /**
   * 임시저장
   * @description
   * - 범위 : Manager, Partner
   * - 조건 : 상품등록시
   */
  const isEnableTempButton = isCreatePage;

  /**
   * 저장, 취소
   * @description
   * - 범위 : Manager, Partner
   * - 조건 :
   *  - 공통 : 상품등록/수정시
   *  - Manager Office
   *  - Partner Office : 승인요청상태가 아니라면 노출
   */
  const isEnableSubmitButton = !isPartnerSite || (isPartnerSite && requestStatus !== GoodsRequestStatus.SALE_REQUEST);

  /**
   * 승인요청
   * @description
   * - 범위 : Partner only
   * - 조건 :
   *  - 상품수정시 (상품등록은 requestStatus가 없음)
   *  - requestStatus 가 대기상태 혹은 반려상태일때 노출
   */
  const isEnableRequestButton =
    isPartnerSite && (requestStatus === GoodsRequestStatus.STANDBY || requestStatus === GoodsRequestStatus.SALE_REJECT);

  /**
   * 승인 & 반려 버튼
   * @description
   * - 범위 : Manager only
   * - 조건 :
   *  - requestStatus 가 승인요청상태 혹은 취소요청상태일 경우 노출
   */
  const isEnableRequestFeedbackButton =
    !isPartnerSite &&
    (requestStatus === GoodsRequestStatus.SALE_REQUEST || requestStatus === GoodsRequestStatus.CHANGE_REQUEST);

  return (
    <Box className={classes.root}>
      {/* 임시저장 */}
      {isEnableTempButton && (
        <ButtonWrapper color="secondary" onClick={handleTempSave}>
          임시저장
        </ButtonWrapper>
      )}

      {/* 저장 or 수정 & 취소 */}
      {isEnableSubmitButton && (
        <>
          <ButtonWrapper color="primary" type="button" onClick={handleSubmit}>
            {isCreatePage ? '저장' : '수정'}
          </ButtonWrapper>
          {/* 취소 */}
          <ButtonWrapper variant="outlined" type="button" onClick={handleCancel}>
            취소
          </ButtonWrapper>
        </>
      )}

      {/* 파트너 Only : 승인요청 */}
      {isEnableRequestButton && (
        <ButtonWrapper color="secondary" type="button" onClick={handlePartnerSaleRequest}>
          승인요청
        </ButtonWrapper>
      )}

      {/* 매니저 Only : 승인 & 반려 */}
      {isEnableRequestFeedbackButton && (
        <>
          <ButtonWrapper color="success" type="button" onClick={handleManagerApproval}>
            승인
          </ButtonWrapper>

          <ButtonWrapper color="error" type="button" onClick={handleManagerReject}>
            반려
          </ButtonWrapper>
        </>
      )}

      {/* 디버그 */}
      {!env.isProduction && isEnableSubmitButton && (
        <ButtonWrapper color="secondary" variant="outlined" type="button" onClick={handleDebug}>
          개발 Debugging 버튼
        </ButtonWrapper>
      )}
    </Box>
  );
}

const ButtonWrapper = ({ children, ...props }) => (
  <Button size="large" variant="contained" sx={{ mr: 2, width: 200 }} {...props}>
    {children}
  </Button>
);
