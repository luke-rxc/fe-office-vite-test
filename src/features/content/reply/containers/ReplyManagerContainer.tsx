import { useState, useEffect } from 'react';
import type { VFC } from 'react';
import { FormProvider } from 'react-hook-form';
import { Box, Button, Grid } from '@material-ui/core';
import DownloadIcon from '@assets/icons/Download';
import { Layout } from '@components/Layout';
import { ReplySearchForm, ReplyList, ReplyUser, ReplyHistory, ReplyReport } from '../components';
import { ReplyUserModel, ReplyHistoryModel, ReplyReportModel } from '../models';
import { useReplyDeleteService, useReplyListService } from '../services';

type ReplyManagerContainerProps = {};
export const ReplyManagerContainer: VFC<ReplyManagerContainerProps> = () => {
  const { form, replyList, isLoading, pagination, sort, handleReloadList, handleAllListExport } = useReplyListService();
  const { handleReplyDelete, isSuccess: isDeleteSuccess } = useReplyDeleteService();
  const [user, setUser] = useState<ReplyUserModel | null>(null);
  const [report, setReport] = useState<ReplyReportModel[]>([]);
  const [history, setHistory] = useState<ReplyHistoryModel | null>(null);

  const handleReplyUser = (user: ReplyUserModel) => {
    setUser(user);
  };
  const handleReplyReport = (report: ReplyReportModel[]) => {
    setReport(report);
  };
  const handleReplyHistory = (history: ReplyHistoryModel) => {
    setHistory(history);
  };
  useEffect(() => {
    handleReloadList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDeleteSuccess]);
  return (
    <>
      <Layout title="콘텐츠 댓글 관리">
        <FormProvider {...form.formMethod}>
          <ReplySearchForm form={form} />
        </FormProvider>
        <Box sx={{ mt: 3 }}>
          <Grid container>
            {!!replyList.length && (
              <Grid item xs={12} display="flex" justifyContent="flex-end">
                <Button
                  color="primary"
                  startIcon={<DownloadIcon fontSize="small" />}
                  sx={{ m: 1 }}
                  variant="text"
                  onClick={handleAllListExport}
                >
                  전체 다운로드
                </Button>
              </Grid>
            )}
            <Grid item xs={12}>
              <ReplyList
                items={replyList}
                isLoading={isLoading}
                pagination={pagination}
                sort={sort}
                onSelectedUser={handleReplyUser}
                onSelectedReport={handleReplyReport}
                onSelectedHistory={handleReplyHistory}
                onDeleteReply={handleReplyDelete}
              />
            </Grid>
          </Grid>
        </Box>
      </Layout>

      {/* 댓글 작성 사용자  */}
      {user && <ReplyUser user={user} handleConfirm={(e: any) => setUser(null)} />}

      {/* 댓글 신고 상세  */}
      {report.length > 0 && <ReplyReport report={report} handleConfirm={(e: any) => setReport([])} />}

      {/* 댓글 관리 이력  */}
      {history && <ReplyHistory history={history} handleConfirm={(e: any) => setHistory(null)} />}
    </>
  );
};
