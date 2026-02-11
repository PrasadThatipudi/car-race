class Car extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return React.createElement("div", {
      style: {
        position: "absolute",
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
    this.carDimensions = props.carDimensions;
    this.state = {
      cars: [{ carPosition: -this.carDimensions.height }],
    };
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

  isGameOver() {
    const racingCar = this.props.racingCar;
    const cars = this.state.cars;

    return cars.some(
      (car) =>
        car.carPosition + this.carDimensions.height >= racingCar.carPosition,
    );
  }

  componentDidMount() {
    const internalId = setInterval(() => {
      if (this.props.isGameOver) {
        return clearInterval(internalId);
      }

      if (this.props.racingCar && this.isGameOver()) {
        this.props.whenGameOver();
        return clearInterval(internalId);
      }

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
        style: { ...this.props.wayDimensions, position: "relative" },
      },
      cars,
      this.props.racingCar
        ? React.createElement(Car, {
            carPosition: this.props.racingCar.carPosition,
            key: "racing-car",
            carDimensions: this.carDimensions,
          })
        : null,
    );
  }
}

class Road extends React.Component {
  constructor(props) {
    super(props);
    this.wayDimensions = { height: 200, width: 110 };
    this.carDimensions = { height: 100, width: 90 };
    this.state = {
      racingCar: {
        carPosition: this.wayDimensions.height - this.carDimensions.height,
      },
      racingCarWayPosition: 0,
      isGameOver: false,
    };

    this.whenGameOver = this.whenGameOver.bind(this);
  }

  whenGameOver() {
    this.setState({ isGameOver: true });
  }

  render() {
    const ways = Array.from({ length: 3 }, () => ({}));

    ways[this.state.racingCarWayPosition] = {
      racingCar: this.state.racingCar,
      whenGameOver: this.whenGameOver,
    };

    return React.createElement(
      "div",
      { className: "road" },
      ways.map((properties, index) =>
        React.createElement(Way, {
          key: index,
          wayDimensions: this.wayDimensions,
          carDimensions: this.carDimensions,
          isGameOver: this.state.isGameOver,
          ...properties,
        }),
      ),
    );
  }
}

ReactDOM.render(React.createElement(Road), main_container);
