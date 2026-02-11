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

const car = React.createElement(Car);
ReactDOM.render(
  React.createElement("div", { className: "road" }, car),
  main_container,
);
