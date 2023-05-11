import { useEffect, useState } from 'react';
import { Divider, Box, Typography, Grid } from '@material-ui/core';
import { Dialog } from '@components/Dialog';
import { DialogType } from '@models/DialogModel';
import { ListTitle } from '@components/ListTitle';
import { GoodsKind, TicketType } from '@constants/goods';
import { OptListModel, TicketGoodsModel, TicketInfoModel } from '../models';
import { OptRegisterModeOptions, OptRegisterKinds, PageType } from '../constants';
import {
  useDetailOptionBaseService,
  useDetailOptionExcelService,
  useDetailOptionManageService,
  useDetailOptionRegisterModeService,
} from '../services/detailOption';
import { ToggleButtonGroup } from '../components/form';
import { DetailOptionBase, DetailOptionLayout } from '../components/detailOption';
import { DetailToolTip } from '../components/detail';
import { useLogger, usePageType } from '../hooks';
import { DetailOptionTableContainer } from './DetailOptionTableContainer';

interface Props {
  ticketAgentId: number | null;
  ticketAgentList: TicketGoodsModel[];
  selectedGoodsKind: GoodsKind;
  selectedTicketInfo: TicketInfoModel | null;
  initOptionTitles?: string[];
  initOptionLists?: OptListModel[];
  isTempListLoadStatus?: boolean;
  selectedCommission: number;
}

