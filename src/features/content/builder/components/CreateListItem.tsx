import type { VFC } from 'react';
import styled from '@emotion/styled';
import { Button, Grid, Typography } from '@material-ui/core';
import { CreateListItemModel } from '../models';
import { getComponentGroupName } from '../utils';

/**
 * 컴포넌트 추가 리스트 항목
 */
type CreateListItemProps = {
  item: CreateListItemModel;
  onSelect: (selectItem: CreateListItemModel) => void;
};
export const CreateListItem: VFC<CreateListItemProps> = ({ item, onSelect }) => {
  const { componentGroup, maxCount, addCount } = item;
  const desc = !!maxCount && `${maxCount === 1 ? `복수 생성 불가` : `최대 ${maxCount}개 추가가능`}`;

  return (
    <CreateItemStyled>
      <Grid container item>
        <Grid item xs={7} sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography color="textPrimary" variant="h6" sx={{ mr: '' }}>
            {getComponentGroupName(componentGroup)}
            {desc && <span className="desc">(*{desc})</span>}
          </Typography>
        </Grid>
        <Grid item xs={5} sx={{ textAlign: 'right', alignItems: 'center' }}>
          <span>
            {!!addCount && `${addCount}개 추가 되었습니다.`}
            {addCount === 0 && `추가 가능합니다.`}
          </span>
          <Button
            disabled={addCount === maxCount}
            onClick={() => onSelect(item)}
            type="button"
            variant="contained"
            color="primary"
            sx={{ minWidth: 100, ml: 2 }}
          >
            추가
          </Button>
        </Grid>
      </Grid>
    </CreateItemStyled>
  );
};

const CreateItemStyled = styled.div`
  position: relative;
  display: block;
  text-align: center;
  width: 100%;
  min-height: 60px;
  background: white;
  border-radius: 5px;
  border: 1px solid #e0e0e0;
  padding: 15px;
  display: flex;
  justify-content: center;
  align-items: center;
  .desc {
    margin-left: 8px;
    font-weight: normal;
    font-size: 14px;
  }
`;
