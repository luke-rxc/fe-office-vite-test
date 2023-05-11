import { Card } from '@material-ui/core';
import React from 'react';
import { FormLayout } from '.';
import { ShowtimeContentsItemModel } from '../models';
import { CardHeaderStyled, CardContentStyled } from './CardStyled';

interface Props {
  item: ShowtimeContentsItemModel;
}

/**
 * 콘텐츠 정보 component
 */
export const ShowtimeManageContentsInfo = React.memo(
  ({ item: { id, goodsName, title, showRoomName, openStatusText } }: Props) => {
    return (
      <Card>
        <CardHeaderStyled title="콘텐츠 정보" />
        <CardContentStyled>
          <FormLayout label="라이브 ID">{id}</FormLayout>
          <FormLayout label="라이브 제목">{title}</FormLayout>
          <FormLayout label="쇼룸">{showRoomName}</FormLayout>
          <FormLayout label="상품">{goodsName}</FormLayout>
          <FormLayout label="노출설정">{openStatusText}</FormLayout>
        </CardContentStyled>
      </Card>
    );
  },
  (
    {
      item: {
        id: prevId,
        goodsName: prevGoodsName,
        title: prevTitle,
        showRoomName: prevShowRoomName,
        openStatusText: prevOpenStatusText,
      },
    },
    {
      item: {
        id: nextId,
        goodsName: nextGoodsName,
        title: nextTitle,
        showRoomName: nextShowRoomName,
        openStatusText: nextOpenStatusText,
      },
    },
  ) =>
    prevId === nextId &&
    prevGoodsName === nextGoodsName &&
    prevTitle === nextTitle &&
    prevShowRoomName === nextShowRoomName &&
    prevOpenStatusText === nextOpenStatusText,
);