export const DetailOptionContainer: React.FC<Props> = ({
  ticketAgentId,
  ticketAgentList,
  selectedGoodsKind,
  selectedTicketInfo,
  initOptionTitles = null,
  initOptionLists = null,
  isTempListLoadStatus = false,
  selectedCommission,
}) => {
  const { type: pageType, isPartnerSite } = usePageType();

  // 티켓 타입인지 체크
  const isGoodsKindTicket = [GoodsKind.TICKET_AGENT as string, GoodsKind.TICKET_NORMAL as string].includes(
    selectedGoodsKind,
  );
  // 티켓 상품에 대한 description 정보를 저장하는 변수
  const [isTicketAgentActive, setIsTicketAgentActive] = useState(false);
  // 티켓 타입 정보
  const { typeId: selectedTicketTypeId } = selectedTicketInfo ?? {};
  // 예약 타입
  const isBookedTicketType = [TicketType.BOOKING_DATED as string, TicketType.BOOKING_UNDATED as string].includes(
    selectedTicketTypeId,
  );
  // 티켓 : 숙박권 날짜지정 타입 - 엑셀업로드로만 등록진행 여부
  const isBookDatedTicket = selectedTicketTypeId === TicketType.BOOKING_DATED;

  // Option 기준 설정
  const { fieldValues, makableBaseOptions, addBaseOption, resetInputBaseOption, handleChangeBaseOption } =
    useDetailOptionBaseService();

  // Option 관리
  const {
    optionsInfo,
    optionListsFieldArray,
    addOptionList: handleAddOptionList,
    updateOptionsInfo,
    makeSingleOption,
    makeOptionLists,
  } = useDetailOptionManageService({
    commissionRate: selectedCommission,
    initOptionTitles,
    initOptionLists,
    /** @since 221004 티켓 옵션의 생성 제약을 없앰 */
    manualOptListLimit: null,
  });

  // Options Table 내 Excel Export, Import
  const { handleExcelDownload, handleExcelUpload } = useDetailOptionExcelService({
    updateOptionsInfo,
    selectedGoodsKind,
    selectedTicketTypeId,
  });

  // 옵션 등록 모드
  const {
    prevRegisterType,
    currentRegisterType,
    isRegisterModalOpen,
    getOptionRegister,
    handleRegisterType,
    handleChangeCancelRegisterType,
    handleChangeRegisterType,
    handleResetRegisterType,
  } = useDetailOptionRegisterModeService();

  useEffect(() => {
    // single mode 변경시 단일 상품 등록 모드로 변경
    // 숙박권 날짜지정 타입은 옵션을 엑셀로만 생성하기 때문에, 해당 사항 제외
    if (currentRegisterType === OptRegisterKinds.STOP && prevRegisterType !== null && !isBookDatedTicket) {
      makeSingleOption();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentRegisterType]);

  useEffect(() => {
    /** 임시 저장 리스트를 로드중인 케이스 */
    if (isTempListLoadStatus) {
      return;
    }

    /** 상품 분류가 변경 */
    if (pageType === PageType.CREATE && selectedGoodsKind) {
      handleResetRegisterType();
      return;
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedGoodsKind]);

  useEffect(() => {
    /** 임시 저장 리스트를 로드중인 케이스 */
    if (isTempListLoadStatus) {
      return;
    }

    /** 상품 분류 > 티켓을 변경한 경우 옵션 Reset */
    if (pageType === PageType.CREATE && selectedTicketInfo) {
      handleResetRegisterType();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTicketInfo?.typeId]);

  useEffect(() => {
    const isTicketAgent = selectedGoodsKind === GoodsKind.TICKET_AGENT && ticketAgentId && !!ticketAgentList;
    setIsTicketAgentActive(isTicketAgent);
  }, [selectedGoodsKind, ticketAgentId, ticketAgentList]);

  useLogger('DetailOptionContainer');

  // 티켓 타입이면서 티켓 선택이 안된 경우 Notice
  const isOptionDisabled = !isPartnerSite && pageType === PageType.CREATE && isGoodsKindTicket && !selectedTicketInfo;
  if (isOptionDisabled) {
    return (
      <DetailOptionLayout>
        <Typography variant="body1">"티켓(연동/일반) 선택"에서 티켓을 먼저 선택해주세요.</Typography>
      </DetailOptionLayout>
    );
  }

  return (
    <>
      <DetailOptionLayout>
        {/* 상품등록 모드 */}
        {!isBookDatedTicket && (
          <Grid container alignItems="center" sx={{ p: 2 }}>
            <Grid item md={1} xs={12} display="flex">
              <ListItemWrapper
                listTitleName="옵션사용여부"
                toolTip={`옵션 등록 후 옵션사용여부를 변경할 경우 기존에 작성된 내용은 초기화됩니다.\r\n- 사용함 : 옵션이 2개 이상인 경우 옵션상품으로 등록해주세요.\r\n- 사용안함 : 옵션이 1개로 구성된 경우 사용안함으로 등록해주세요.`}
              />
            </Grid>
            <Grid item md={11} xs={12}>
              <ToggleButtonGroup
                name="optionRegister"
                options={OptRegisterModeOptions}
                exclusive
                size="small"
                onChange={handleRegisterType}
              />
            </Grid>
          </Grid>
        )}

        {/* // 상품등록 모드 */}
        {getOptionRegister() !== OptRegisterKinds.STOP && !isBookDatedTicket && (
          <Grid container alignItems="center" sx={{ p: 2 }}>
            <Grid item md={1} xs={12} display="flex">
              <ListItemWrapper
                listTitleName="옵션명갯수"
                toolTip={`옵션 구조는 최대 3개까지 생성 가능합니다.\r\n- 예시 : 색상(1depth) x 사이즈(2depth) x 용량(3depth)`}
              />
            </Grid>
            <Grid item md={11} xs={12}>
              <DetailOptionBase
                options={makableBaseOptions}
                onChange={handleChangeBaseOption}
                onAddOption={addBaseOption}
                onResetInputOption={resetInputBaseOption}
                onApplyOption={makeOptionLists}
                fieldValues={fieldValues}
              />
            </Grid>
          </Grid>
        )}

        {isBookDatedTicket && (
          <Typography color="#f00" variant="body2" paragraph={true}>
            숙박권_날짜 타입의 옵션등록은 엑셀업로드만 등록 가능합니다
          </Typography>
        )}

        <Divider sx={{ my: 3 }} />

        {/* 옵션 목록 */}
        <Box>
          {/* header */}
          <Grid item md={12} xs={12} display="flex" sx={{ p: 2 }}>
            <ListItemWrapper
              listTitleName="옵션목록"
              toolTip="실제 서비스 화면에 노출되는 옵션명을 입력 후, 해당 옵션의 정상가, 판매가, 재고를 등록해주세요."
            />
          </Grid>

          {/* // header * todo ticket id */}
          {isTicketAgentActive && (
            <>
              <Typography color="#f00" variant="body2" paragraph={true}>
                {pageType === PageType.CREATE && (
                  <>옵션 리스트 생성 후, 테이블 리스트의 우측에 있는 티켓(콤보박스)을 우선 선택해주세요.</>
                )}
                {pageType === PageType.MODIFY && (
                  <>상품등록시에 등록한 옵션은 옵션명, 재고수량, 수수료, 티켓선택이 수정 가능합니다.</>
                )}
              </Typography>
            </>
          )}

          <Box sx={{ mt: 3 }}>
            <DetailOptionTableContainer
              optionsInfo={optionsInfo}
              fieldArray={optionListsFieldArray}
              ticketAgentList={isTicketAgentActive ? ticketAgentList : null}
              selectedGoodsKind={selectedGoodsKind}
              isBookedTicketType={isBookedTicketType}
              isBookDatedTicket={isBookDatedTicket}
              isPartnerSite={isPartnerSite}
              onAddOptionList={handleAddOptionList}
              onExcelDownload={handleExcelDownload}
              onExcelUpload={handleExcelUpload}
            />
          </Box>
        </Box>
      </DetailOptionLayout>

      <Dialog
        isOpen={isRegisterModalOpen}
        content={`${'옵션등록방법 변경 시, 옵션 정보를 새로 다시 등록해야합니다.\r\n변경하시겠습니까?'}`}
        type={DialogType.CONFIRM}
        onClose={handleChangeCancelRegisterType}
        onConfirm={handleChangeRegisterType}
      />
    </>
  );
};

const ListItemWrapper = ({ listTitleName, toolTip }: { listTitleName: string; toolTip?: string }) => {
  return (
    <>
      <Box sx={{ width: 18, height: 18, flexShrink: 0 }}>{toolTip && <DetailToolTip message={toolTip} />}</Box>
      <ListTitle name={listTitleName} sx={{ ml: 1 }} />
    </>
  );
};
