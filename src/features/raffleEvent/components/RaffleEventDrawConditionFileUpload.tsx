import { FormControlTextField } from '@components/form';
import styled from '@emotion/styled';
import { Box, Button, Divider, List, ListItem } from '@material-ui/core';
import { useFormContext } from 'react-hook-form';
import { RaffleEventDetailFormField } from '../types';
import { RaffleEventDrawConditionFormProps } from './RaffleEventDrawConditionForm';

type Props = Pick<RaffleEventDrawConditionFormProps, 'itemIndex' | 'isEdit' | 'onOpenRaffleEventModel'>;

export const RaffleEventDrawConditionFileUpload = ({
  itemIndex,
  isEdit,
  onOpenRaffleEventModel: handleOpenRaffleEventModel,
}: Props) => {
  const {
    getValues,
    formState: { errors },
  } = useFormContext<RaffleEventDetailFormField>();

  const [targetUserCount] = getValues([`itemList.${itemIndex}.targetUserCount`]);
  const errorMessage = errors?.itemList?.[itemIndex]?.targetUserCount?.message;

  const validateTargetUserCount = (value: string) => {
    if (Number(value) <= 0) {
      return '응모 대상자를 등록해주세요';
    }

    return null;
  };

  return (
    <WrapperStyled error={errorMessage}>
      <Box>
        <Button
          variant="contained"
          size="large"
          disabled={!isEdit}
          onClick={handleOpenRaffleEventModel}
          sx={{ width: '400px' }}
        >
          응모 대상자 파일 업로드
        </Button>
        <>
          <FormControlTextField
            name={`itemList.${itemIndex}.targetUserCount`}
            rules={{ required: true, validate: validateTargetUserCount }}
            sx={{ display: 'none' }}
          />
        </>
        {targetUserCount ? (
          <ListStyled>
            <ListItem>전체 대상자</ListItem>
            <Divider component="li" />
            <ListItem>{targetUserCount.toLocaleString()}명</ListItem>
          </ListStyled>
        ) : null}
        {errorMessage ? <ErrorMessageStyled>{errorMessage}</ErrorMessageStyled> : null}
      </Box>
    </WrapperStyled>
  );
};

const WrapperStyled = styled(Box)<{ error: string | undefined }>`
  padding: 10px 40px;

  > div {
    padding: 20px 40px;
    border: 1px solid ${({ error }) => (error ? '#f44336' : '#e5e5e5')};
    border-radius: 10px;
  }
`;
const ListStyled = styled(List)`
  width: 300px;
  padding: 0;
  margin-top: 10px;
  font-size: 14px;
  border: 1px solid #e8e8e8;

  > li:first-of-type {
    background-color: #eee;
  }
`;

const ErrorMessageStyled = styled(Box)`
  margin: 10px 14px 0;
  color: #f44336;
  font-size: 0.75rem;
`;
