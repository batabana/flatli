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
            <div className="weather-container">
                <header>
                    <img
                        src={weatherIcon + current.icon + ".png"}
                        alt={current.description}
                        title={current.description}
                    />
                    <span>Dresden {current.temp}°C</span>
                    <img src="/icons/reload.png" onClick={this.refreshData} className="icon" />
                </header>
                <div className="forecast">
                    {this.state.forecast.map((item, idx) => {
                        return (
                            <div key={idx}>
                                <div>
                                    <span>{item.date}</span>
                                    <br />
                                    <span>{item.time}</span>
                                </div>
                                <img
                                    src={weatherIcon + item.icon + ".png"}
                                    alt={item.description}
                                    title={item.description}
                                />
                                <span className="min">{item.temp_min}°C</span>
                                <span className="max">{item.temp_max}°C</span>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    }
}
