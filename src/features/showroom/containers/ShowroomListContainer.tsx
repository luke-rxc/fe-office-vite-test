import { useState } from 'react';
import { Button } from '@material-ui/core';
import { Layout } from '@components/Layout';
import { ShowroomList, ShowroomSearch } from '../components';
import { useShowroomListService } from '../services';
import { ShowroomCreateModalContainer } from './ShowroomCreateModalContainer';

/**
 * 쇼룸 조회(메인) 로케이션
 */
const ShowroomListPageLocation = {
  title: '쇼룸 조회/관리',
  locations: [
    { text: '쇼룸', path: '/showroom' },
    { text: '쇼룸 조회/관리', path: '/showroom' },
  ],
};

/**
 * 쇼룸 목록 조회 컨테이너
 */
export const ShowroomListContainer = () => {
  const { list, total, isLoading, formMethods, formOptions, handler } = useShowroomListService();
  const [showModal, setShowModal] = useState(false);
  const handleShowModal = () => setShowModal(true);
  const handleHideModal = () => setShowModal(false);

  return (
    <Layout
      actions={<Button variant="contained" color="primary" children="+ 신규 쇼룸 생성" onClick={handleShowModal} />}
      {...ShowroomListPageLocation}
    >
      <ShowroomSearch
        formMethods={formMethods}
        formOptions={formOptions}
        onReset={handler.searchReset}
        onSearch={handler.search}
      />

      <ShowroomList
        total={total}
        items={list}
        isLoading={isLoading}
        type={formMethods.getValues('type')}
        page={formMethods.getValues('page')}
        size={formMethods.getValues('size')}
        onChangePage={handler.changePagination}
        onChangeType={handler.ChangeShowroomType}
      />

      {showModal && <ShowroomCreateModalContainer onClose={handleHideModal} />}
    </Layout>
  );
};
