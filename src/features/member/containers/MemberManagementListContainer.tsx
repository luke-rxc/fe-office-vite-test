import styled from '@emotion/styled';
import { Layout } from '@components/Layout';
import { Box, Button, Card } from '@material-ui/core';
import { FormProvider } from 'react-hook-form';
import { useMemberManagementListService } from '../services';
import { MemberList, MemberSearchForm } from '../components';
import Download from '@material-ui/icons/Download';

export const MemberManagementListContainer = () => {
  const {
    memberList,
    isLoading,
    form: { formMethod, onSubmit, onReset, onChangeJoinDateRange, onChangeLoginDateRange },
    pagination,
    action: { onDownloadAll },
  } = useMemberManagementListService();

  return (
    <>
      <Layout title="사용자 관리" locations={[{ path: '/', text: '사용자' }, { text: '사용자 관리' }]}>
        <FormProvider {...formMethod}>
          <Card>
            <WrapperStyled>
              <MemberSearchForm
                onSubmit={onSubmit}
                onReset={onReset}
                onChangeJoinDateRange={onChangeJoinDateRange}
                onChangeLoginDateRange={onChangeLoginDateRange}
              />
            </WrapperStyled>
          </Card>
        </FormProvider>
        <Box sx={{ p: '10px' }} />
        <MemberList
          items={memberList}
          isLoading={isLoading}
          pagination={pagination}
          actions={
            <Button type="button" variant="outlined" onClick={onDownloadAll} startIcon={<Download />}>
              전체 다운로드
            </Button>
          }
        />
      </Layout>
    </>
  );
};

const WrapperStyled = styled(Box)`
  min-height: 100%;
  padding: 25px 40px;
`;
