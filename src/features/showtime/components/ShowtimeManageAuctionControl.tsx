import styled from '@emotion/styled';
import { Box, Button, Card, CardContent, CardHeader, Divider, Grid } from '@material-ui/core';
import { useMemo } from 'react';
import { FormProvider } from 'react-hook-form';
import { StatusCircleStyled } from '.';
import { AuctionRequestStatus, AuctionRequestStatusLabel, AuctionStatus } from '../constants';
import { ReturnTypeUseShowtimeManageAuctionService } from '../services';
import { ShowtimeUnitPriceFormField } from '../types';
import { toCamelCase } from '../utils';
import { FormControlCheckbox, FormControlInput } from './form';
import { FormLayout } from './FormLayout';

interface Props {
  auctionGoods: ReturnTypeUseShowtimeManageAuctionService['selectedAuctionItem'];
  actionInfos: ReturnTypeUseShowtimeManageAuctionService['actionInfo'];
  lastAuctionMessage: ReturnTypeUseShowtimeManageAuctionService['lastAuctionMessage'];
  form: ReturnTypeUseShowtimeManageAuctionService['form'];
  onUpdateAuctionStatus: (requestStatus: AuctionRequestStatus) => void;
}

export const ShowtimeManageAuctionControl = ({
  auctionGoods,
  actionInfos,
  lastAuctionMessage,
  form: { formMethod, handleSubmitUnitPrice },
  onUpdateAuctionStatus,
}: Props) => {
  const usedMaximumBidPrice = formMethod.watch('usedMaximumBidPrice');

  //입찰 상한가 최소금액
  const defaultMaximumBidPrice = useMemo(() => {
    const price = Math.max(
      100,
      auctionGoods?.startPrice ? auctionGoods.startPrice + (auctionGoods?.bidUnitPrice ?? 0) : 0,
    );
    if (lastAuctionMessage) {
      return Math.max(
        price,
        lastAuctionMessage.data.price ? lastAuctionMessage.data.price + (auctionGoods?.bidUnitPrice ?? 0) : 0,
      );
    }
    return price;
  }, [auctionGoods, lastAuctionMessage]);

  const onClickAction = (requestStatus: AuctionRequestStatus) => {
    return () => {
      onUpdateAuctionStatus(requestStatus);
    };
  };

  return (
    <Card>
      <CardHeaderStyled title="경매 컨트롤러" />
      <Divider />
      <CardContent sx={{ padding: '20px 20px' }}>
        <FormProvider {...formMethod}>
          <form onSubmit={handleSubmitUnitPrice}>
            <Box>
              <FormLayout label="입찰 단위 금액">
                <FormControlInput<ShowtimeUnitPriceFormField>
                  name="unitPrice"
                  type="number"
                  endAdornment="원"
                  size="small"
                  sx={{ width: '200px', m: '0 45px 10px 0' }}
                  disabled={!auctionGoods || auctionGoods.status !== AuctionStatus.PAUSE}
                />
                <Button
                  type="submit"
                  variant="contained"
                  color="inherit"
                  disabled={
                    !auctionGoods || auctionGoods.status !== AuctionStatus.PAUSE || !formMethod.formState.isDirty
                  }
                >
                  입찰 설정 저장
                </Button>
              </FormLayout>
            </Box>
            <Box>
              <FormLayout label="입찰 상한가">
                <Box display="flex" flexDirection="column" justifyContent="center">
                  <FormControlCheckbox<ShowtimeUnitPriceFormField>
                    name="usedMaximumBidPrice"
                    label="사용"
                    disabled={!auctionGoods || auctionGoods.status !== AuctionStatus.PAUSE}
                  />
                  <Box>
                    {usedMaximumBidPrice && (
                      <FormControlInput<ShowtimeUnitPriceFormField>
                        name="maximumBidPrice"
                        type="number"
                        endAdornment="원"
                        size="small"
                        sx={{ width: '200px' }}
                        rules={{
                          required: '입찰 상한가를 입력하세요',
                          min: {
                            value: Math.max(100, Number(defaultMaximumBidPrice)),
                            message: `${Math.max(
                              100,
                              Number(defaultMaximumBidPrice),
                            ).toLocaleString()}원 이상의 금액을 입력하세요`,
                          },
                        }}
                        disabled={!auctionGoods || auctionGoods.status !== AuctionStatus.PAUSE}
                      />
                    )}
                  </Box>
                </Box>
              </FormLayout>
            </Box>
          </form>
        </FormProvider>
        {actionInfos && (
          <Grid container spacing={2} sx={{ p: '20px 0' }}>
            {actionInfos.map(([requestStatus, disabled]) => {
              return (
                <Grid item xs={6} key={requestStatus}>
                  <ActionButtonStyled
                    variant="contained"
                    className={toCamelCase(requestStatus)}
                    disabled={disabled}
                    onClick={onClickAction(requestStatus)}
                  >
                    {AuctionRequestStatusLabel[requestStatus]}
                  </ActionButtonStyled>
                </Grid>
              );
            })}
          </Grid>
        )}

        {auctionGoods && (
          <Box display="flex" alignItems="center" sx={{ p: '10px 0' }}>
            <StatusCircleStyled className={auctionGoods.statusClassName} sx={{ mr: '10px' }} />
            <span>{auctionGoods.statusMessage}</span>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

const CardHeaderStyled = styled(CardHeader)`
  .MuiCardHeader-title {
    font-size: 1rem;
  }
`;

const ActionButtonStyled = styled(Button)`
  width: 100%;

  &:disabled {
    color: #ffffff82;
  }

  &.opening {
    background-color: #0000ff;

    &:disabled {
      background-color: #0000ff82;
    }
  }
  &.startBidding {
    background-color: #ff0000;

    &:disabled {
      background-color: #ff000082;
    }
  }
  &.cancelAuction {
    background-color: #ff9800;

    &:disabled {
      background-color: #ff980082;
    }
  }
  &.pauseBidding {
    background-color: #1b941b;

    &:disabled {
      background-color: #1b941b82;
    }
  }
  &.resumeBidding {
    background-color: #ff0000;

    &:disabled {
      background-color: #ff000082;
    }
  }
  &.successfulBid {
    background-color: #808080;

    &:disabled {
      background-color: #80808082;
    }
  }
  &.countdown {
    background-color: #a9a9a9;

    &:disabled {
      background-color: #a9a9a982;
    }
  }
`;
