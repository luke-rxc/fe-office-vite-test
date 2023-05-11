import { GoodsCreateContainer } from '../containers';
import { PageTypeProvider } from '../contexts';

const GoodsCreatePage = () => {
  return (
    <PageTypeProvider>
      <GoodsCreateContainer />
    </PageTypeProvider>
  );
};

export default GoodsCreatePage;
