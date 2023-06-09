import { useState } from 'react';
import type { ChangeEvent, FC, MouseEvent } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { format } from 'date-fns';
import numeral from 'numeral';
import PropTypes from 'prop-types';
import {
  Box,
  Button,
  Card,
  Checkbox,
  IconButton,
  InputAdornment,
  Link,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
} from '@material-ui/core';
import ArrowRightIcon from '../../../assets/icons/ArrowRight';
import PencilAltIcon from '../../../assets/icons/PencilAlt';
import SearchIcon from '../../../assets/icons/Search';
import type { Invoice, InvoiceStatus } from '../../../schemas/invoice';
import Label from '../../../components/Label';
import Scrollbar from '../../../components/Scrollbar';

interface InvoiceListTableProps {
  invoices: Invoice[];
}

interface Filters {
  status?: InvoiceStatus;
}

const statusOptions = [
  {
    label: 'All',
    value: 'all',
  },
  {
    label: 'Paid',
    value: 'paid',
  },
  {
    label: 'Pending',
    value: 'pending',
  },
  {
    label: 'Canceled',
    value: 'canceled',
  },
];

const sortOptions = [
  {
    label: 'Newest first',
    value: 'createdAt|desc',
  },
  {
    label: 'Oldest first',
    value: 'createdAt|asc',
  },
];

const getStatusLabel = (invoiceStatus: InvoiceStatus): JSX.Element => {
  const map = {
    canceled: {
      color: 'error',
      text: 'Canceled',
    },
    paid: {
      color: 'success',
      text: 'Paid',
    },
    pending: {
      color: 'warning',
      text: 'Pending',
    },
  };

  const { text, color }: any = map[invoiceStatus];

  return <Label color={color}>{text}</Label>;
};

const applyFilters = (invoices: Invoice[], query: string, filters: Filters): Invoice[] =>
  invoices.filter((invoice) => {
    let matches = true;

    if (query) {
      const properties = ['name', 'email'];
      let containsQuery = false;

      properties.forEach((property) => {
        if (invoice.customer[property].toLowerCase().includes(query.toLowerCase())) {
          containsQuery = true;
        }
      });

      if (!containsQuery) {
        matches = false;
      }
    }

    if (filters.status && invoice.status !== filters.status) {
      matches = false;
    }

    return matches;
  });

const applyPagination = (invoices: Invoice[], page: number, limit: number): Invoice[] =>
  invoices.slice(page * limit, page * limit + limit);

