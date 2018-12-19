import React from "react";
import axios from "./axios";
import Dates from "./dates";
import Bar from "./bar";
import Calendar from "./calendar";
import Shop from "./shop";
import Expenses from "./expenses";

export default class App extends React.Component {
    constructor() {
        super();
        this.state = {};
        this.showCalendar = this.showCalendar.bind(this);
        this.hideCalendar = this.hideCalendar.bind(this);
        this.showExpenses = this.showExpenses.bind(this);
        this.hideExpenses = this.hideExpenses.bind(this);
    }

    async componentDidMount() {
        const { data } = await axios.get("/api/currentuser");
        await this.setState({ user: data });
        console.log("state", this.state.user);
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

    render() {
        if (!this.state.user) {
            return null;
        }
        const user = this.state.user[0];
        return (
            <div className="app-container">
                <header>
                    <img src="acat.png" />
                    <img src="flatli.png" />
                    <a href="/logout">
                        <img src={user.image} alt={user.name} title={user.name} />
                    </a>
                </header>
                <div className="dashboard">
                    <Bar credit={this.state.user[0].credit} />
                    <div>
                        <Dates showCalendar={this.showCalendar} />
                        <Shop showExpenses={this.showExpenses} />
                    </div>
                    {this.state.calendarVisible && <Calendar date={Date.now()} hideCalendar={this.hideCalendar} />}
                    {this.state.expensesVisible && <Expenses date={Date.now()} hideExpenses={this.hideExpenses} />}
                </div>
            </div>
        );
    }
}
