import { useCallback } from 'react';
import { useQueryClient } from 'react-query';
import { useQuery } from '@hooks/useQuery';
import { getBankCombo } from '../apis';
import { QUERY_KEYS } from '../constants';
import { BankItemModel, toBankList } from '../models';
import { ComboBankSchema } from '../schemas';

/**
 * 은행 리스트 조회
 */
export const useGetBankList = (): {
  handleInvalidateQuery: () => void;
  bankList: BankItemModel[];
} => {
  const client = useQueryClient();
  const { data } = useQuery([QUERY_KEYS.BANK_LIST], () => getBankCombo(), {
    select: (data: ComboBankSchema[]) => toBankList(data),
  });

  const handleInvalidateQuery = useCallback(() => {
    client.invalidateQueries(QUERY_KEYS.BANK_LIST);
  }, [client]);

  return {
    handleInvalidateQuery,
    bankList: data ?? [],
  };
};
