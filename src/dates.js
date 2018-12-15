import React from "react";
import axios from "./axios";
import { Link } from "react-router-dom";

export default class Dates extends React.Component {
    constructor() {
        super();
        this.state = { showDateAdder: false, batch: 1 };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.deleteDate = this.deleteDate.bind(this);
        this.getDates = this.getDates.bind(this);
        this.handleLeftClick = this.handleLeftClick.bind(this);
        this.handleRightClick = this.handleRightClick.bind(this);
    }

    async getDates() {
        const { data } = await axios.get("/api/dates/" + this.state.batch);
        data.success &&
            this.setState({
                dates: data.dates
            });
    }

    componentDidMount() {
        this.getDates();
    }

    async handleLeftClick() {
        await this.setState({ batch: this.state.batch - 1 });
        this.getDates();
    }

    async handleRightClick() {
        await this.setState({ batch: this.state.batch + 1 });
        this.getDates();
    }

    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    async handleSubmit(e) {
        e.preventDefault();
        const { data } = await axios.post("/api/add-date", this.state);
        data.success && this.setState({ dates: this.state.dates.concat(data.date), showDateAdder: false });
    }

    async deleteDate(e) {
        let deleteId = e.target.id;
        const { data } = await axios.get("/api/delete-date/" + deleteId);
        data.success && this.setState({ dates: this.state.dates.filter(user => user.id != deleteId) });
    }

    render() {
        if (!this.state.dates) {
            return null;
        }
        return (
            <div className="date-container">
                <header>
                    <b>guests | away</b>
                    <Link to="/calendar">
                        <img src="calendar.png" className="icon" />
                    </Link>
                </header>
                {this.state.dates.map(item => {
                    return (
                        <div
                            key={item.id}
                            className="dates"
                            style={{
                                backgroundColor:
                                    this.state.showAskSure && item.id == this.state.deleteId
                                        ? "rgba(255,228,225,0.3)"
                                        : "#FFFFFF"
                            }}
                        >
                            <p>
                                {item.start}
                                <br />- {item.end}
                            </p>
                            <span>{item.title}</span>
                            <div>
                                {this.state.showAskSure && item.id == this.state.deleteId ? (
                                    <div>
                                        <img src="check.png" className="icon" id={item.id} onClick={this.deleteDate} />{" "}
                                        <img
                                            src="cross.png"
                                            className="icon"
                                            id={item.id}
                                            onClick={() => this.setState({ showAskSure: false, deleteId: 0 })}
                                        />
                                    </div>
                                ) : (
                                    <img
                                        src="trash.png"
                                        className="icon"
                                        id={item.id}
                                        onClick={() => this.setState({ showAskSure: true, deleteId: item.id })}
                                    />
                                )}
                            </div>
                        </div>
                    );
                })}
                <div className="icons">
                    {this.state.batch > 1 ? (
                        <img src="left.png" className="icon" onClick={this.handleLeftClick} />
                    ) : (
                        <div className="icon" />
                    )}
                    <img
                        src={this.state.showDateAdder ? "cross.png" : "plus.png"}
                        className="icon"
                        onClick={() => this.setState({ showDateAdder: !this.state.showDateAdder })}
                    />
                    {this.state.dates.length >= 5 ? (
                        <img src="right.png" className="icon" onClick={this.handleRightClick} />
                    ) : (
                        <div className="icon" />
                    )}
                </div>
                {this.state.showDateAdder && (
                    <form onSubmit={this.handleSubmit}>
                        <input onChange={this.handleChange} name="start" type="date" />
                        <input onChange={this.handleChange} name="end" type="date" />
                        <input onChange={this.handleChange} name="title" type="text" placeholder="title" />
                        <button>Save</button>
                    </form>
                )}
            </div>
        );
    }
}