const InvoiceListTable: FC<InvoiceListTableProps> = (props) => {
  const { invoices, ...other } = props;
  const [selectedInvoices, setSelectedInvoices] = useState<string[]>([]);
  const [page, setPage] = useState<number>(0);
  const [limit, setLimit] = useState<number>(10);
  const [query, setQuery] = useState<string>('');
  const [sort, setSort] = useState<string>(sortOptions[0].value);
  const [filters, setFilters] = useState<Filters>({
    status: null,
  });

  const handleQueryChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setQuery(event.target.value);
  };

  const handleStatusChange = (event: ChangeEvent<HTMLInputElement>): void => {
    let value = null;

    if (event.target.value !== 'all') {
      value = event.target.value;
    }

    setFilters((prevFilters) => ({
      ...prevFilters,
      status: value,
    }));
  };

  const handleSortChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setSort(event.target.value);
  };

  const handleSelectAllInvoices = (event: ChangeEvent<HTMLInputElement>): void => {
    setSelectedInvoices(event.target.checked ? invoices.map((invoice) => invoice.id) : []);
  };

  const handleSelectOneInvoice = (event: ChangeEvent<HTMLInputElement>, invoiceId: string): void => {
    if (!selectedInvoices.includes(invoiceId)) {
      setSelectedInvoices((prevSelected) => [...prevSelected, invoiceId]);
    } else {
      setSelectedInvoices((prevSelected) => prevSelected.filter((id) => id !== invoiceId));
    }
  };

  const handlePageChange = (event: MouseEvent<HTMLButtonElement> | null, newPage: number): void => {
    setPage(newPage);
  };

  const handleLimitChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setLimit(parseInt(event.target.value, 10));
  };

  // Usually query is done on backend with indexing solutions
  const filteredInvoices = applyFilters(invoices, query, filters);
  const paginatedInvoices = applyPagination(filteredInvoices, page, limit);
  const enableBulkActions = selectedInvoices.length > 0;
  const selectedSomeInvoices = selectedInvoices.length > 0 && selectedInvoices.length < invoices.length;
  const selectedAllInvoices = selectedInvoices.length === invoices.length;

  return (
    <Card {...other}>
      <Box
        sx={{
          alignItems: 'center',
          display: 'flex',
          flexWrap: 'wrap',
          m: -1,
          p: 2,
        }}
      >
        <Box
          sx={{
            m: 1,
            maxWidth: '100%',
            width: 500,
          }}
        >
          <TextField
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
            onChange={handleQueryChange}
            placeholder="Search invoices by customer"
            value={query}
            variant="outlined"
          />
        </Box>
        <Box
          sx={{
            m: 1,
            maxWidth: '100%',
            width: 240,
          }}
        >
          <TextField
            fullWidth
            label="Sort By"
            name="sort"
            onChange={handleSortChange}
            select
            SelectProps={{ native: true }}
            value={sort}
            variant="outlined"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </TextField>
        </Box>
        <Box
          sx={{
            m: 1,
            maxWidth: '100%',
            width: 240,
          }}
        >
          <TextField
            fullWidth
            label="Status"
            name="status"
            onChange={handleStatusChange}
            select
            SelectProps={{ native: true }}
            value={filters.status || 'all'}
            variant="outlined"
          >
            {statusOptions.map((statusOption) => (
              <option key={statusOption.value} value={statusOption.value}>
                {statusOption.label}
              </option>
            ))}
          </TextField>
        </Box>
      </Box>
      {enableBulkActions && (
        <Box sx={{ position: 'relative' }}>
          <Box
            sx={{
              backgroundColor: 'background.paper',
              mt: '6px',
              position: 'absolute',
              px: '4px',
              width: '100%',
              zIndex: 2,
            }}
          >
            <Checkbox
              checked={selectedAllInvoices}
              color="primary"
              indeterminate={selectedSomeInvoices}
              onChange={handleSelectAllInvoices}
            />
            <Button color="primary" sx={{ ml: 2 }} variant="outlined">
              Delete
            </Button>
            <Button color="primary" sx={{ ml: 2 }} variant="outlined">
              Edit
            </Button>
          </Box>
        </Box>
      )}
      <Scrollbar>
        <Box sx={{ minWidth: 1200 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedAllInvoices}
                    color="primary"
                    indeterminate={selectedSomeInvoices}
                    onChange={handleSelectAllInvoices}
                  />
                </TableCell>
                <TableCell>Customer</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>ID</TableCell>
                <TableCell>Date</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedInvoices.map((invoice) => {
                const isInvoiceSelected = selectedInvoices.includes(invoice.id);

                return (
                  <TableRow hover key={invoice.id} selected={isInvoiceSelected}>
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={isInvoiceSelected}
                        color="primary"
                        onChange={(event): void => handleSelectOneInvoice(event, invoice.id)}
                        value={isInvoiceSelected}
                      />
                    </TableCell>
                    <TableCell>
                      <Link color="textPrimary" component={RouterLink} to="#" underline="none" variant="subtitle2">
                        {invoice.customer.name}
                      </Link>
                      <Typography color="textSecondary" variant="body2">
                        {invoice.customer.email}
                      </Typography>
                    </TableCell>
                    <TableCell>{getStatusLabel(invoice.status)}</TableCell>
                    <TableCell>{numeral(invoice.totalAmount).format(`${invoice.currency}0,0.00`)}</TableCell>
                    <TableCell>{invoice.id}</TableCell>
                    <TableCell>{format(invoice.issueDate, 'dd/MM/yyyy')}</TableCell>
                    <TableCell align="right">
                      <IconButton component={RouterLink} to="#">
                        <PencilAltIcon fontSize="small" />
                      </IconButton>
                      <IconButton component={RouterLink} to="/dashboard/invoices/1">
                        <ArrowRightIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Box>
      </Scrollbar>
      <TablePagination
        component="div"
        count={filteredInvoices.length}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleLimitChange}
        page={page}
        rowsPerPage={limit}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </Card>
  );
};

InvoiceListTable.propTypes = {
  invoices: PropTypes.array.isRequired,
};

export default InvoiceListTable;
