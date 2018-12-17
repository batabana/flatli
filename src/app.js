import React from "react";
import axios from "./axios";
import Dates from "./dates";
import Bar from "./bar";
import Calendar from "./calendar";

export default class App extends React.Component {
    constructor() {
        super();
        this.state = {};
        this.showCalendar = this.showCalendar.bind(this);
        this.hideCalendar = this.hideCalendar.bind(this);
    }

    async componentDidMount() {
        const { data } = await axios.get("/api/currentuser");
        await this.setState({ user: data });
    }

    showCalendar() {
        this.setState({ calendarVisible: true });
    }
    hideCalendar() {
        this.setState({ calendarVisible: false });
    }

    render() {
        if (!this.state.user) {
            return null;
        }
        const currUser = this.state.user[0];
        return (
            <div>
                <div className="app-container">
                    <header>
                        <div className="user-icon">{currUser.id}</div>
                    </header>
                    <Dates showCalendar={this.showCalendar} />
                    <Bar credit={this.state.user[0].credit} />
                    {this.state.calendarVisible && <Calendar date={Date.now()} hideCalendar={this.hideCalendar} />}
                </div>
            </div>
        );
    }
}
