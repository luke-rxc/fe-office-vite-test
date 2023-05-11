import { Box, Card, CardHeader } from '@material-ui/core';
import { CardContentStyled } from '../CardStyled';
import { MuteUserList, BanUserList } from '.';
import SendBird from 'sendbird';

interface Props {
  muteItems: Array<SendBird.User>;
  banItems: Array<SendBird.User>;
  onClickUnban: (user: SendBird.User) => void;
  onClickUnMute: (user: SendBird.User) => void;
}

export const ChatUserManagement = ({
  muteItems,
  banItems,
  onClickUnban: handleClickUnban,
  onClickUnMute: handleClickUnMute,
}: Props) => {
  return (
    <Card>
      <CardHeader title="채팅유저 관리" />
      <CardContentStyled color="#ffffff">
        <MuteUserList items={muteItems} height="200px" onClickUnMute={handleClickUnMute} />
        <Box height="20px" />
        <BanUserList items={banItems} height="200px" onClickUnban={handleClickUnban} />
      </CardContentStyled>
    </Card>
  );
};
