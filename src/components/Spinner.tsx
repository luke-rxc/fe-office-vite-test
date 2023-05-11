import type { ReactNode, VFC } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { ClassNameMap } from '@material-ui/styles/withStyles';
import useMediaQuery from '@material-ui/core/useMediaQuery';

const useStyles = makeStyles(() => ({
  overlay: {
    position: 'fixed',
    top: 0,
    right: 0,
    left: 0,
    bottom: 0,
    zIndex: 1400,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    animation: '$fadeIn 0.7s forwards',
    flexDirection: 'column',
  },
  overlayWide: {},
  spinner: {
    margin: '20px auto',
    width: 50,
    height: 40,
    textAlign: 'center',
  },
  spinBar: {
    backgroundColor: '#fff',
    height: '100%',
    width: 6,
    margin: '0 3px 0 0',
    display: 'inline-block',
    animation: '$stretch 1.2s infinite ease-in-out',
  },
  '@keyframes fadeIn': {
    '0%': {
      backgroundColor: 'rgba(0,0,0,0)',
    },
    '100%': {
      backgroundColor: 'rgba(0,0,0,.5)',
    },
  },
  '@keyframes stretch': {
    '0%, 40%, 100%': { transform: 'scaleY(0.4)' },
    '20%': { transform: 'scaleY(1.0)' },
  },
  message: {
    color: '#fff',
  },
}));

type SpinnerProps = {
  message: ReactNode;
};
export const Spinner: VFC<SpinnerProps> = ({ message }) => {
  const classes: ClassNameMap = useStyles();
  const matches = useMediaQuery('(min-width:1280px)');
  return (
    <div className={`${classes.overlay} ${matches && classes.overlayWide}`}>
      <div className={classes.spinner}>
        <div className={`${classes.spinBar}`}></div>
        <div className={`${classes.spinBar}`} style={{ animationDelay: '-1.1s' }}></div>
        <div className={`${classes.spinBar} rect3`} style={{ animationDelay: '-1.0s' }}></div>
        <div className={`${classes.spinBar} rect4`} style={{ animationDelay: '-0.9s' }}></div>
        <div className={`${classes.spinBar} rect5`} style={{ animationDelay: '-0.8s' }}></div>
      </div>
      {message && <div className={`${classes.message}`}>{message}</div>}
    </div>
  );
};
