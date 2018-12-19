import React from "react";
import axios from "./axios";

export default class Shop extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    async handleSubmit(e) {
        e.preventDefault();
        const amount = Number(this.state.amount);
        if (isNaN(amount)) {
            return;
        }
        const { data } = await axios.post("/api/add-expense", this.state);
        console.log("data", data);
        // todo: what happens to the data -> update state, show status
        data.success && this.setState({ showAdder: false });
    }

    async componentDidMount() {
        const { data } = await axios.get("/api/sum-expenses");
        data.success &&
            this.setState({
                monthsum: data.expenses[0].monthsum,
                monthdiff: (300 - data.expenses[0].monthsum).toFixed(2),
                cyclesum: data.expenses[0].cyclesum,
                cyclediff: (1800 - data.expenses[0].cyclesum).toFixed(2)
            });
    }

    render() {
        const { monthsum, monthdiff, cyclesum, cyclediff } = this.state;
        return (
            <div className="shop-container">
                <header>
                    <h3>food coop</h3>
                    <img src="icons/book.png" className="icon" onClick={this.props.showExpenses} />
                </header>
                <hr />
                <p>
                    Σ month: {monthsum} € | Δ month: {monthdiff} €
                </p>
                <p>
                    Σ cycle: {cyclesum} € | Δ cycle: {cyclediff} €
                </p>
                <hr />
                <img
                    src={this.state.showAdder ? "icons/cross.png" : "icons/plus.png"}
                    className="icon"
                    onClick={() => this.setState({ showAdder: !this.state.showAdder })}
                />
                {this.state.showAdder && (
                    <form onSubmit={this.handleSubmit}>
                        <input onChange={this.handleChange} name="day" type="date" />
                        <input onChange={this.handleChange} name="amount" type="text" placeholder="80.00" />
                        <button>save</button>
                    </form>
                )}
            </div>
        );
    }
}
