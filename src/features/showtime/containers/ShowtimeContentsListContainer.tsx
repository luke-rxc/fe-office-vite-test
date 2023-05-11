import { Layout } from '@components/Layout';
import { Button } from '@material-ui/core';
import { FormProvider } from 'react-hook-form';
import { SearchForm, ShowtimeContentList } from '../components';
import { useShowtimeContentsListService, useShowroomService, useKeywordService } from '../services';

export const ShowtimeContentsListContainer = () => {
  const { showroomComboList } = useShowroomService();
  const { keywordComboList } = useKeywordService();

  const {
    form,
    filterMore,
    showtimeContentsColumns,
    showtimeContentsList,
    showtimeContentListLoading,
    pagination,
    handleClickGoCreateStandard,
    handleClickGoCreateAuction,
    handleClickShowMore,
    handleChangeLiveRange,
  } = useShowtimeContentsListService({
    showroomComboList: showroomComboList ?? [],
    keywordComboList: keywordComboList ?? [],
  });

  return (
    <Layout
      title="라이브 콘텐츠 조회"
      actions={[
        <Button
          key="btn-standard"
          color="primary"
          variant="contained"
          size="large"
          onClick={handleClickGoCreateStandard}
        >
          일반 라이브 등록
        </Button>,
        <Button
          key="btn-auction"
          color="secondary"
          variant="contained"
          size="large"
          sx={{ ml: '10px' }}
          onClick={handleClickGoCreateAuction}
        >
          경매 라이브 등록
        </Button>,
      ]}
    >
      <>
        <FormProvider {...form.formMethod}>
          <SearchForm
            form={form}
            more={filterMore}
            showroomOptions={showroomComboList}
            keywordOptions={keywordComboList}
            onClickShowMore={handleClickShowMore}
            onChangeLiveRange={handleChangeLiveRange}
          />
        </FormProvider>
        <ShowtimeContentList
          columns={showtimeContentsColumns}
          items={showtimeContentsList}
          isLoading={showtimeContentListLoading}
          pagination={pagination}
        />
      </>
    </Layout>
  );
};
