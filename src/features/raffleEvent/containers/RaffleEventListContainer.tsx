import { Layout } from '@components/Layout';
import { Button } from '@material-ui/core';
import { FormProvider } from 'react-hook-form';
import { RaffleEventCreate, RaffleEventList, SearchForm } from '../components';
import { useRaffleEventCreateService, useRaffleEventListService } from '../services';

export const RaffleEventListContainer = () => {
  const {
    form: { formMethod, ...formProps },
    ...raffleEventListProps
  } = useRaffleEventListService();

  const { handleOpenModal, ...raffleEventCreateService } = useRaffleEventCreateService();

  return (
    <Layout
      title="추첨 이벤트 관리"
      actions={
        <Button variant="contained" size="large" onClick={handleOpenModal}>
          신규 이벤트 생성
        </Button>
      }
    >
      <FormProvider {...formMethod}>
        <SearchForm form={formProps} />
      </FormProvider>
      <RaffleEventList {...raffleEventListProps} />

      <RaffleEventCreate {...raffleEventCreateService} />
    </Layout>
  );
};
