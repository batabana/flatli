import React from "react";
import axios from "./axios";

export default class Weather extends React.Component {
    constructor() {
        super();
        this.state = {};
        this.refreshData = this.refreshData.bind(this);
    }

    async refreshData() {
        const { data } = await axios.get("/api/weather/");
        data.success &&
            this.setState({
                current: data.current,
                forecast: data.forecast
            });
    }

    async componentDidMount() {
        this.refreshData();
    }

    render() {
        const { current, forecast } = this.state;
        if (!current || !forecast) {
            return null;
        }
        const weatherIcon = "http://openweathermap.org/img/w/";
        return (
            <div>
                <header>
                    <img
                        src={weatherIcon + current.icon + ".png"}
                        alt={current.description}
                        title={current.description}
                    />
                    <span>Dresden {current.temp} °C</span>
                    <img src="/icons/reload.png" onClick={this.refreshData} />
                </header>
                {/* <div className="lines-header">
                    <span>line</span>
                    <span>direction</span>
                    <span>min</span>
                </div>
                <div className="lines-container">
                    {this.state.departures.map(item => {
                        return (
                            <div key={item.id} className="lines">
                                <span>{item.line}</span>
                                <span>{item.direction}</span>
                                <span>{item.arrivalTimeRelative}</span>
                            </div>
                        );
                    })}
                </div> */}
            </div>
        );
    }
}
