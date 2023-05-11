import { Box, Chip, makeStyles, Theme } from '@material-ui/core';
import React from 'react';
import { DiscoverFeedStatus } from '../constants';
import { DiscoverFeedDisplayGroupModel } from '../models';

interface Props extends Omit<DiscoverFeedDisplayGroupModel, 'startDateText' | 'startTimeText'> {
  onClickDisplayGroupItem: (feedId: number) => () => void;
}

export const DiscoverFeedDisplayGroupItem = React.memo(
  ({
    id,
    displayStartDateText,
    displayEndDateText,
    status,
    statusText,
    statusColor,
    sectionSize,
    onClickDisplayGroupItem: handleClickDisplayGroupItem,
  }: Props) => {
    const classes = useStyles({ statusColor, status });

    return (
      <Box className={classes.root} onClick={handleClickDisplayGroupItem(id)}>
        <Box>
          <Box className={classes.date}>
            <Box>{`${displayStartDateText} ~`}</Box>
            {displayEndDateText && <Box className={classes.endDate}>{`${displayEndDateText}`}</Box>}
          </Box>
          <Box className={classes.section}>{`(${sectionSize}개 섹션)`}</Box>
        </Box>
        <Box>
          <Chip className={classes.status} label={statusText} />
        </Box>
        <Chip className={classes.id} label={`#${id}`} size="small" color="primary" />
      </Box>
    );
  },
);

const useStyles = makeStyles<Theme, { statusColor: string; status: DiscoverFeedStatus }>((theme) => ({
  root: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    border: 0,
    boxShadow: '0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)',
    borderRadius: '12px',
    backgroundColor: (props) => props.statusColor,
    marginTop: '10px',
    padding: '16px',
    color: (props) => {
      switch (props.status) {
        case DiscoverFeedStatus.OPEN:
          return theme.palette.common.white;
        case DiscoverFeedStatus.BEFORE_OPEN:
          return '#4285F4';
        default:
          return theme.palette.grey[600];
      }
    },
    cursor: 'pointer',
    minWidth: '220px',
    height: '160px',
  },

  date: {
    fontSize: '16px',
    marginBottom: '6px',
    fontWeight: 'bold',
    height: '48px',
  },

  endDate: {
    marginLeft: '4px',
  },

  section: {
    fontSize: '14px',
  },

  status: {
    fontWeight: 'bold',
    backgroundColor: (props) => (props.status === DiscoverFeedStatus.OPEN ? theme.palette.common.white : '#ffffff00'), //(props) => props.statusColor,
    color: (props) => (props.status === DiscoverFeedStatus.STOP ? theme.palette.grey[600] : '#4285F4'), //(props) => props.statusColor,
    border: (props) => {
      switch (props.status) {
        case DiscoverFeedStatus.OPEN:
          return `1px solid ${theme.palette.common.white}`;
        case DiscoverFeedStatus.BEFORE_OPEN:
          return `1px solid #4285F4`;
        default:
          return `1px solid ${theme.palette.grey[600]}`;
      }
    },
  },

  id: {
    fontSize: '14px',
    position: 'absolute',
    top: '16px',
    right: '16px',
    padding: '0 5px',
  },
}));
