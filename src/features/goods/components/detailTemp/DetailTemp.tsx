import React, { useState, useEffect } from 'react';
import { Paper, Typography, Button, Grid } from '@material-ui/core';
import InformationCircleIcon from '@assets/icons/InformationCircle';
import { DetailTempModal } from './DetailTempModal';
import { TempListModel, TempListRemoveModel } from '../../models';

interface Props {
  temporaryList: TempListModel[];
  onLoadTemporaryList: (goodsTemporaryId: number) => void;
  onDeleteTemporary: ({ goodsTemporaryId, listIdx }: TempListRemoveModel) => void;
}

export const DetailTemp: React.FC<Props> = React.memo(
  ({ temporaryList, onLoadTemporaryList, onDeleteTemporary: handleRemoveTemp }) => {
    const [isActive, setIsActive] = useState(temporaryList && !!temporaryList.length);
    const [isOpenModal, setOpenModal] = useState(false);

    const handleLoadTempListItem = (goodsTemporaryId: number) => {
      onLoadTemporaryList(goodsTemporaryId);
      handleModalClose();
    };

    const handleModalOpen = () => setOpenModal(true);
    const handleModalClose = () => setOpenModal(false);
    const handleInActive = () => setIsActive(false);

    useEffect(() => {
      if (temporaryList.length && !isActive) {
        setIsActive(true);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [temporaryList.length]);

    if (!isActive) {
      return null;
    }

    return (
      <>
        <Grid container justifyContent="space-between" flexWrap="nowrap" flexDirection="column">
          <Paper square sx={{ display: 'flex', alignItems: 'center', p: 2 }}>
            <Grid item display="flex" justifyContent="flex-start" md={6} xs={12}>
              <InformationCircleIcon color="secondary" />
              <Typography color="secondary" variant="h6" sx={{ ml: 1 }}>
                {`임시저장된 내용 (${temporaryList.length}건)을 불러오시겠습니까?`}
              </Typography>
            </Grid>

            <Grid item display="flex" justifyContent="flex-end" md={6} xs={12}>
              <Button size="medium" variant="contained" onClick={handleModalOpen} sx={{ width: 100 }}>
                불러오기
              </Button>
              <Button size="medium" variant="outlined" onClick={handleInActive} sx={{ width: 100, ml: 2 }}>
                취소
              </Button>
            </Grid>
          </Paper>
        </Grid>
        {/* modal: 임시저장 */}
        <DetailTempModal
          isOpen={isOpenModal}
          onModalClose={handleModalClose}
          onDeleteTemporary={handleRemoveTemp}
          onLoadTemporaryList={handleLoadTempListItem}
          lists={temporaryList}
        />
      </>
    );
  },
  ({ temporaryList: prevTemporaryList }, { temporaryList: nextTemporaryList }) => {
    return prevTemporaryList === nextTemporaryList;
  },
);
