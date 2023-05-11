import { GoodsModifyContainer } from '../containers';
import { PageTypeProvider } from '../contexts';

const GoodsModifyPage = () => {
  return (
    <PageTypeProvider>
      <GoodsModifyContainer />
    </PageTypeProvider>
  );
};

export default GoodsModifyPage;
