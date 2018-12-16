import React from "react";
import axios from "./axios";

export default class Calendar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.addDrink = this.addDrink.bind(this);
    }

    async componentDidMount() {
        const { data } = await axios.get("/api/all-drinks");
        if (data.success) {
            let total = 0;
            for (var i = 0; i < data.drinks.length; i++) {
                total += Number(data.drinks[i].count) * Number(data.drinks[i].price);
            }
            this.setState({ drinks: data.drinks, total });
        }
    }

    async addDrink(e) {
        const drinkId = e.target.id;
        const price = e.target.getAttribute("price");
        const { data } = await axios.get("/api/add-drink/" + drinkId);
        data.success &&
            this.setState({
                drinks: this.state.drinks.map(item => {
                    if (item.id == drinkId) {
                        item.count = Number(item.count) + 1;
                    }
                    return item;
                }),
                total: Number(this.state.total) + Number(price)
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
                    price={elem.price}
                    style={{ backgroundImage: `url(${elem.image})` }}
                    className="drink-icon"
                    onClick={this.addDrink}
                >
                    <p>{elem.name}</p>
                    <p>Σ {elem.count}</p>
                    <p>{elem.price} €</p>
                </div>
            );
        });
        return (
            <div className="bar-container">
                <h4>bar</h4>
                <span>
                    account balance: {this.props.credit} € | current bill: {this.state.total.toFixed(2)} €
                </span>
                <div className="drinks-container">{arrOfDrinks}</div>
            </div>
        );
    }
}
