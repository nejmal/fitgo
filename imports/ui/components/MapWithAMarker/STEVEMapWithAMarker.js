import React, { Component, Fragment } from 'react';
import { compose, withProps, withHandlers, withState } from 'recompose';
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
  InfoWindow
} from 'react-google-maps';
import distanceFilter from './DistanceCalculator';
import GoogleMapStyles from './GoogleMapStyles.json';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import CssBaseline from '@material-ui/core/CssBaseline';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import OptionList from '../OptionsList';
import Fab from '@material-ui/core/Fab';
import LocationIcon from '@material-ui/icons/Navigation';
import FindMeBtn from '../FindMeBtn';
import { withTracker } from 'meteor/react-meteor-data';
import styles from './styles';
import { Meteor } from 'meteor/meteor';
import { Trainers } from '../../../api/trainers';
import FavIconFilled from '@material-ui/icons/Favorite';
import FavIconOutline from '@material-ui/icons/FavoriteBorder';
import HeartIcon from '../FavouriteIcon/FavouriteIcon';

// const FavIcon = ({ favourite, onClick }) => {
//   return (
//     <IconButton onClick={onClick} color="primary">
//       {favourite ? <FavIconFilled /> : <FavIconOutline />}
//     </IconButton>
//   );
// };

class MapWithAMarker extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentZoom: null,
      activeUserFocus: true,
      radius: 50,
      currentLatLng: {
        latitude: 0,
        longitude: 0
      },
      isMarkerShown: false,
      open: false,
      skills: [] // drawer
    };
  }
  handleSkills = skills => {
    console.log('asdfasdf');
    console.log(this.state.skills);
    this.setState({ skills });
  };

  handleDrawerOpen = () => {
    this.setState({ open: true });
  };

  handleDrawerClose = () => {
    this.setState({ open: false });
  };

  radiusChanger = (event, value) => {
    this.setState({ radius: value });
  };

  componentDidMount() {
    this.moveToUser();
    this.setState({ currentZoom: this.props.zoom });
  }

  handleActiveUserFocus = () => {
    this.props.setZoomToDefault();
    // console.log(this.props.onMapMounted);
  };

  moveToUser = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        this.setState(prevState => ({
          currentLatLng: {
            ...prevState.currentLatLng,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          },
          isMarkerShown: true
        }));
      });
    } else {
      error => console.log(error);
    }
  };

  handleMarkerClick = clickedTrainer => {
    this.setState({ clickedTrainer: clickedTrainer });
  };

  render() {
    const {
      classes,
      theme,
      moveToUser,
      isActiveUserFocus,
      handleActiveUserFocus,
      trainers
    } = this.props;
    const { open } = this.state;

    return (
      <Fragment>
        <div className={classes.root}>
          <CssBaseline />
          <Toolbar disableGutters={!open} className={classes.toolbar}>
            <IconButton
              color='secondary'
              aria-label='Open drawer'
              onClick={this.handleDrawerOpen}
              className={classNames(classes.menuButton, open && classes.hide)}
            >
              <MenuIcon />
            </IconButton>
          </Toolbar>
          <Drawer
            className={classes.drawer}
            variant='persistent'
            anchor='left'
            open={open}
            classes={{
              paper: classes.drawerPaper
            }}
          >
            <div className={classes.drawerHeader}>
              <img
                src='/black-logo.svg'
                alt='FitGO Logo'
                width='60'
                className={classes.logo}
              />
              <IconButton onClick={this.handleDrawerClose}>
                {theme.direction === 'ltr' ? (
                  <ChevronLeftIcon />
                ) : (
                  <ChevronRightIcon />
                )}
              </IconButton>
            </div>
            <Divider />
            <OptionList
              handleSkills={this.handleSkills}
              radiusChanger={this.radiusChanger}
            />
            <Divider />
            {this.state.clickedTrainer && (
              <List className={classes.trainerProfileWrapper}>
                <img
                  src='http://www.cutestpaw.com/wp-content/uploads/2011/11/To-infinity-and-beyond.jpeg'
                  alt='Trainer Profile Image'
                  width='100%'
                />
                <ListItem
                  key={this.state.clickedTrainer._id}
                  value={this.state.clickedTrainer}
                >
                  <ListItemText>
                    <Typography variant='h4'>
                      {this.state.clickedTrainer.name}
                    </Typography>
                    <Typography variant='h6' gutterBottom>
                      {this.state.clickedTrainer.email}
                    </Typography>
                    <Typography variant='button' color='secondary'>
                      Education
                    </Typography>
                    <Typography component='p' gutterBottom>
                      {this.state.clickedTrainer.education}
                    </Typography>
                    <Typography variant='button' color='secondary'>
                      Languages
                    </Typography>
                    <Typography component='p' gutterBottom>
                      {this.state.clickedTrainer.languages.join(', ')}
                    </Typography>
                    <Typography variant='button' color='secondary'>
                      Skills
                    </Typography>
                    <Typography component='p' className={classes.capitalize}>
                      {this.state.clickedTrainer.skills.join(', ')}
                    </Typography>
                  </ListItemText>
                  <HeartIcon />
                  {/* <HeartIcon trainers={trainers._}/> */}
                </ListItem>
              </List>
            )}
          </Drawer>
          <main
            className={classNames(classes.content, {
              [classes.contentShift]: open
            })}
          >
            {/* <div className={classes.drawerHeader} /> */}
            <FindMeBtn
              moveToUser={this.moveToUser}
              isActiveUserFocus={this.state.activeUserFocus}
              handleActiveUserFocus={this.handleActiveUserFocus}
            />
            <GoogleMap
              options={{ styles: GoogleMapStyles }}
              defaultZoom={16}
              center={{
                lat: this.state.currentLatLng.latitude,
                lng: this.state.currentLatLng.longitude
              }}
              zoom={this.state.currentZoom}
              onZoomChanged={this.props.onZoomChanged}
              ref={this.props.onMapMounted}
            >
              {this.state.isMarkerShown && (
                <div>
                  <Marker
                    position={{
                      lat: this.state.currentLatLng.latitude,
                      lng: this.state.currentLatLng.longitude
                    }}
                    onClick={this.props.onMarkerClick}
                    defaultIcon='/client-marker.png'
                  />
                  {trainers.map(trainer => {
                    const trainerLocation = distanceFilter(
                      this.state.currentLatLng,
                      trainer.currentLocation,
                      this.state.radius * 500
                    );

                    return trainerLocation ? (
                      <Marker
                        key={trainer._id}
                        position={{
                          lat: trainerLocation.latitude,
                          lng: trainerLocation.longitude
                        }}
                      />
                    ) : null;
                  })}

                  {/* {distanceFilter(
                    {
                      latitude: this.state.currentLatLng.lat,
                      longitude: this.state.currentLatLng.lng
                    },
                    LocationListOfTrainers,
                    this.state.radius * 1000
                  ).map((trainer, i) => {
                    return trainer ? (
                      <Marker
                        key={i}
                        position={{
                          lat: trainer.latitude,
                          lng: trainer.longitude
                        }}
                      />
                    ) : null;
                  })} */}
                </div>
              )}
            </GoogleMap>
          </main>
        </div>
      </Fragment>
    );
  }
}
// );

export default compose(
  withProps({
    googleMapURL:
      'https://maps.googleapis.com/maps/api/js?key=AIzaSyBWPwKUYnXu1nJSeEr8SQKEXJ2jAfKYdXA',
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: <div style={{ height: `100vh` }} />,
    mapElement: <div style={{ height: `100%` }} />
  }),
  withScriptjs,
  withState('zoom', 'onZoomChange', 12),
  withHandlers(() => {
    const refs = {
      map: undefined
    };
    return {
      onMapMounted: () => ref => {
        refs.map = ref;
      },
      onZoomChanged: ({ onZoomChange }) => () => {
        onZoomChange(refs.map.getZoom());
      },
      setZoomToDefault: () => () => {
        refs.map.setZoom(16);
      }
    };
  }),
  withGoogleMap,
  withTracker(() => {
    Meteor.subscribe('trainers');
    return {
      trainers: Trainers.find({}).fetch()
    };
  }),
  withStyles(styles, { withTheme: true })
)(props => <MapWithAMarker {...props} />);