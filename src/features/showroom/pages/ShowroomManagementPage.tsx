import { ShowroomProvider } from '../contexts';
import { ShowroomManagementContainer } from '../containers';

/**
 * 쇼룸 관리 페이지
 */
export const ShowroomManagementPage = (): JSX.Element => {
  return (
    <ShowroomProvider>
      <ShowroomManagementContainer />
    </ShowroomProvider>
  );
};

export default ShowroomManagementPage;
