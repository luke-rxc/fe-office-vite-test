import { useCallback, useState } from 'react';
import { FormProvider } from 'react-hook-form';
import AppBar from '@material-ui/core/AppBar';
import { Button, Grid, Tab, Tabs } from '@material-ui/core';
import { Layout } from '@components/Layout';
import { ContentSearchForm, ContentCreator, ContentDefault, ContentList } from '../components';
import { CONTENT_TYPE_OPTIONS } from '../constants';
import { useContentListService } from '../services';

export const ContentListContainer = () => {
  const [isRegister, setIsRegister] = useState<boolean>(false); // 등록 팝업
  const [isModify, setIsModify] = useState<boolean>(false); // 수정 팝업
  const [selectModifyId, setSelectModifyId] = useState<number>(null); // 기본관리 수정시 활성화 ID

  const {
    form,
    keywordComboList,
    contentList,
    isLoading,
    pagination,
    getValues,
    handleChangeDateRange,
    handleChangeContentType,
    handleReset,
    handleAfterCreator,
    handleAfterModify,
    handleDuplicate,
  } = useContentListService();
  const [tabValue, setTabValue] = useState(getValues('type'));

  /**
   * 콘텐츠 생성 완료
   */
  const handleSuccessCreator = useCallback(() => {
    setIsRegister(false);
    setTabValue('');
    handleAfterCreator();
  }, [handleAfterCreator]);

  /**
   * 콘텐츠 생성 취소
   */
  const handleCancelCreator = useCallback(() => {
    setIsRegister(false);
  }, []);

  /**
   * 기본관리 수정 닫기
   */
  const handleSuccessModify = useCallback(() => {
    setIsModify(false);
    setSelectModifyId(null);
    handleAfterModify();
  }, [handleAfterModify]);

  /**
   * 기본관리 취소
   */
  const handleCancelModify = useCallback(() => {
    setIsModify(false);
    setSelectModifyId(null);
    handleReset();
  }, [handleReset]);

  /**
   * 기본관리 수정
   * @param id
   */
  const handleModifyContentDefault = useCallback((id: number) => {
    setSelectModifyId(id);
    setIsModify(true);
  }, []);

  /**
   * 탭변경
   */
  const handleChangeTab = useCallback(
    (event, newValue) => {
      setTabValue(newValue);
      handleChangeContentType(newValue);
    },
    [handleChangeContentType],
  );

  return (
    <>
      <Layout title="콘텐츠 관리 및 생성">
        <FormProvider {...form.formMethod}>
          <ContentSearchForm
            form={form}
            keywordComboList={keywordComboList}
            onChangeDateRange={handleChangeDateRange}
          />
        </FormProvider>

        <Grid container direction="row" justifyContent="end" alignItems="center" sx={{ mt: 3, mb: 3 }}>
          <Button onClick={() => setIsRegister(true)} variant="contained">
            신규 컨텐츠 등록
          </Button>
        </Grid>

        <AppBar position="static" sx={{ background: 'white' }}>
          <Tabs
            value={tabValue}
            onChange={handleChangeTab}
            indicatorColor="primary"
            textColor="primary"
            scrollButtons="auto"
          >
            <Tab value="" label="전체컨텐츠" sx={{ height: 80 }} />
            {CONTENT_TYPE_OPTIONS.map((contentType, index) => (
              <Tab
                style={{ textTransform: 'none' }}
                key={index}
                value={contentType.value}
                label={contentType.label}
                sx={{ height: 80 }}
              />
            ))}
          </Tabs>
        </AppBar>
        <ContentList
          items={contentList}
          isLoading={isLoading}
          pagination={pagination}
          onModify={handleModifyContentDefault}
          onCopy={handleDuplicate}
        />
      </Layout>
      {/* 등록 */}
      {isRegister && <ContentCreator onConfirm={handleSuccessCreator} onCancel={handleCancelCreator} />}
      {/* 수정 */}
      {isModify && (
        <ContentDefault contentId={selectModifyId} onConfirm={handleSuccessModify} onCancel={handleCancelModify} />
      )}
    </>
  );
};
