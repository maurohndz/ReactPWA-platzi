import React, { Component } from "react";

export default class IfOffline extends Component {
  constructor(props) {
    super(props);

    this.state = { onLine: navigator ? navigator.onLine : true };
  }

  componentDidMount() {
    if (!window) return;

    window.addEventListener("online", this.goOnline);
    window.addEventListener("offline", this.goOffline);
  }

  componentWillUnmount() {
    if (!window) return;

    window.removeEventListener("online", this.goOnline);
    window.removeEventListener("offline", this.goOffline);
  }

  goOnline = () => {
    this.setState({
      ...this.state,
      onLine: true,
    });
  };

  goOffline = () => {
    this.setState({
      ...this.state,
      onLine: false,
    });
  };

  render() {
    const { children } = this.props;
    const { onLine } = this.state;
    return <React.Fragment>{!onLine && <p>{children}</p>}</React.Fragment>;
  }
}
