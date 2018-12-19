import React from "react";

export default class Clock extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            time: new Date()
        };
    }

    componentDidMount() {
        this.intervalId = setInterval(
            () =>
                this.setState({
                    time: new Date()
                }),
            1000
        );
    }

    componentWillUnmount() {
        clearInterval(this.intervalId);
    }

    render() {
        return (
            <div className="clock">
                <span>
                    {this.state.time.toLocaleDateString("en-US", {
                        weekday: "short"
                    })}
                    ,{" "}
                    {this.state.time.toLocaleDateString("de-DE", {
                        year: "numeric",
                        month: "numeric",
                        day: "numeric"
                    })}
                </span>
                <span>{this.state.time.toLocaleTimeString()}</span>
            </div>
        );
    }
}
