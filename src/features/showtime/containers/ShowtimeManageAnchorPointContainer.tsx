import styled from '@emotion/styled-base';
import { Button, Card, CardContent, Grid } from '@material-ui/core';
import { AnchorPointModal, AnchorPointSummary, CardHeaderStyled } from '../components';
import { useShowtimeManageAnchorPointService, useShowtimeManageAnchorPointModalService } from '../services';

interface Props {
  showTimeId: number;
}

const ShowtimeManageAnchorPointContainer = ({ showTimeId }: Props) => {
  const {
    showModal,
    modalType,
    formMethod,
    uploadImage,
    selectedImageType,
    activeAnchorPoint,
    handleCreateOpenModal,
    handleModifyOpenModal,
    handleCloseModal,
    onSubmit,
  } = useShowtimeManageAnchorPointModalService(showTimeId);

  const {
    showtimeAnchorPointWaitItems,
    showtimeAnchorPointActiveItems,
    showtimeLinkedGoodsOptions,
    handleClickAction,
  } = useShowtimeManageAnchorPointService(showTimeId, handleModifyOpenModal);

  return (
    <>
      <Grid container spacing={4}>
        <Grid item xs={6}>
          <Card>
            <CardHeaderStyled
              title="편성 대기"
              action={
                <Button variant="outlined" color="inherit" size="small" onClick={handleCreateOpenModal}>
                  편성 등록
                </Button>
              }
            />
            <CardContentStyled>
              <AnchorPointSummary items={showtimeAnchorPointWaitItems} onClickAction={handleClickAction} />
            </CardContentStyled>
          </Card>
        </Grid>
        <Grid item xs={6}>
          <Card>
            <CardHeaderStyled title="편성 현황" />
            <CardContentStyled>
              <AnchorPointSummary items={showtimeAnchorPointActiveItems} onClickAction={handleClickAction} />
            </CardContentStyled>
          </Card>
        </Grid>
      </Grid>
      <AnchorPointModal
        showModal={showModal}
        modalType={modalType}
        formMethod={formMethod}
        onSubmit={onSubmit}
        onClose={handleCloseModal}
        goodsOptions={showtimeLinkedGoodsOptions}
        imageType={selectedImageType}
        uploadImage={uploadImage}
        activeAnchorPoint={activeAnchorPoint}
      />
    </>
  );
};

const CardContentStyled = styled(CardContent)`
  margin: 0 10px;
  border-top: 1px solid #e8e8e8;
`;

export default ShowtimeManageAnchorPointContainer;
