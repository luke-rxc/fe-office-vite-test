import { IconButton } from '@components/IconButton';
import styled from '@emotion/styled';
import { Box, Grid } from '@material-ui/core';
import { DiscoverFeedDisplayGroupItem } from './DiscoverFeedDisplayGroupItem';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import { DiscoverFeedDisplayGroupModel } from '../models';
import { DiscoverFeedDisplayGroupType } from '../constants';

interface Props extends DiscoverFeedDisplayGroupModel {
  displayGroupType: DiscoverFeedDisplayGroupType;
  onClickCreateDisplayGroup: (displayStartDate: number) => () => void;
  onClickDisplayGroupItem: (feedId: number) => () => void;
}

export const DiscoverFeedDisplayGroupView = ({
  startDateText,
  startTimeText,
  displayGroupType,
  displayStartDate,
  onClickCreateDisplayGroup: handleClickCreateDisplayGroup,
  onClickDisplayGroupItem: handleClickDisplayGroupItem,
  ...props
}: Props) => {
  const onClick = handleClickCreateDisplayGroup(displayStartDate);

  return (
    <GroupGridStyled item md="auto">
      <DiscoverFeedDisplayGroupItem
        {...props}
        displayStartDate={displayStartDate}
        onClickDisplayGroupItem={handleClickDisplayGroupItem}
      />

      <Box className="action">
        {displayGroupType === DiscoverFeedDisplayGroupType.ENABLED && (
          <IconButton
            color="primary"
            icon={<AddCircleOutlineIcon fontSize="large" />}
            title="전시그룹 생성"
            onClick={onClick}
          />
        )}
      </Box>
      <Box className="title">
        <Box>{startDateText}</Box>
        <Box>{startTimeText}</Box>
      </Box>
    </GroupGridStyled>
  );
};

const GroupGridStyled = styled(Grid)`
  position: relative;
  display: flex;
  align-items: center;
  padding-top: 0 !important;
  padding-left: 16px;
  margin-top: 48px;
  border-left: 1px solid;

  .action {
    width: 100px;
    text-align: center;
  }

  .title {
    position: absolute;
    top: -50px;
    left: -45px;
    text-align: center;
  }
`;
