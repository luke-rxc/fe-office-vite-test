import styled from '@emotion/styled';
import { Box, Button, Chip, Grid } from '@material-ui/core';
import React from 'react';

interface Props {
  color: 'default' | 'blue' | 'gray';
  message: string | null;
  label?: string;
  onClickDeleteAction?: () => void;
}

/**
 * 문자열 중 줄바꿈/링크 요소인 경우 태그로 변환하여 JSX.Element[]로 반환
 *
 * 링  크: http~ => <a />
 * 줄바꿈: \n\n  => <br />
 *
 * @param description {string}
 * @returns JSX.Element[]
 */
export const createRichText = (originText: string) => {
  const urlRegExp = /(https?:\/\/[-a-zA-Z0-9@:%._\\+~#=]{1,256}\.[a-zA-Z0-9]{1,6}\b[-a-zA-Z0-9@:%_\\+.~#?&//=]*)/g;
  const httpRegExp = /^(https:\/\/|http:\/\/)/g;
  const newLineRegExp = /(\n)/g;

  const splitText = originText
    .trim()
    .split(urlRegExp)
    .filter((text) => !!text)
    .map((text) => (newLineRegExp.test(text) ? text.split(newLineRegExp).flat() : text))
    .flat();

  /**
   * @todo 링크에대한 속성 정의필요
   */
  return splitText.map((text, index) => {
    const key = `${text}+${index}`;

    // 링크 요소
    if (urlRegExp.test(text)) {
      return <a key={key} href={text} target="_blank" children={text.replace(httpRegExp, '')} rel="noreferrer" />;
    }

    // 줄바꿈 요소
    if (newLineRegExp.test(text)) {
      return <br key={key} />;
    }

    // 택스트
    return <React.Fragment key={key}>{text}</React.Fragment>;
  });
};

/**
 * 쇼타임 채팅 notice 메세지 component
 */
export const ChatNoticeMessage = ({ message, color, label, onClickDeleteAction: handleClickDeleteAction }: Props) => {
  if (message === null) {
    return null;
  }

  return (
    <MessageWrapperStyled className={color}>
      <MessageStyled container>
        {label && (
          <Grid item>
            <ChipStyled label={label} size="small" className={color} />
          </Grid>
        )}
        <Grid item>{createRichText(message)}</Grid>
      </MessageStyled>
      {handleClickDeleteAction && (
        <ButtonWrapperStyled>
          <Button variant="contained" color="secondary" size="small" onClick={handleClickDeleteAction}>
            삭제
          </Button>
        </ButtonWrapperStyled>
      )}
    </MessageWrapperStyled>
  );
};

const MessageWrapperStyled = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 10px 0;
  color: #000000;
  background-color: none;
  border: none;
  border-radius: 10px;

  &.blue {
    color: #ffffff;
    background-color: #03a9f4;
    border: 1px solid #03a9f4;
  }

  &.gray {
    color: #000000;
    background-color: #bbbbbb;
    border: 1px solid #bbbbbb;
  }
`;

const MessageStyled = styled(Grid)`
  padding: 10px 15px;
  font-size: 1rem;
  flex-wrap: nowrap;
  word-break: break-all;
`;

const ChipStyled = styled(Chip)`
  margin-right: 10px;
  background-color: #b9d956;
`;

const ButtonWrapperStyled = styled(Box)`
  padding: 10px 15px;
`;
