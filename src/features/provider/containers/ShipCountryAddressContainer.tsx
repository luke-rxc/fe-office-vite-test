import type { VFC } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { ClassNameMap } from '@material-ui/styles/withStyles';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import { Layout } from '@components/Layout';
import { Table, TableColumnProps } from '@components/table/Table';
import { Modal } from '@components/Modal';
import { useGetShippingCountry } from '../services';
import { ShippingCountryModel } from '../models';

const locations = [{ path: '/provider/shipCountry/', text: '제주/도서산간지역' }, { text: '조회' }];

export const useStyles = makeStyles(() => ({
  table: {
    '& table': {
      minWidth: 'initial',
    },
  },
}));

const columns: TableColumnProps<ShippingCountryModel>[] = [
  {
    label: '우편번호',
    dataKey: 'postCode',
    width: '14%',
    align: 'center',
  },
  {
    label: '주소지',
    dataKey: 'address',
    width: '55%',
  },
  {
    label: '제주권',
    dataKey: 'isJeju',
    width: '15%',
    align: 'center',
    render: (value: string, item: ShippingCountryModel) => {
      return <>{item.isJeju ? <CheckCircleOutlineIcon /> : ''}</>;
    },
  },
  {
    label: '제주 외 도서산간',
    dataKey: 'isEtc',
    width: '15%',
    align: 'center',
    render: (value: string, item: ShippingCountryModel) => {
      return <>{item.isEtc ? <CheckCircleOutlineIcon /> : ''}</>;
    },
  },
];

/**
 * 산간 도서
 * @returns
 */
export const ShipCountryAddressContainer: VFC = () => {
  const classes: ClassNameMap = useStyles();
  const { addressList, isSuccess } = useGetShippingCountry(); // 제주 도서산간지역 조회

  const handleClose = () => {
    window.close();
  };

  return (
    <>
      <Layout title="제주/도서산간지역" locations={locations}>
        {isSuccess && (
          <>
            <Modal
              title="제주/도서산간지역"
              open={true}
              maxWidth="initial"
              width={1000}
              confirmText="닫기"
              onConfirm={() => handleClose()}
            >
              <div className={classes.table}>
                <Table columns={columns} items={addressList} rowKey="id" pagination={false}></Table>
              </div>
            </Modal>
          </>
        )}
      </Layout>
    </>
  );
};
