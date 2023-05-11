import styled from '@emotion/styled';
import { Card, CardHeader, CardContent, Button, Box } from '@material-ui/core';

interface Props {
  showroomSubscribeInfo: string;
  onClickShowroomSubscribe: () => void;
}

export const AddonOption = ({
  showroomSubscribeInfo,
  onClickShowroomSubscribe: handleClickShowroomSubscribe,
}: Props) => {
  return (
    <Card>
      <CardHeader
        title={
          <TitleStyled>
            인터렉션 메세지 발송 {showroomSubscribeInfo && <NoticeStyled>{showroomSubscribeInfo}</NoticeStyled>}
          </TitleStyled>
        }
      />
      <CardContent>
        <Button variant="outlined" onClick={handleClickShowroomSubscribe}>
          쇼룸 팔로우 요청
        </Button>
      </CardContent>
    </Card>
  );
};

const TitleStyled = styled(Box)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 40px;
`;
const NoticeStyled = styled(Box)`
  display: inline-block;
  background: ${({ theme }) => theme.palette.primary.main};
  color: #ffffff;
  padding: 5px 10px;
  margin-top: 5px;
  font-size: 14px;
  border-radius: 14px;
`;
