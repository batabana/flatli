import React from "react";
import axios from "./axios";

export default class Expenses extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    async componentDidMount() {
        const { data } = await axios.get("/api/all-expenses");
        data.success && this.setState({ expenses: data.expenses });
    }

    notHideExpenses(e) {
        e.stopPropagation();
    }

    render() {
        if (!this.state.expenses) {
            return null;
        }
        let prevSum = 0;
        let arrOfExpenses = this.state.expenses.map(elem => {
            let arr = (
                <div key={elem.id} className="expenses">
                    <span>{elem.day}</span>
                    <span>{elem.amount} €</span>
                    <span>{elem.monthsum == prevSum ? "" : elem.monthsum + " €"}</span>
                </div>
            );
            prevSum = elem.monthsum;
            return arr;
        });
        return (
            <div className="modal" onClick={this.props.hideExpenses}>
                <div className="modal-inside" onClick={this.notHideExpenses}>
                    <header>
                        <div />
                        <h3>latest expenses</h3>
                        <img src="icons/cross.png" className="icon" onClick={this.props.hideExpenses} />
                    </header>
                    <div className="expenses header">
                        <span>date</span>
                        <span>amount</span>
                        <span>monthly sum</span>
                    </div>
                    <div className="expense-container">{arrOfExpenses}</div>
                </div>
            </div>
        );
    }
}
