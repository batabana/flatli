import React from "react";
import axios from "./axios";

export default class DvbMonitor extends React.Component {
    constructor() {
        super();
        this.state = {};
        this.refreshData = this.refreshData.bind(this);
    }

    async refreshData() {
        const { data } = await axios.get("/api/public/");
        data.success &&
            this.setState({
                departures: data.data
            });
    }

    async componentDidMount() {
        this.refreshData();
    }

    render() {
        if (!this.state.departures) {
            return null;
        }
        return (
            <div className="dvb-container">
                <header>
                    <img src="/icons/stop.png" />
                    <span className="dvb-headline">Albertplatz</span>
                    <img src="/icons/reload.png" onClick={this.refreshData} className="icon" />
                </header>
                <main>
                    <div className="lines-header">
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
                    </div>
                </main>
            </div>
        );
    }
}
