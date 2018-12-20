import React from "react";
import axios from "./axios";

export default class Expenses extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.deleteExpense = this.deleteExpense.bind(this);
        this.refreshData = this.refreshData.bind(this);
    }

    async refreshData() {
        const { data } = await axios.get("/api/all-expenses");
        data.success && this.setState({ expenses: data.expenses });
    }

    async componentDidMount() {
        this.refreshData();
    }

    notHideExpenses(e) {
        e.stopPropagation();
    }

    async deleteExpense(e) {
        let deleteId = e.target.id;
        const { data } = await axios.get("/api/delete-expense/" + deleteId);
        data.success && this.refreshData();
    }

    render() {
        if (!this.state.expenses) {
            return null;
        }
        let prevSum = 0;
        let arrOfExpenses = this.state.expenses.map(elem => {
            let arr = (
                <div
                    key={elem.id}
                    className="expenses"
                    style={{
                        backgroundColor:
                            this.state.showAskSure && elem.id == this.state.deleteId ? "#c18ca2" : "#FFFFFF"
                    }}
                >
                    <span>{elem.day}</span>
                    <span>{elem.amount} €</span>
                    <span>{elem.monthsum == prevSum ? "" : elem.monthsum + " €"}</span>
                    <div className="delete-icons">
                        {this.state.showAskSure && elem.id == this.state.deleteId ? (
                            <div>
                                <img src="icons/check.png" className="icon" id={elem.id} onClick={this.deleteExpense} />{" "}
                                <img
                                    src="icons/cross.png"
                                    className="icon"
                                    id={elem.id}
                                    onClick={() => this.setState({ showAskSure: false, deleteId: 0 })}
                                />
                            </div>
                        ) : (
                            <img
                                src="icons/trash.png"
                                className="icon"
                                id={elem.id}
                                onClick={() => this.setState({ showAskSure: true, deleteId: elem.id })}
                            />
                        )}
                    </div>
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
