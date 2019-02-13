import React, { Component } from "react";
import PropTypes from "prop-types";
import ReactJoyride, { STATUS } from "react-joyride";
// import styled from "styled-components";
// import a11yChecker from "a11y-checker";

// import { ReactComponent } from "../media/logo.svg";

// import "./styles.css";

// const Logo = styled(ReactComponent)`
//   height: auto;
//   margin-bottom: 10px;
//   max-height: 100%;
//   max-width: ${({ breakpoint }) =>
//     `${breakpoint === "lg" ? "500px" : "290px"}`};
//   width: 100%;
// `;

// const Subtitle = styled.p`
//   font-size: ${({ breakpoint }) => `${breakpoint === "lg" ? "35px" : "20px"}`};
//   margin: 0 auto;
//   width: 100%;
// `;

class Onboard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      run: false,
      steps: [
        {
          content: <h2>Ready for your Fitgo Journey?</h2>,
          placement: "center",
          locale: { skip: <strong aria-label="skip">S-K-I-P</strong> },
          target: "body"
        },
        {
          content: "Tim",
          placement: "bottom",
          styles: {
            options: {
              width: 300
            }
          },
          target: ".demo__projects h2",
          title: "What shall i call you?"
        },
        {
          title: "Always a good time to train",
          content: (
            <div>
              Are you a trainer or a client?
              <br />
              <h3>Trainer</h3>
            </div>
          ),
          target: ".demo__how-it-works h2",
          placement: "top"
        },
        {
          content: (
            <div>
              <h3>What are you trying to achieve with fitGo?</h3>
              <svg
                width="50px"
                height="50px"
                viewBox="0 0 96 96"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                preserveAspectRatio="xMidYMid"
              >
                <g>
                  <path
                    d="M83.2922435,72.3864207 C69.5357835,69.2103145 56.7313553,66.4262214 62.9315626,54.7138297 C81.812194,19.0646376 67.93573,0 48.0030634,0 C27.6743835,0 14.1459311,19.796662 33.0745641,54.7138297 C39.4627778,66.4942237 26.1743334,69.2783168 12.7138832,72.3864207 C0.421472164,75.2265157 -0.0385432192,81.3307198 0.0014581185,92.0030767 L0.0174586536,96.0032105 L95.9806678,96.0032105 L95.9966684,92.1270809 C96.04467,81.3747213 95.628656,75.2385161 83.2922435,72.3864207 Z"
                    fill="#000000"
                  />
                </g>
              </svg>
            </div>
          ),
          placement: "left",
          target: ".demo__about h2"
        }
      ]
    };
  }

  handleClickStart = e => {
    e.preventDefault();

    this.setState({
      run: true
    });
  };

  handleJoyrideCallback = data => {
    const { status, type } = data;

    if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
      this.setState({ run: false });
    }

    console.groupCollapsed(type);
    console.log(data); //eslint-disable-line no-console
    console.groupEnd();
  };

  render() {
    const { run, steps } = this.state;
    const { breakpoint } = this.props;

    return (
      <div className="demo-wrapper">
        <ReactJoyride
          callback={this.handleJoyrideCallback}
          continuous
          run={run}
          scrollToFirstStep
          showProgress
          showSkipButton
          steps={steps}
          styles={{
            options: {
              zIndex: 10000
            }
          }}
        />

        <div className="demo__section demo__hero">
          <div>
            
            <button onClick={this.handleClickStart}>Start</button>
          </div>
        </div>
        <div className="demo__section demo__projects">
          <h2>Username</h2>
        </div>
        <div className="demo__section demo__how-it-works">
          <h2>Role</h2>
        </div>
        <div className="demo__section demo__about">
          <h2>Goals</h2>
        </div>
      </div>
    );
  }
}

export default Onboard;
