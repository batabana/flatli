import React from "react";
import axios from "./axios";
import Dates from "./dates";
import Bar from "./bar";
import Calendar from "./calendar";
import Current from "./current";
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
        return (
            <div>
                <div className="app-container">
                    <Dates showCalendar={this.showCalendar} />
                    <Bar credit={this.state.user[0].credit} />
                    <Shop showExpenses={this.showExpenses} />
                    <Current user={this.state.user[0].id} />
                    {this.state.calendarVisible && <Calendar date={Date.now()} hideCalendar={this.hideCalendar} />}
                    {this.state.expensesVisible && <Expenses date={Date.now()} hideExpenses={this.hideExpenses} />}
                </div>
            </div>
        );
    }
}
