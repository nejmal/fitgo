import React, { Fragment } from 'react';
import { compose, withProps, withHandlers, withState } from 'recompose';
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker
} from 'react-google-maps';
import distanceFilter from './DistanceCalculator';
import GoogleMapStyles from './GoogleMapStyles.json';
import OptionBar from '../OptionBar/index';
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
import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';
import RadiusSlider from '../RadiusSlider';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
// import ListItemText from '@material-ui/core/ListItemText';
import Select from '@material-ui/core/Select';

import styles from './styles';

import { LocationListOfTrainers } from './fakeData';

class MapWithAMarker extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentZoom: null,
      activeUserFocus: true,
      radius: 50,
      currentLatLng: {
        lat: 0,
        lng: 0
      },
      isMarkerShown: false,
      open: false // drawer
    };
  }

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
            lat: position.coords.latitude,
            lng: position.coords.longitude
          },
          isMarkerShown: true
        }));
      });
    } else {
      error => console.log(error);
    }
  };

  // selected skills
  // handleSelectTags = event => {
  //   this.setState({ selectedTags: event.target.value });
  // };

  // generateTagsText(tags, selected) {
  //   return tags
  //     .map(t => (selected.indexOf(t.id) > -1 ? t.title : false))
  //     .filter(e => e)
  //     .join(', ');
  // }

  render() {
    const { classes, theme } = this.props;
    const { open } = this.state;
    // this.state = {
    //   selectedTags: []
    // };

    const skillsFilter = (selectedTags, trainers) => {
      return trainers.filter(trainer => {
        return trainer.skills.some(skill => selectedTags.includes(skill));
      });
    };

    console.log(skillsFilter(['yoga'], LocationListOfTrainers));

    return (
      <Fragment>
        <div className={classes.root}>
          <CssBaseline />
          <Toolbar disableGutters={!open}>
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
              <img src='/black-logo.svg' alt='FitGO Logo' width='60' />
              <IconButton onClick={this.handleDrawerClose}>
                {theme.direction === 'ltr' ? (
                  <ChevronLeftIcon />
                ) : (
                  <ChevronRightIcon />
                )}
              </IconButton>
            </div>
            <Divider />
            <List>
              <RadiusSlider radiusChanger={this.radiusChanger} />
              {/* <FormControl className={classes.formControl}>
                <InputLabel htmlFor='select-multiple-checkbox'>
                  Filter by Skills
                </InputLabel>
                <Select
                  multiple
                  value={this.state.selectedTags}
                  onChange={this.handleSelectTags}
                  input={<Input id='select-multiple-checkbox' />}
                  renderValue={selected =>
                    this.generateTagsText(tags, selected)
                  }
                  className={classes.tags}
                >
                  {tags.map(tag => (
                    <MenuItem key={tag.id} value={tag.id}>
                      <Checkbox
                        checked={this.state.selectedTags.indexOf(tag.id) > -1}
                      />
                      <ListItemText
                        primary={tag.title}
                        className={classes.capitalize}
                      />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl> */}
            </List>
            <List>
              {['Inbox', 'Starred', 'Send email', 'Drafts'].map(
                (text, index) => (
                  <ListItem button key={text}>
                    <ListItemIcon>
                      {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                    </ListItemIcon>
                    <ListItemText primary={text} />
                  </ListItem>
                )
              )}
            </List>
            <Divider />
            <List>
              {['All mail', 'Trash', 'Spam'].map((text, index) => (
                <ListItem button key={text}>
                  <ListItemIcon>
                    {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                  </ListItemIcon>
                  <ListItemText primary={text} />
                </ListItem>
              ))}
            </List>
          </Drawer>
          <main
            className={classNames(classes.content, {
              [classes.contentShift]: open
            })}
          >
            <div className={classes.drawerHeader} />
            <OptionBar
              moveToUser={this.moveToUser}
              isActiveUserFocus={this.state.activeUserFocus}
              handleActiveUserFocus={this.handleActiveUserFocus}
            />
            <GoogleMap
              options={{ styles: GoogleMapStyles }}
              defaultZoom={16}
              center={{
                lat: this.state.currentLatLng.lat,
                lng: this.state.currentLatLng.lng
              }}
              zoom={this.state.currentZoom}
              onZoomChanged={this.props.onZoomChanged}
              ref={this.props.onMapMounted}
            >
              {this.state.isMarkerShown && (
                <div>
                  <Marker
                    position={{
                      lat: this.state.currentLatLng.lat,
                      lng: this.state.currentLatLng.lng
                    }}
                    onClick={this.props.onMarkerClick}
                  />
                  {distanceFilter(
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
                  })}
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
      'https://maps.googleapis.com/maps/api/js?key=AIzaSyBWPwKUYnXu1nJSeEr8SQKEXJ2jAfKYdXA&callback=initMap',
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: <div style={{ height: `400px` }} />,
    mapElement: <div style={{ height: `100%` }} />
  }),
  withScriptjs,
  withState('zoom', 'onZoomChange', 16),
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
  withStyles(styles, { withTheme: true })
)(props => <MapWithAMarker {...props} />);
