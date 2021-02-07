import List from '@material-ui/core/List';
import React from 'react';
import useVideoContext from '../hooks/useVideoContext/useVideoContext';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Badge from '@material-ui/core/Badge';
import VerifiedUserIcon from '@material-ui/icons/VerifiedUser';
import Avatar from '@material-ui/core/Avatar';
import indigo from '@material-ui/core/colors/indigo';
import { ActionButton } from '@eventdex/common';
import CloseIcon from '@material-ui/icons/Close';

const useStyles = makeStyles(theme => ({
  // root: theme => ({
  //     // paddingLeft:0,
  //     // paddingRight:0,
  //     maxHeight: 66
  // }),
  // secondary: theme => ({
  //     color: theme.palette.text.secondary,
  //     fontSize: theme.typography.caption.fontSize,
  //     fontWeight: theme.typography.fontWeightBold
  // }),
  // primary: theme => ({
  //     color: theme.palette.text.primary,
  //     fontSize: theme.typography.subtitle2.fontSize,
  //     fontWeight: theme.typography.fontWeightBold
  // }),

  avatar: props => ({
    border: 'solid 1px',
    borderColor: theme.palette.primary.contrastText,
    color: theme.palette.primary.contrastText,
    backgroundColor: theme.palette.primary.main,
    fontWeight: theme.typography.fontWeightBold,
  }),
  large: {
    width: theme.spacing(15),
    height: theme.spacing(15),
  },
  small: {
    width: theme.spacing(5),
    height: theme.spacing(5),
  },
  iconBussinessCard: {
    color: indigo[400],
    fontSize: 40,
    top: '-6%',
    right: '5%',
    // color: indigo[400],
    position: 'absolute',
    // alignSelf: 'flex-end',
    // top: '10%',
    // right:'35%',
    // padding:'10px'
    /* marginLeft: '14%' */
  },
  iconRoot: props => ({
    color: indigo[400],
    fontSize: 40,
  }),
}));

function ParticipantItem(props) {
  const { connection, removeButtonOn, onRemove, name, isAdmin, imageUrl } = props;
  const classes = useStyles();

  return (
    <ListItem button ContainerComponent={'div'}>
      <ListItemAvatar>
        <Badge
          overlap="circle"
          invisible={!isAdmin}
          badgeContent={
            <VerifiedUserIcon
              color={'secondary'}
              style={{ fontSize: 16, borderRadius: '50%' }}
              className={'admin-badge'}
            />
          }
        >
          <div className={'avatar-container'}>
            {/*{(attendee.status && attendee.status.includes('invited')) ?*/}
            {/*    <CircularProgress className={'avatar-progress'}/> : null}*/}

            <Avatar
              className={classes.avatar}
              alt={name}
              src={imageUrl}
              // style={getBorderStyle(online, attendee)}
            >
              {name
                .split(' ')
                .map(word => word[0])
                .join('')}
            </Avatar>
          </div>
        </Badge>
      </ListItemAvatar>
      <ListItemText
        // classes={{
        //     secondary: classes.secondary,
        //     primary: classes.primary,
        // }}
        primary={name}
        // secondary={secondLine}
      />

      {removeButtonOn && (
        <ActionButton
          withText={false}
          text={'Remove'}
          tooltip={'Remove user from call'}
          icon={<CloseIcon />}
          onClick={() => onRemove(connection)}
        />
      )}
    </ListItem>
  );
}

export default function ParticipantList(props) {
  const { connections, connection: myConnection, removeParticipant } = useVideoContext();
  const amIAdmin = myConnection.permissions?.forceDisconnect;

  return (
    <List>
      {connections.map(connection => {
        let isMyself = connection === myConnection;
        console.log('connection.data', connection.data);
        let data = connection.data ? JSON.parse(connection.data) : {};
        const { name = '', email, imageUrl } = data;
        const isAdmin = connection.permissions?.forceDisconnect;

        return (
          <ParticipantItem
            key={connection.id}
            connection={connection}
            removeButtonOn={amIAdmin && !isMyself}
            onRemove={removeParticipant}
            name={name}
            isAdmin={isAdmin}
            imageUrl={imageUrl}
          />
        );
      })}
    </List>
  );
}
