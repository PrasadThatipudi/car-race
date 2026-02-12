const uniqueIdGenerator = (start) => () => start++;
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
      id: this.props.carId,
      className: "car",
    });
  }
}

class Lane extends React.Component {
  constructor(props) {
    super(props);
    this.carDimensions = props.carDimensions;
  }

  isGameOver() {
    const racingCar = this.props.racingCar;
    const cars = this.props.cars;

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

      this.props.updateAllCarsPositions();
    }, this.props.carSpeed);
  }

  render() {
    const cars = this.props.cars.map(({ carPosition, carId }) =>
      React.createElement(Car, {
        carPosition,
        carId: carId,
        key: carId.toString(),
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
            carId: "racing-car",
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
    this.laneDimensions = { height: 600, width: 110 };
    this.carDimensions = { height: 100, width: 90 };
    this.noOfLanes = 3;
    this.carSpeed = 10;
    this.offSet = 1;
    this.uniqueCarId = uniqueIdGenerator(0);
    this.carStartingPosition = -this.carDimensions.height;
    this.state = {
      racingCar: {
        carPosition: this.laneDimensions.height - this.carDimensions.height,
      },
      lanes: Array.from({ length: this.noOfLanes }, () => ({ cars: [] })),
      racingCarLanePosition: 0,
      isGameOver: false,
    };

    this.whenGameOver = this.whenGameOver.bind(this);
    this.handleMovingRacingCar = this.handleMovingRacingCar.bind(this);
    this.updateCarPosition = this.updateCarPosition.bind(null, this.offSet);
    this.isCarReachedEndOfRoad = this.isCarReachedEndOfRoad.bind(
      null,
      this.laneDimensions.height,
    );
    this.updateAllCarsPositions = this.updateAllCarsPositions.bind(this);
    this.addCar = this.addCar.bind(this);
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
    if (event.key === "ArrowLeft") {
      return this.moveCarToLeftLane();
    }

    if (event.key === "ArrowRight") {
      return this.moveCarToRightLane();
    }
  }

  addCar(lane) {
    const newCar = {
      carPosition: this.carStartingPosition,
      carId: this.uniqueCarId(),
    };

    return { cars: [...lane.cars, newCar] };
  }

  componentDidMount() {
    let laneIndexToAddCar = 0;

    const intervalId = setInterval(() => {
      if (this.state.isGameOver) {
        return clearInterval(intervalId);
      }

      this.setState(({ lanes }) => {
        const copyOfLanes = [...lanes];

        copyOfLanes[laneIndexToAddCar] = this.addCar(
          copyOfLanes[laneIndexToAddCar],
        );

        laneIndexToAddCar = (laneIndexToAddCar + 1) % this.noOfLanes;
        return { lanes: copyOfLanes };
      });
    }, this.carSpeed * 100);
  }

  updateCarPosition(offSet, car) {
    return { ...car, carPosition: car.carPosition + offSet };
  }

  isCarReachedEndOfRoad(roadHeight, car) {
    return car.carPosition < roadHeight;
  }

  updateAllCarsPositions() {
    this.setState(({ lanes }) => ({
      lanes: lanes.map(({ cars }) => ({
        cars: cars
          .map(this.updateCarPosition)
          .filter(this.isCarReachedEndOfRoad),
      })),
    }));
  }

  render() {
    this.state.lanes[this.state.racingCarLanePosition] = {
      ...this.state.lanes[this.state.racingCarLanePosition],
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
      this.state.lanes.map((properties, index) =>
        React.createElement(Lane, {
          key: index,
          laneDimensions: this.laneDimensions,
          carDimensions: this.carDimensions,
          isGameOver: this.state.isGameOver,
          carSpeed: this.carSpeed,
          updateAllCarsPositions: this.updateAllCarsPositions,
          ...properties,
        }),
      ),
    );
  }
}

ReactDOM.render(React.createElement(Road), main_container);
