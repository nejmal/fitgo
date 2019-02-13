import React, { Component } from "react";
import styles from "./styles";
import OptionList from "../../components/OptionsList";
import FullScreenLoader from "../../components/FullScreenLoader";

const About = ({ classes }) => {
  return (
    <>
      <FullScreenLoader />
      <div>
        <OptionList />
      </div>
    </>
  );
};

export default About;
