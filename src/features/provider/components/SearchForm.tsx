import { useState, useEffect } from 'react';
import type { VFC } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import {
  Paper,
  makeStyles,
  Grid,
  Divider,
  Button,
  List,
  ListItem,
  Box,
  TextField,
  RadioGroup,
  FormControlLabel,
  Radio,
} from '@material-ui/core';
import { ClassNameMap } from '@material-ui/styles/withStyles';
import RotateLeftSharpIcon from '@material-ui/icons/RotateLeftSharp';
import SearchIcon from '@material-ui/icons/Search';
import { ListTitle } from '@components/ListTitle';
import { DatePicker } from '@components/DatePicker';
import { Autocomplete } from '@components/Autocomplete';
import { BUSINESS_TYPE, CALCULATE_TYPE_LIST } from '../constants';
import { getActiveSelect, validateDate } from '../utils';
import { SelectTypeModel, SearchFormModel } from '../models';

const useStyles = makeStyles(() => ({
  list: {
    width: '100%',
    '& >li >:nth-child(2)': {
      width: '100%',
    },
  },
}));

const initialValue: SearchFormModel = {
  providerName: '',
  businessType: '',
  calculateCount: null,
  fromDate: null,
  toDate: null,
};

/**
 * 리스트 검색
 */
type SearchFormProps = {
  params: SearchFormModel;
  onSearch: (value: SearchFormModel) => void;
};
export const SearchForm: VFC<SearchFormProps> = ({ params = initialValue, onSearch }) => {
  const classes: ClassNameMap = useStyles();
  const { providerName, businessType, calculateCount, fromDate } = params;
  const [calculate, setCalculate] = useState<SelectTypeModel>(getActiveSelect(calculateCount, CALCULATE_TYPE_LIST));
  const { clearErrors, control, handleSubmit, setError, setValue, reset } = useForm<SearchFormModel>({
    defaultValues: { providerName, businessType, calculateCount, fromDate },
  });

  /**
   * params 변경시 (라우터 변경시), 쿼리 값에 맞게 formData, view 업데이트
   */
  useEffect(() => {
    updateSearchView(params);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  /**
   * 화면 뷰, formData 업데이트
   * @param {SearchFormModel} value
   */
  const updateSearchView = (value: SearchFormModel) => {
    const { providerName, businessType, calculateCount, fromDate, toDate } = value;
    setCalculate(calculateCount ? getActiveSelect(calculateCount, CALCULATE_TYPE_LIST) : null);

    reset({ providerName, businessType, calculateCount, fromDate, toDate }); // formData 업데이트
  };

  /**
   * 검색
   * @param formData
   * @returns
   */
  const submitForm = (formData: SearchFormModel) => {
    const { fromDate, toDate } = formData;

    clearErrors(['fromDate', 'toDate']);
    if (fromDate && toDate && !validateDate(new Date(fromDate), new Date(toDate))) {
      toast.error('입점일자를 다시 확인 해 주세요');
      setError('fromDate', { message: 'Invalid Date' });
      setError('toDate', { message: 'Invalid Date' });
      return;
    }

    if (fromDate === 0) {
      setValue('fromDate', null);
    }
    if (toDate === 0) {
      setValue('toDate', null);
    }

    onSearch(formData);
  };

  /**
   * 초기화
   */
  const handleReset = () => {
    updateSearchView(initialValue);
  };

  return (
    <Paper elevation={0} sx={{ padding: 3 }}>
      <form onSubmit={handleSubmit(submitForm)} onReset={handleReset}>
        <Grid container>
          <Grid container item xs={10}>
            <List className={classes.list}>
              <ListItem>
                <ListTitle name="입점사명" />
                <Box>
                  <Controller
                    control={control}
                    name="providerName"
                    render={({ field: { onChange, value } }) => (
                      <TextField fullWidth label="입점사명" onChange={onChange} value={value} />
                    )}
                  />
                </Box>
              </ListItem>
              <ListItem>
                <ListTitle name="사업자유형" />
                <Box>
                  <Controller
                    control={control}
                    name="businessType"
                    render={({ field: { onChange, value } }) => (
                      <RadioGroup onChange={onChange} row value={value}>
                        <FormControlLabel control={<Radio />} label="개인" value={BUSINESS_TYPE.INDIVIDUAL} />
                        <FormControlLabel control={<Radio />} label="법인" value={BUSINESS_TYPE.CORPORATE} />
                        {/* <FormControlLabel control={<Radio />} label="일반개인회원" value={BUSINESS_TYPE.PRIVATE} /> */}
                      </RadioGroup>
                    )}
                  />
                </Box>
              </ListItem>
              <ListItem>
                <ListTitle name="입점일자" />
                <Box sx={{ alignItems: 'center', display: 'flex', justifyContent: 'flex-start' }}>
                  <Controller
                    control={control}
                    name="fromDate"
                    render={({ field: { onChange: handleChange, value }, fieldState: { error } }) => {
                      return (
                        <DatePicker
                          disableFuture
                          error={!!error}
                          helperText={error?.message}
                          onChange={(value: Date) => handleChange(new Date(value).getTime())}
                          value={value}
                        />
                      );
                    }}
                  />
                  <span style={{ padding: '0 5px' }}>~</span>
                  <Controller
                    control={control}
                    name="toDate"
                    render={({ field: { onChange: handleChange, value }, fieldState: { error } }) => {
                      return (
                        <DatePicker
                          disableFuture
                          error={!!error}
                          helperText={error?.message}
                          onChange={(value: Date) => handleChange(new Date(value).getTime())}
                          value={value}
                        />
                      );
                    }}
                  />
                </Box>
              </ListItem>
              <ListItem>
                <ListTitle name="정산방식" />
                <Box>
                  <Controller
                    control={control}
                    name="calculateCount"
                    render={() => (
                      <Autocomplete
                        filterSelectedOptions={false}
                        onChange={(option) => {
                          setCalculate(option);
                          setValue('calculateCount', option?.code);
                        }}
                        options={CALCULATE_TYPE_LIST}
                        renderInput={(props) => <TextField label="정산방식" {...props} />}
                        value={calculate}
                      />
                    )}
                  />
                </Box>
              </ListItem>
            </List>
          </Grid>
          <Grid container item direction="column" justifyContent="center" alignItems="center" xs={2}>
            <Divider orientation="vertical" />
            <Button startIcon={<SearchIcon />} sx={{ minWidth: 120 }} type="submit" variant="contained">
              검색
            </Button>
            <Button startIcon={<RotateLeftSharpIcon />} sx={{ mt: 2, minWidth: 120 }} type="reset" variant="contained">
              초기화
            </Button>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
};
