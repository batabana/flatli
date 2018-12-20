import React from "react";
import axios from "./axios";
import Dates from "./dates";
import Bar from "./bar";
import Calendar from "./calendar";
import Shop from "./shop";
import Expenses from "./expenses";
import Header from "./header";
import Gif from "./gif";

export default class App extends React.Component {
    constructor() {
        super();
        this.state = {};
        this.showCalendar = this.showCalendar.bind(this);
        this.hideCalendar = this.hideCalendar.bind(this);
        this.showExpenses = this.showExpenses.bind(this);
        this.hideExpenses = this.hideExpenses.bind(this);
        this.showGif = this.showGif.bind(this);
        this.hideGif = this.hideGif.bind(this);
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

    showExpenses() {
        this.setState({ expensesVisible: true });
    }

    hideExpenses() {
        this.setState({ expensesVisible: false });
    }

    showGif() {
        this.setState({ gifVisible: true });
    }

    hideGif() {
        this.setState({ gifVisible: false });
    }

    render() {
        if (!this.state.user) {
            return null;
        }
        const user = this.state.user[0];
        return (
            <div className="app-container">
                <Header userimage={user.image} username={user.name} showGif={this.showGif} />
                <div className="dashboard">
                    <Bar credit={this.state.user[0].credit} />
                    <div>
                        <Dates showCalendar={this.showCalendar} />
                        <Shop showExpenses={this.showExpenses} />
                    </div>
                    {this.state.calendarVisible && <Calendar date={Date.now()} hideCalendar={this.hideCalendar} />}
                    {this.state.expensesVisible && <Expenses date={Date.now()} hideExpenses={this.hideExpenses} />}
                    {this.state.gifVisible && <Gif hideGif={this.hideGif} />}
                </div>
            </div>
        );
    }
}
