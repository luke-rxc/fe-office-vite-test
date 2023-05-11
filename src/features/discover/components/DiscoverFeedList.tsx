import styled from '@emotion/styled';
import { Box, Grid } from '@material-ui/core';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import { IconButton } from '@components/IconButton';
import { DiscoverFeedDisplayGroupView } from './DiscoverFeedDisplayGroupView';
import { ReturnTypeUseDiscoverFeedListService } from '../services';

interface Props {
  items: ReturnTypeUseDiscoverFeedListService['discoverFeedDisplayGroupItems'];
  pagination: ReturnTypeUseDiscoverFeedListService['discoverFeedDisplayGroupPagination'];
  displayGroupType: ReturnTypeUseDiscoverFeedListService['displayGroupType'];
  onClickCreateDisplayGroup: ReturnTypeUseDiscoverFeedListService['handleClickCreateDisplayGroup'];
  onClickDisplayGroupItem: ReturnTypeUseDiscoverFeedListService['handleClickDisplayGroupItem'];
}

export const DiscoverFeedList = ({
  items,
  pagination: { enabledPrev, enabledNext, onPrev: handlePrev, onNext: handleNext },
  displayGroupType,
  onClickCreateDisplayGroup: handleClickCreateDisplayGroup,
  onClickDisplayGroupItem: handleClickDisplayGroupItem,
}: Props) => {
  if (items.length === 0) {
    return <EmptyWrapperStyled>등록된 전시그룹이 없습니다. 전시그룹을 추가해주세요</EmptyWrapperStyled>;
  }

  return (
    <GridWrapperStyled container flexWrap="nowrap">
      <ButtonGridStyled item>
        <IconButton
          color="primary"
          icon={<ArrowBackIosIcon fontSize="small" />}
          title="이전"
          disabled={!enabledPrev}
          onClick={handlePrev}
        />
      </ButtonGridStyled>
      <GridCenterStyled item flexWrap="nowrap">
        <GroupWrapperGridStyled container flexWrap="nowrap" spacing={2}>
          {items.map((item) => {
            return (
              <DiscoverFeedDisplayGroupView
                key={item.id}
                {...item}
                displayGroupType={displayGroupType}
                onClickCreateDisplayGroup={handleClickCreateDisplayGroup}
                onClickDisplayGroupItem={handleClickDisplayGroupItem}
              />
            );
          })}
        </GroupWrapperGridStyled>
      </GridCenterStyled>
      <ButtonGridStyled item>
        <IconButton
          color="primary"
          icon={<ArrowForwardIosIcon fontSize="small" />}
          title="다음"
          disabled={!enabledNext}
          onClick={handleNext}
        />
      </ButtonGridStyled>
    </GridWrapperStyled>
  );
};

const GridWrapperStyled = styled(Grid)`
  height: 500px;
  margin-top: 80px;
`;

const ButtonGridStyled = styled(Grid)`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100px;
  min-width: 100px;
`;

const GridCenterStyled = styled(Grid)`
  width: calc(100% - 200px);
`;

const GroupWrapperGridStyled = styled(Grid)`
  height: 100%;
  overflow-x: scroll;
  padding: 0 46px;
`;

const EmptyWrapperStyled = styled(Box)`
  display: flex;
  height: 500px;
  justify-content: center;
  align-items: center;
  border: 1px solid #e8e8e8;
  background-color: ${({ theme }) => theme.palette.background.paper};
  border-radius: 20px;
`;
