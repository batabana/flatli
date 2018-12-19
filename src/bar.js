import React from "react";
import axios from "./axios";

export default class Calendar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.addDrink = this.addDrink.bind(this);
        this.clearCheck = this.clearCheck.bind(this);
        this.savePlus = this.savePlus.bind(this);
    }

    async componentDidMount() {
        const { data } = await axios.get("/api/all-drinks");
        if (data.success) {
            let check = 0;
            for (var i = 0; i < data.drinks.length; i++) {
                check += Number(data.drinks[i].count) * Number(data.drinks[i].price);
            }
            this.setState({ drinks: data.drinks, check, credit: Number(this.props.credit) });
        }
    }

    async addDrink(e) {
        console.log("event", e.target);
        const drinkId = e.target.id || e.target.parentElement.id;
        const price = e.target.getAttribute("price") || e.target.parentElement.getAttribute("price");
        const { data } = await axios.get("/api/add-drink/" + drinkId);
        data.success &&
            this.setState({
                drinks: this.state.drinks.map(item => {
                    if (item.id == drinkId) {
                        item.count = Number(item.count) + 1;
                    }
                    return item;
                }),
                check: Number(this.state.check) + Number(price)
            });
    }

    async clearCheck() {
        const newCredit = this.state.credit - this.state.check;
        const { data } = await axios.post("/api/clear-check", { newCredit });
        data.success &&
            this.setState({
                credit: newCredit,
                check: 0,
                drinks: this.state.drinks.map(item => {
                    item.count = 0;
                    return item;
                })
            });
    }

    async savePlus() {
        const plus = Number(this.state.plus);
        if (isNaN(plus)) {
            return;
        }
        const newCredit = this.state.credit + plus;
        const { data } = await axios.post("/api/update-credit", { newCredit });
        data.success &&
            this.setState({
                credit: newCredit,
                showCashAdder: false
            });
    }

    render() {
        if (!this.state.drinks) {
            return null;
        }
        let arrOfDrinks = this.state.drinks.map(elem => {
            return (
                <div
                    key={elem.id}
                    id={elem.id}
                    style={{ backgroundImage: `url(${elem.image})` }}
                    className="drink-icon"
                    onClick={this.addDrink}
                    price={elem.price}
                >
                    <div id={elem.id} price={elem.price}>
                        <span>{elem.name}</span>
                        <span>{elem.price} €</span>
                        <span>Σ {elem.count}</span>
                    </div>
                </div>
            );
        });
        return (
            <div className="bar-container">
                <h4>bar</h4>
                <span>
                    credit: {this.state.credit.toFixed(2)} € | current check: {this.state.check.toFixed(2)} €
                </span>
                <div className="drinks-container">{arrOfDrinks}</div>
                <div className="drink-buttons">
                    <button onClick={this.clearCheck}>clear check</button>
                    <button onClick={() => this.setState({ showCashAdder: true })}>pay in</button>
                    {this.state.showCashAdder && (
                        <div className="drink-buttons">
                            <input
                                onChange={e => this.setState({ plus: e.target.value })}
                                name="plus"
                                placeholder="10.00"
                                type="text"
                            />
                            <img src="icons/check.png" className="icon" onClick={this.savePlus} />
                            <img
                                src="icons/cross.png"
                                className="icon"
                                onClick={() => this.setState({ showCashAdder: false })}
                            />
                        </div>
                    )}
                </div>
            </div>
        );
    }
}
