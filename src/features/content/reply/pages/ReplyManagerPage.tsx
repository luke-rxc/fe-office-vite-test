import { Helmet } from 'react-helmet-async';
import { ReplyManagerContainer } from '../containers';

const ReplyManagerPage = () => {
  return (
    <>
      <Helmet>
        <title>콘텐츠 댓글 관리</title>
      </Helmet>
      <ReplyManagerContainer />;
    </>
  );
};

export default ReplyManagerPage;
