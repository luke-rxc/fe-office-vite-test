import { Avatar, Box, Chip, ListItem, ListItemAvatar, ListItemText, makeStyles, Theme } from '@material-ui/core';
import React from 'react';
import { ScheduleTableItemModel } from '../models';
import { ScheduleAdditionalInfo } from './ScheduleAdditionalInfo';

interface Props {
  item: ScheduleTableItemModel;
  onClickOpenModify?: (id: number) => () => void;
}

export const ScheduleItem = React.memo(
  ({
    item: { id, scheduleDateText, liveContents, liveInfo, showRoom, scheduled, bannerType },
    onClickOpenModify: handleClickOpenModify,
  }: Props) => {
    const classes = useStyles({ scheduled });

    return (
      <ListItem className={classes.root} onClick={handleClickOpenModify?.(id)}>
        <ListItemText>
          <Box className={classes.time}>{scheduleDateText}</Box>
          <Box className={classes.liveInfo}>{liveInfo}</Box>
          <Box className={classes.contentTitle}>{liveContents.title}</Box>
          <Box className={classes.showroom}>
            <ListItemAvatar className={classes.avatar}>
              <Avatar alt={showRoom.name} src={showRoom.primaryImage.path} className={classes.small} />
            </ListItemAvatar>
            {showRoom.name}
          </Box>
        </ListItemText>
        <ScheduleAdditionalInfo className={classes.info} id={id} bannerType={bannerType} />
        <Chip className={classes.id} label={`#${id}`} size="small" color="primary" />
      </ListItem>
    );
  },
);

const useStyles = makeStyles<Theme, { scheduled: boolean }>((theme) => ({
  root: {
    position: 'relative',
    border: 0,
    boxShadow: '0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)',
    borderRadius: '2px',
    backgroundColor: (props) => (props.scheduled ? '#5991ff' : theme.palette.grey[300]),
    marginTop: '10px',
    color: (props) => (props.scheduled ? theme.palette.common.white : theme.palette.grey[600]),
    cursor: 'pointer',
  },

  time: {
    fontSize: '20px',
    marginBottom: '6px',
  },

  liveInfo: {
    fontSize: '14px',
  },

  contentTitle: {
    fontSize: '16px',
    fontWeight: 'bold',
    marginBottom: '10px',
  },

  showroom: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    fontSize: '14px',
  },

  avatar: {
    minWidth: theme.spacing(3),
    marginRight: theme.spacing(1),
  },

  small: {
    width: theme.spacing(3),
    height: theme.spacing(3),
  },

  info: {
    position: 'absolute',
    bottom: '14px',
    right: '8px',
    color: (props) => (props.scheduled ? theme.palette.common.white : theme.palette.grey[600]),
  },

  id: {
    fontSize: '12px',
    position: 'absolute',
    top: '8px',
    right: '8px',
  },
}));
