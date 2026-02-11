class Car extends React.Component {
  constructor(props) {
    super(props);
    this.state = { top: 0 };
  }

  componentDidMount() {
    setInterval(() => {
      this.setState(({ top }) => ({ top: top + 10 }));
    }, 1000);
  }

  render() {
    return React.createElement("div", {
      style: { position: "relative", top: `${this.state.top}px` },
      className: "car",
    });
  }
}

class Way extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const road = this.props.road;
    const car = React.createElement(Car);

    return React.createElement(
      "div",
      {
        className: "way",
        style: { ...road },
      },
      car,
    );
  }
}

class Road extends React.Component {
  constructor(props) {
    super(props);
    this.wayDimensions = { height: 300, width: 110 };
  }

  render() {
    const ways = Array.from({ length: 3 }, (_, index) =>
      React.createElement(Way, { key: index, road: this.wayDimensions }),
    );

    return React.createElement("div", { className: "road" }, ways);
  }
}

ReactDOM.render(React.createElement(Road), main_container);
