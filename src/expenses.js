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
        let arrOfExpenses = this.state.expenses.map(elem => {
            return (
                <div key={elem.id}>
                    {elem.day}: {elem.amount} €
                </div>
            );
        });
        return (
            <div className="modal" onClick={this.props.hideExpenses}>
                <div className="modal-inside" onClick={this.notHideExpenses}>
                    <header>
                        <div />
                        <h3>Latest Expenses</h3>
                        <img src="icons/cross.png" className="icon" onClick={this.props.hideExpenses} />
                    </header>
                    {arrOfExpenses}
                </div>
            </div>
        );
    }
}
