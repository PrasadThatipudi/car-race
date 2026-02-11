class Car extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return React.createElement("div", {
      style: { position: "relative", top: `${this.props.carPosition}px` },
      className: "car",
    });
  }
}

class Way extends React.Component {
  constructor(props) {
    super(props);
    this.state = { carPosition: 0 };
  }

  componentDidMount() {
    setInterval(() => {
      this.setState(({ carPosition }) => ({ carPosition: carPosition + 10 }));
    }, 1000);
  }

  render() {
    const dimensions = this.props.dimensions;

    return React.createElement(
      "div",
      {
        className: "way",
        style: { ...dimensions },
      },
      React.createElement(Car, { carPosition: this.state.carPosition }),
    );
  }
}

class Road extends React.Component {
  constructor(props) {
    super(props);
    this.wayDimensions = { height: 300, width: 110 };
  }

  render() {
    const ways = Array.from({ length: 1 }, (_, index) =>
      React.createElement(Way, { key: index, dimensions: this.wayDimensions }),
    );

    return React.createElement("div", { className: "road" }, ways);
  }
}

ReactDOM.render(React.createElement(Road), main_container);
