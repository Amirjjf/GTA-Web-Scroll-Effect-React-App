import React from "react";
import "./LoadingScreen.css";

const LoadingScreen = ({ progress = 0 }) => (
  <div className="loading-screen">
    <div className="loading-spinner" />
    <div className="loading-text">Loading... {progress}%</div>
  </div>
);

export default LoadingScreen;
