import { useDialog } from '@hooks/useDialog';
import { DialogType } from '@models/DialogModel';
import { excelExport, excelImport } from '@utils/excel';
import { RaffleEventUserExcelCode } from '../constants';
import { useModal, useRaffleEventUploadTargetMutation } from '../hooks';
import { RaffleEventUserExcelUploadItem } from '../types';
import { ReturnTypeUseRaffleEventDetailService } from './useRaffleEventDetailService';

interface Props {
  raffleId: number;
  raffleEventTimesFields: ReturnTypeUseRaffleEventDetailService['form']['raffleEventTimesFields'];
  formMethod: ReturnTypeUseRaffleEventDetailService['form']['formMethod'];
  selectedTimesIndex: ReturnTypeUseRaffleEventDetailService['selectedTimesIndex'];
}

export type ReturnTypeUseRaffleEventBulkTargetUploadService = ReturnType<typeof useRaffleEventBulkTargetUploadService>;

/**
 * 이벤트 응모 대상 업로드 service
 */
export const useRaffleEventBulkTargetUploadService = ({
  raffleId,
  raffleEventTimesFields,
  formMethod,
  selectedTimesIndex,
}: Props) => {
  const { setValue } = formMethod;
  const dialog = useDialog();
  const { isOpenModal, handleOpenModal, handleCloseModal } = useModal();

  const { mutateAsync: registRaffleEventUploadTargetUser } = useRaffleEventUploadTargetMutation({
    onError: (error) => {
      dialog.open({
        content: `이벤트 응모 대상 파일 업로드 처리 중 문제가 발생했습니다.\r\n(${error.data.message})`,
        type: DialogType.ALERT,
      });
    },
  });

  /**
   * 이벤트 응모 대상 템플릿 excel download
   */
  const handleDownloadRaffleEventUserTemplateExcel = async () => {
    excelExport({
      headers: [['사용자 이메일']],
      sheetData: [['']],
      autoFit: true,
      autoFitRatio: 1.5,
      columnMinSize: 10,
      fileName: '이벤트 응모 대상 템플릿.xlsx',
    });
  };

  const getItemKeyCode = () => {
    return Object.keys(RaffleEventUserExcelCode).reduce((target, item) => {
      target[RaffleEventUserExcelCode[item]] = item;

      return target;
    }, {});
  };

  /**
   *  이벤트 응모 대상자 excel 파일 등록
   */
  const handleUploadRaffleEventUserExcelData = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    const uploadedFile = (await excelImport({
      file: files[0],
    })) as Array<Record<string, string>>;
    e.target.value = '';

    const itemKeyCode = getItemKeyCode();

    const emailList = uploadedFile
      .map<RaffleEventUserExcelUploadItem>((item) => {
        return Object.keys(item).reduce<RaffleEventUserExcelUploadItem>((target, key) => {
          if (itemKeyCode[key]) {
            target[itemKeyCode[key]] = item[key];
          }

          return target;
        }, {} as RaffleEventUserExcelUploadItem);
      })
      .map((item) => item.email);

    if (emailList.length === 0) {
      dialog.open({
        type: DialogType.ALERT,
        title: '알림',
        content: '사용자 정보가 없습니다.\r\n업로드 엑셀파일을 확인해주세요.',
      });
      return;
    }

    const raffleItemId = raffleEventTimesFields[selectedTimesIndex].itemId;

    const { userCount } = await registRaffleEventUploadTargetUser({
      raffleId,
      raffleItemId,
      emailList,
    });

    const resultMessage =
      userCount > 0
        ? '이벤트 응모 대상 파일 업로드가 완료되었습니다.'
        : '이벤트 응모 대상 파일 업로드가 일부 완료되었습니다.';

    if (userCount > 0) {
      setValue(`itemList.${selectedTimesIndex}.targetUserCount`, userCount, { shouldValidate: true });
    }

    dialog.open({
      type: DialogType.ALERT,
      title: '알림',
      content: `${resultMessage}\r\n${`(전체 응모대상: ${emailList.length}건 / 성공: ${userCount}건)`}`,
      onClose: () => {
        dialog.close();
        handleCloseModal();
      },
    });
  };

  const handleOpenRaffleEventModel = () => {
    handleOpenModal();
  };

  const handleCloseRaffleEventModel = () => {
    handleCloseModal();
  };

  return {
    isOpenModalRaffleEvent: isOpenModal,
    onDownloadRaffleEventUserTemplateExcel: handleDownloadRaffleEventUserTemplateExcel,
    onUploadRaffleEventUserExcelData: handleUploadRaffleEventUserExcelData,
    onOpenRaffleEventModel: handleOpenRaffleEventModel,
    onCloseRaffleEventModel: handleCloseRaffleEventModel,
  };
};
