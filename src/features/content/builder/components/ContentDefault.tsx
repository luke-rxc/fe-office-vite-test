import type { VFC } from 'react';
import { List, ListItem, Box, Chip } from '@material-ui/core';
import styled from '@emotion/styled';
import { pathConfig } from '@config';
import { toDateFormat } from '@utils/date';
import { ListTitle } from '@components/ListTitle';
import { ContentDefaultModel, ContentShowroomModel } from '../models';
import { CONTENT_STATUS, CONTENT_TYPE_LABEL } from '../constants';
import { CONTENT_STATUS_LABEL } from '../constants';

/**
 * 콘텐츠 기본 정보 뷰
 */
type ContentDefaultProps = {
  showroom: ContentShowroomModel; // 콘텐츠 쇼룸 정보
  contentDefault: ContentDefaultModel; // 콘텐츠 기본 정보
};

export const ContentDefault: VFC<ContentDefaultProps> = ({ showroom, contentDefault }) => {
  const { contentName, type, publicEndDate, publicStartDate, status } = contentDefault;

  return (
    <ContentDefaultStyled>
      <Box className="ly-left">
        {/** 쇼룸 */}
        <div className="logo-wrapper">
          <div className="inner">
            <div className="img-wrapper">
              <div
                className="img-in"
                style={{
                  backgroundImage: `url("${pathConfig.cdnUrl}/${showroom.brandImage}")`,
                }}
              ></div>
            </div>
            <div className="txt-showroom">{showroom.name}</div>
          </div>
        </div>
      </Box>
      <Box className="ly-right">
        <Box className="default-box">
          <List>
            <ListItem>
              <ListTitle name="콘텐츠명" />
              <Box>{contentName}</Box>
            </ListItem>
            <ListItem>
              <ListTitle name="콘텐츠 타입" />
              <Box>
                <Chip label={CONTENT_TYPE_LABEL[type]} variant="outlined" sx={{ minWidth: 100 }} />
              </Box>
            </ListItem>
            <ListItem>
              <ListTitle name="공개기간" />
              <Box>
                {publicStartDate && <span>{toDateFormat(publicStartDate, 'yyyy.MM.dd HH:mm')}</span>}
                {publicEndDate && <span> - {toDateFormat(publicEndDate, 'yyyy.MM.dd HH:mm')}</span>}
              </Box>
            </ListItem>
            <ListItem>
              <ListTitle name="공개 상태" />
              <Box>
                <Chip
                  label={CONTENT_STATUS_LABEL[status]}
                  color={`${
                    status === CONTENT_STATUS.PUBLIC
                      ? 'primary'
                      : status === CONTENT_STATUS.ADMIN_PUBLIC
                      ? 'secondary'
                      : 'default'
                  }`}
                  variant="outlined"
                  sx={{ minWidth: 100 }}
                />
              </Box>
            </ListItem>
          </List>
        </Box>
      </Box>
    </ContentDefaultStyled>
  );
};

const ContentDefaultStyled = styled.div`
  display: flex;
  width: 100%;
  .ly-left {
    width: 280px;
  }
  .ly-right {
    width: calc(100% - 280px);
  }
  .logo-wrapper {
    padding: 10px;
    & > .inner {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100%;
      flex-direction: column;
    }
    .img-wrapper {
      width: 100px;
      height: 100px;
      & > .img-in {
        width: 100%;
        height: 100%;
        overflow: hidden;
        border-radius: 50%;
        background-repeat: no-repeat;
        background-position: 50% 50%;
        background-size: cover;
      }
    }
    .txt-showroom {
      margin-top: 15px;
    }
  }
  .default-box {
    height: 100%;
    & > ul {
      display: flex;
      flex-wrap: wrap;
      height: 100%;
      & > li {
        flex-basis: 50%;
      }
    }
  }
`;
