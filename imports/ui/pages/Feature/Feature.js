import React, { Component } from "react";
import PropTypes from "prop-types";
import { withTracker } from "meteor/react-meteor-data";
import { Meteor } from "meteor/meteor";
import { Trainers } from "../../../api/trainers";
import { Clients } from "../../../api/clients";
import MapWithAMarker from "../../components/MapWithAMarker";
import { withStyles, Grid } from "@material-ui/core";
import styles from "./styles";

class Feature extends Component {
  constructor(props) {
    super(props);
    this.state = {
      radius: 50
    };
  }

  radiusChanger = value => {
    this.setState({ radius: value });
  };

  render() {
    const { classes } = this.props;

    return (
      <div>
        <Grid
          container
          className={classes.root}
          direction="row"
          alignItems="center"
          justify="center"
        >
          <Grid item xs={12} sm={12}>
            <MapWithAMarker />
          </Grid>
          */}
        </Grid>
      </div>
    );
  }
}

Feature.propTypes = {
  classes: PropTypes.object.isRequired,
  clients: PropTypes.array.isRequired,
  currentUserId: PropTypes.string.isRequired,
  history: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  trainers: PropTypes.array.isRequired
};

export default withTracker(() => {
  Meteor.subscribe("clients");
  Meteor.subscribe("trainers");
  return {
    trainers: Trainers.find({}).fetch(),
    clients: Clients.find({}).fetch(),
    currentUserId: Meteor.userId()
  };
})(withStyles(styles)(Feature));
