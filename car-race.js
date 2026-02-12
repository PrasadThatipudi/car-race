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

class Lane extends React.Component {
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
      this.props.laneDimensions.height,
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
        className: "lane",
        style: { ...this.props.laneDimensions, position: "relative" },
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
    this.laneDimensions = { height: 200, width: 110 };
    this.carDimensions = { height: 100, width: 90 };
    this.noOfLanes = 3;
    this.state = {
      racingCar: {
        carPosition: this.laneDimensions.height - this.carDimensions.height,
      },
      racingCarLanePosition: 0,
      isGameOver: false,
    };

    this.whenGameOver = this.whenGameOver.bind(this);
    this.handleMovingRacingCar = this.handleMovingRacingCar.bind(this);
  }

  whenGameOver() {
    this.setState({ isGameOver: true });
  }

  moveCarToLeftLane() {
    this.setState(({ racingCarLanePosition }) =>
      racingCarLanePosition === 0
        ? { racingCarLanePosition }
        : { racingCarLanePosition: racingCarLanePosition - 1 },
    );
  }

  moveCarToRightLane() {
    this.setState(({ racingCarLanePosition }) =>
      racingCarLanePosition + 1 === this.noOfLanes
        ? { racingCarLanePosition }
        : { racingCarLanePosition: racingCarLanePosition + 1 },
    );
  }

  handleMovingRacingCar(event) {
    console.log("Inside handler");
    if (event.key === "ArrowLeft") {
      return this.moveCarToLeftLane();
    }

    if (event.key === "ArrowRight") {
      return this.moveCarToRightLane();
    }
  }

  render() {
    const lanes = Array.from({ length: this.noOfLanes }, () => ({}));

    lanes[this.state.racingCarLanePosition] = {
      racingCar: this.state.racingCar,
      whenGameOver: this.whenGameOver,
    };

    document.addEventListener("keydown", this.handleMovingRacingCar);

    if (this.state.isGameOver) {
      document.removeEventListener("keydown", this.handleMovingRacingCar);
    }

    return React.createElement(
      "div",
      { className: "road" },
      lanes.map((properties, index) =>
        React.createElement(Lane, {
          key: index,
          laneDimensions: this.laneDimensions,
          carDimensions: this.carDimensions,
          isGameOver: this.state.isGameOver,
          ...properties,
        }),
      ),
    );
  }
}

ReactDOM.render(React.createElement(Road), main_container);
