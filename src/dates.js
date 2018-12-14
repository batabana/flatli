import React from "react";
import axios from "./axios";

export default class Dates extends React.Component {
    constructor() {
        super();
        this.state = { showDateAdder: false };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.deleteDate = this.deleteDate.bind(this);
    }

    async componentDidMount() {
        const { data } = await axios.get("/api/dates/");
        this.setState({
            dates: data
        });
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
                {this.state.dates.map(item => {
                    return (
                        <div key={item.id} className="dates">
                            <p>
                                {item.start}
                                <br />
                                {item.end}
                            </p>
                            <span>{item.title}</span>
                            <img src="trash.png" className="icon" onClick={this.deleteDate} id={item.id} />
                        </div>
                    );
                })}
                <p>
                    <img
                        src="plus.png"
                        className="icon"
                        onClick={() => this.setState({ showDateAdder: !this.state.showDateAdder })}
                    />
                </p>
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
