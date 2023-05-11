import { useParams } from 'react-router-dom';
import { MainShortcutModifyContainer } from '../containers';

const MainShortcutModifyPage = () => {
  const { shortcutId } = useParams();

  return <MainShortcutModifyContainer shortcutId={shortcutId} />;
};

export default MainShortcutModifyPage;
