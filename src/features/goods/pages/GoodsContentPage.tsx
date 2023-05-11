import React from 'react';
import { useParams } from 'react-router-dom';
import { GoodsContentContainer } from '../containers';
import { GoodsContentType } from '../constants';

interface Props {
  type: GoodsContentType;
}

const GoodsContentMainListPage: React.FC<Props> = ({ type }) => {
  const { goodsId } = useParams();
  return <GoodsContentContainer type={type} goodsId={goodsId} />;
};

export default GoodsContentMainListPage;
