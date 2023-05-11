/**
 * 블랙 리스트 관리
 */
import { Fragment, useCallback, useState } from 'react';
import { FormProvider } from 'react-hook-form';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Box,
  Card,
  CardContent,
  CardHeader,
  ListItem,
  Button,
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import styled from '@emotion/styled';
import { FormControlTextArea } from '@components/form';
import { ListTitle } from '@components/ListTitle';
import { useDialog } from '@hooks/useDialog';
import { DialogType } from '@models/DialogModel';
import { MemberBlackLogFormField, MemberBlackListLogModel } from '../models';
import { useMemberBlackListService } from '../services';

type MemberBlackListProps = {
  black: boolean;
  onRefreshUserInfo?: () => void;
};

export const MemberBlackList = ({ black = false, onRefreshUserInfo: handleRefreshUserInfo }: MemberBlackListProps) => {
  const { open: openDialog, close: closeDialog } = useDialog();
  const {
    logList = [],
    formMethod,
    handleSubmitBlackLog,
    handleUpdateBlackToggle,
    handleRefreshBlackLog,
  } = useMemberBlackListService();
  const [isBlack, setIsBlack] = useState<boolean>(black);
  const [historyExpandState, setHistoryExpandState] = useState<boolean>(true);

  const getBlackStatus = useCallback((state: boolean) => {
    return state ? '지정(Y)' : ' 미지정(N)';
  }, []);

  const handleChangeStatus = useCallback(() => {
    openDialog({
      title: '상태변경',
      content: `블랙리스트 상태를\r\n${getBlackStatus(!isBlack)}으로 변경할까요?`,
      type: DialogType.CONFIRM,
      onConfirm: async () => {
        try {
          const blackStatus = await handleUpdateBlackToggle();
          setIsBlack(blackStatus);
          handleRefreshBlackLog();
          handleRefreshUserInfo?.();
          closeDialog();
        } catch (err) {
          toast.error(err.data.message);
        }
      },
    });
  }, [
    isBlack,
    openDialog,
    closeDialog,
    getBlackStatus,
    handleRefreshBlackLog,
    handleUpdateBlackToggle,
    handleRefreshUserInfo,
  ]);

  return (
    <>
      <Card
        variant="outlined"
        sx={{
          backgroundColor: 'background.paper',
          minHeight: '100%',
          p: 3,
        }}
      >
        <CardHeader title="블랙리스트 관리" />
        <CardContent>
          <ListItem component="div" sx={{ mb: 3, alignItems: 'start' }}>
            <ListTitle name="상태" width={100} />
            <Box>
              <Typography variant="body1" component="span">
                {getBlackStatus(isBlack)}
              </Typography>
              <Button color="primary" type="button" variant="contained" sx={{ ml: 2 }} onClick={handleChangeStatus}>
                변경
              </Button>
            </Box>
          </ListItem>
          <ListItem component="div" sx={{ mb: 3, alignItems: 'start' }}>
            <ListTitle name="메모" width={100} />
            <FormProvider {...formMethod}>
              <form onSubmit={handleSubmitBlackLog} style={{ width: '100%' }}>
                <FormTextAreaStyled>
                  <FormControlTextArea<MemberBlackLogFormField>
                    name="message"
                    maxRows={4}
                    minRows={4}
                    placeholder="메모를 입력해주세요"
                    maxLength={5000}
                    width="100%"
                  />
                </FormTextAreaStyled>
                <Box sx={{ mt: 2, textAlign: 'right' }}>
                  <Button type="submit" variant="contained">
                    저장
                  </Button>
                </Box>
              </form>
            </FormProvider>
          </ListItem>
          <ListItem component="div" sx={{ alignItems: 'start' }}>
            <ListTitle name="히스토리" width={100} />
            <Box sx={{ width: '100%' }}>
              <Accordion expanded={historyExpandState} onChange={(_, expanded) => setHistoryExpandState(expanded)}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography sx={{ width: '100%', textAlign: 'right' }}>
                    {historyExpandState ? '접기' : '펼치기'}
                  </Typography>
                </AccordionSummary>
                <AccordionDetailsStyled>
                  {logList.map((log: MemberBlackListLogModel) => {
                    return (
                      <MemoStyled>
                        <Typography variant="body1" component="span">
                          {format(log.createdDateTime, 'yyyy.MM.dd')}
                        </Typography>
                        <Typography className="separator" variant="body1" component="span">
                          |
                        </Typography>
                        <Typography variant="body1" component="span" color="primary" sx={{ fontWeight: 700 }}>
                          {log.email}
                        </Typography>
                        <Typography className="separator" variant="body1" component="span">
                          |
                        </Typography>
                        <Typography variant="body1" component="span">
                          {nl2br(log.message)}
                        </Typography>
                      </MemoStyled>
                    );
                  })}
                </AccordionDetailsStyled>
              </Accordion>
            </Box>
          </ListItem>
        </CardContent>
      </Card>
    </>
  );
};

const FormTextAreaStyled = styled(Box)`
  div {
    width: 100%;
  }
`;

const AccordionDetailsStyled = styled(AccordionDetails)`
  max-height: 300px;
  overflow-y: auto;
`;

const MemoStyled = styled(Box)`
  display: flex;
  flex-direction: row;
  margin-top: 15px;
  &:first-child {
    margin-top: 0;
  }
  & .separator {
    margin: 0 15px;
  }
`;

/**
 * 문자열 내 개행문자 react element <br> 태그로 치환하여 리턴
 * @param text
 * @returns
 */
const nl2br = (text: string) => {
  return text.split(/(?:\r\n|\r|\n)/).map((line: string, idx: number, arr: string[]) => {
    return (
      // eslint-disable-next-line react/no-array-index-key
      <Fragment key={`${line}-${idx}`}>
        {line}
        {idx < arr.length - 1 && <br />}
      </Fragment>
    );
  });
};
