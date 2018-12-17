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
        console.log("data", data);
        data.success &&
            this.setState({
                monthsum: data.expenses[0].sum,
                monthdiff: 300 - data.expenses[0].sum
            });
    }

    render() {
        return (
            <div className="shop-container">
                <header>
                    <h4>vg | shop</h4>
                    <img src="icons/book.png" className="icon" onClick={this.props.showExpenses} />
                </header>
                <p>
                    Σ month: {this.state.monthsum} € | Δ month: {this.state.monthdiff} €
                </p>
                <p>Σ cycle: | Δ cycle: </p>
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
