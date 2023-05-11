import { ScheduleBannerType } from '../constants';
import FilePresentIcon from '@material-ui/icons/FilePresent';
import CardGiftcardIcon from '@material-ui/icons/CardGiftcard';
import { Box } from '@material-ui/core';
import styled from '@emotion/styled';

interface Props {
  id: number;
  className?: string;
  bannerType: ScheduleBannerType;
}

export const ScheduleAdditionalInfo = ({ id, bannerType, ...props }: Props) => {
  if (bannerType === ScheduleBannerType.NONE) {
    return null;
  }

  return (
    <WrapperStyled {...props}>
      {bannerType === ScheduleBannerType.GOODS ? (
        <CardGiftcardIcon sx={{ marginRight: '5px' }} fontSize="small" color="error" />
      ) : (
        <FilePresentIcon sx={{ marginRight: '5px', color: '#0d44f3' }} fontSize="small" />
      )}
      {/* {id} */}
    </WrapperStyled>
  );
};

const WrapperStyled = styled(Box)`
  display: flex;
  align-items: center;
  color: #fff;
  font-size: 14px;
`;
