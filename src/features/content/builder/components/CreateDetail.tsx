import type { VFC } from 'react';
import styled from '@emotion/styled';
import { Box, Button, Grid, Typography } from '@material-ui/core';
import { CreatePresetModel, CreateListItemModel } from '../models';

/**
 * 컴포넌트 추가시 상세 타입 뷰
 */
type CreateDetailProps = {
  className?: string;
  group: CreateListItemModel;
  onSelected: (type: CreatePresetModel) => void; // 컴포넌트 타입 선택
};
export const CreateDetail: VFC<CreateDetailProps> = ({ className = '', group, onSelected }) => {
  const { componentGroup, components } = group;
  return (
    <CreateDetailStyled className={className}>
      <Grid container className="detail-container">
        {!!components.length && (
          <>
            {components.map((preset, idx) => {
              return (
                <Grid key={idx} item xs={3} className="detail-item">
                  <Typography color="textPrimary" variant="h6">
                    {preset.description}
                  </Typography>
                  <div className="img-wrapper">
                    <img src={preset.guideImage} alt={preset.description} />
                  </div>
                  <Button
                    type="button"
                    variant="contained"
                    color="primary"
                    className="detail-btn"
                    disabled={!!preset.maxCount && preset.maxCount === preset.addCount}
                    onClick={() =>
                      onSelected({
                        componentGroup,
                        componentType: preset.componentType,
                      })
                    }
                  >
                    선택
                  </Button>
                  {!!preset.maxCount && (
                    <Box>
                      <Typography color="textPrimary" variant="caption" sx={{ mr: '' }}>
                        {preset.maxCount > 0 && (
                          <>
                            {preset.maxCount === 1 && <>(*복수 생성 불가)</>}
                            {preset.maxCount > 1 && <>(*최대 {preset.maxCount}개 추가 가능)</>}
                          </>
                        )}
                      </Typography>
                    </Box>
                  )}
                </Grid>
              );
            })}
          </>
        )}
      </Grid>
    </CreateDetailStyled>
  );
};

const CreateDetailStyled = styled.div`
  .detail-container {
    justify-content: center;
    text-align: center;
  }
  .detail-item:last-child {
    margin-left: 20px;
  }
  .detail-btn {
    margin-top: 10px;
    min-width: 100px;
  }
  .img-wrapper {
    margin-top: 20px;
    width: 100%;
    height: 300px;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    border-radius: 10px;
    border: 2px solid #eee;
    img {
      width: 100%;
    }
  }
`;
