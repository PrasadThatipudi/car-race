class Car extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return React.createElement("div", {
      style: {
        position: "relative",
        top: `${this.props.carPosition}px`,
        width: `${this.props.carDimensions.width}px`,
        height: `${this.props.carDimensions.height}px`,
      },
      className: "car",
    });
  }
}

class Way extends React.Component {
  constructor(props) {
    super(props);
    this.carDimensions = { height: 100, width: 90 };
    this.state = { cars: [{ carPosition: -this.carDimensions.height }] };
    this.offSet = 30;
    this.updateCarPosition = this.updateCarPosition.bind(null, this.offSet);
    this.isCarReachedEndOfRoad = this.isCarReachedEndOfRoad.bind(
      null,
      this.props.wayDimensions.height,
    );
  }

  updateCarPosition(offSet, car) {
    return { carPosition: car.carPosition + offSet };
  }

  isCarReachedEndOfRoad(roadHeight, car) {
    return car.carPosition < roadHeight;
  }

  componentDidMount() {
    setInterval(() => {
      this.setState((state) => {
        const cars = state.cars
          .map(this.updateCarPosition)
          .filter(this.isCarReachedEndOfRoad);

        return { cars };
      });
    }, 1000);
  }

  render() {
    const cars = this.state.cars.map(({ carPosition }, index) =>
      React.createElement(Car, {
        carPosition,
        key: index,
        carDimensions: this.carDimensions,
      }),
    );

    return React.createElement(
      "div",
      {
        className: "way",
        style: { ...this.props.wayDimensions },
      },
      cars,
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
      React.createElement(Way, {
        key: index,
        wayDimensions: this.wayDimensions,
      }),
    );

    return React.createElement("div", { className: "road" }, ways);
  }
}

ReactDOM.render(React.createElement(Road), main_container);
